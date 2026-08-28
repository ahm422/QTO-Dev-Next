import { describe, it, expect } from "vitest"
import { sanitizeHtml, sanitizeRichHtml, isHtmlBody, stripHtml } from "./sanitize-html"

describe("sanitizeHtml — images", () => {
  it("keeps an https <img> with src/alt/width/height/loading", () => {
    const out = sanitizeHtml(
      '<p><img src="https://pub-abc.r2.dev/media/x/pic.png" alt="Pic" width="640" height="360" loading="lazy"></p>',
    )
    expect(out).toContain('src="https://pub-abc.r2.dev/media/x/pic.png"')
    expect(out).toContain('alt="Pic"')
    expect(out).toContain('width="640"')
    expect(out).toContain('height="360"')
    expect(out).toContain('loading="lazy"')
  })

  it("keeps a root-relative <img> (dev /api/media proxy)", () => {
    const out = sanitizeHtml('<img src="/api/media/media/x/pic.png" alt="local">')
    expect(out).toContain('src="/api/media/media/x/pic.png"')
  })

  it("drops the src of an http: <img>", () => {
    const out = sanitizeHtml('<img src="http://evil.example/x.png" alt="x">')
    expect(out).not.toContain("http://evil.example")
  })

  it("drops the src of a data: <img>", () => {
    const out = sanitizeHtml('<img src="data:image/png;base64,iVBORw0KGgo=" alt="x">')
    expect(out).not.toContain("data:image")
  })

  it("drops a javascript: src", () => {
    const out = sanitizeHtml('<img src="javascript:alert(1)" alt="x">')
    expect(out).not.toContain("javascript:")
  })

  it("strips an onerror handler from <img>", () => {
    const out = sanitizeHtml('<img src="https://pub-abc.r2.dev/x.png" onerror="alert(1)">')
    expect(out).not.toContain("onerror")
  })

  it("blocks a protocol-relative //host src", () => {
    const out = sanitizeHtml('<img src="//evil.example/x.png" alt="x">')
    expect(out).not.toContain("evil.example")
  })
})

describe("sanitizeHtml — block elements", () => {
  it("keeps blockquote and hr", () => {
    const out = sanitizeHtml("<blockquote><p>quote</p></blockquote><hr>")
    expect(out).toContain("<blockquote>")
    expect(out).toContain("<hr />")
  })

  it("strips <script>", () => {
    const out = sanitizeHtml('<p>hi</p><script>alert(1)</script>')
    expect(out).not.toContain("<script")
    expect(out).toContain("<p>hi</p>")
  })

  it("keeps safe anchors, drops javascript: hrefs", () => {
    expect(sanitizeHtml('<a href="https://x.com">x</a>')).toContain('href="https://x.com"')
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).not.toContain("javascript:")
  })
})

describe("sanitizeRichHtml — legacy long-form bodies", () => {
  it("keeps <b>/<i>/<span> and safe inline styles", () => {
    const out = sanitizeRichHtml(
      '<p class="MsoNormal"><span style="font-size:16.0pt;color:#333"><b>Heading</b></span></p>',
    )
    expect(out).toContain("<b>Heading</b>")
    expect(out).toContain("<span")
    expect(out).toContain("class=\"MsoNormal\"")
    expect(out).toContain("font-size")
  })

  it("keeps tables", () => {
    const out = sanitizeRichHtml("<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>")
    expect(out).toContain("<table>")
    expect(out).toContain("<td>a</td>")
  })

  it("still strips <script>, handlers and javascript: urls", () => {
    const out = sanitizeRichHtml(
      '<p onclick="x()">hi<script>alert(1)</script><a href="javascript:alert(1)">l</a></p>',
    )
    expect(out).not.toContain("<script")
    expect(out).not.toContain("onclick")
    expect(out).not.toContain("javascript:")
    expect(out).toContain("hi")
  })

  it("drops url(javascript:) inside style", () => {
    const out = sanitizeRichHtml('<p style="background-image:url(javascript:alert(1))">x</p>')
    expect(out).not.toContain("javascript:")
  })

  it("still restricts <img> to https/relative", () => {
    expect(sanitizeRichHtml('<img src="http://evil/x.png">')).not.toContain("http://evil")
    expect(sanitizeRichHtml('<img src="https://pub-abc.r2.dev/x.png">')).toContain("https://pub-abc.r2.dev/x.png")
  })
})

describe("isHtmlBody / stripHtml", () => {
  it("detects HTML bodies", () => {
    expect(isHtmlBody("<p>hi</p>")).toBe(true)
    expect(isHtmlBody("just text")).toBe(false)
  })

  it("returns plain text untouched", () => {
    expect(stripHtml("just text")).toBe("just text")
  })

  it("strips tags from HTML", () => {
    expect(stripHtml("<p>hello <strong>world</strong></p>")).toBe("hello world")
  })
})

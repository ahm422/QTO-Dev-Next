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

  it("drops empty Word wrappers/nested layout tables but keeps genuinely empty data cells", () => {
    const out = sanitizeRichHtml(
      "<table><tbody>" +
        "<tr><td><table class=\"MsoNormalTable\"><tbody><tr><td></td></tr></tbody></table>" +
        "<p><span> </span></p><p><b><span>Header</span></b></p></td><td></td></tr>" +
        "<tr><td>a</td><td>b</td></tr>" +
        "</tbody></table>",
    )
    expect(out).not.toContain("MsoNormalTable") // empty nested layout table gone
    expect(out).not.toMatch(/<p>\s*<\/p>/) // &nbsp;-only spacer gone
    expect(out).toContain("Header")
    // The real (empty) second column cell in row 1 is preserved so columns line up.
    expect(out).toContain("<td></td>")
  })

  it("drops Word's near-black inline color so themed text stays visible, keeps real colors", () => {
    for (const black of ["black", "windowtext", "#000", "#000000", "rgb(0,0,0)"]) {
      const out = sanitizeRichHtml(`<span style="color:${black}">x</span>`)
      expect(out).not.toMatch(/color\s*:/i)
    }
    // A genuine authored colour survives.
    expect(sanitizeRichHtml('<span style="color:#e11d48">x</span>')).toContain("color:#e11d48")
    expect(sanitizeRichHtml('<span style="color:#333">x</span>')).toContain("color:#333")
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

describe("anchor normalisation — dofollow + link styling", () => {
  it("strips nofollow (and sponsored/ugc) from rel, keeps the rest", () => {
    const out = sanitizeRichHtml(
      '<a href="https://external.example/x" rel="noopener noreferrer nofollow sponsored ugc">x</a>',
    )
    expect(out).not.toContain("nofollow")
    expect(out).not.toContain("sponsored")
    expect(out).not.toContain("ugc")
    expect(out).toContain("noopener")
    expect(out).toContain("noreferrer")
  })

  it("keeps target=_blank external links secure with rel=noopener noreferrer", () => {
    const out = sanitizeRichHtml('<a href="https://external.example/x">x</a>')
    expect(out).toContain('target="_blank"')
    expect(out).toMatch(/rel="[^"]*noopener[^"]*noreferrer[^"]*"/)
    expect(out).not.toContain("nofollow")
  })

  it("makes internal links same-tab and dofollow (no target, no rel)", () => {
    const rel = sanitizeRichHtml('<a href="/blogs/what-is-website-development">x</a>')
    expect(rel).toContain('href="/blogs/what-is-website-development"')
    expect(rel).not.toContain("target=")
    expect(rel).not.toContain("rel=")

    const abs = sanitizeRichHtml(
      '<a href="https://qtodev.com/blogs/x" rel="nofollow" target="_blank">x</a>',
    )
    expect(abs).not.toContain("target=")
    expect(abs).not.toContain("rel=")
  })

  it("leaves mailto:/tel: links untouched (no target/rel added)", () => {
    const mail = sanitizeRichHtml('<a href="mailto:info@qto.dev">mail</a>')
    expect(mail).toContain('href="mailto:info@qto.dev"')
    expect(mail).not.toContain("target=")
    expect(mail).not.toContain("rel=")
  })

  it("strips inline color / text-decoration from <a> but not from <span>", () => {
    const out = sanitizeRichHtml(
      '<p><span style="color:#333"><a href="https://external.example" style="color:inherit;text-decoration:none;font-weight:700">link</a></span></p>',
    )
    const anchor = out.slice(out.indexOf("<a"), out.indexOf("</a>"))
    expect(anchor).not.toMatch(/color\s*:/)
    expect(anchor).not.toMatch(/text-decoration\s*:/)
    expect(anchor).toMatch(/font-weight\s*:\s*700/)
    // colour on the wrapping span is still allowed elsewhere
    expect(out).toContain('<span style="color:#333">')
  })

  it("normalises rel on the strict profile too", () => {
    const out = sanitizeHtml('<a href="https://external.example" rel="nofollow">x</a>')
    expect(out).not.toContain("nofollow")
    expect(out).toContain("noopener")
  })

  it("keeps table structure + colspan/rowspan while normalising anchors inside", () => {
    const out = sanitizeRichHtml(
      '<table><thead><tr><th colspan="2">h</th></tr></thead><tbody><tr><td rowspan="2"><a href="/x" rel="nofollow">c</a></td></tr></tbody></table>',
    )
    expect(out).toContain('colspan="2"')
    expect(out).toContain('rowspan="2"')
    expect(out).toContain("<td")
    expect(out).not.toContain("nofollow")
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

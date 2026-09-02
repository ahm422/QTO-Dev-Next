import { describe, it, expect } from "vitest"
import {
  sanitizeHtml,
  sanitizeRichHtml,
  isHtmlBody,
  stripHtml,
  linkifyPlainText,
  linkifyHtml,
  wrapTables,
} from "./sanitize-html"

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

describe("sanitizeHtml — inline colour / highlight marks (strict profile)", () => {
  it("keeps a <span> with an authored text colour", () => {
    const out = sanitizeHtml('<p><span style="color:var(--rte-text-blue)">tint</span></p>')
    expect(out).toContain("<span")
    expect(out).toContain("color:var(--rte-text-blue)")
  })

  it("keeps a <span> highlight (background-color) and a <mark>", () => {
    const out = sanitizeHtml(
      '<p><span style="background-color:rgb(250 204 21 / 0.35)">hl</span> <mark>m</mark></p>',
    )
    expect(out).toContain("background-color:rgb(250 204 21 / 0.35)")
    expect(out).toContain("<mark>m</mark>")
  })

  it("keeps a bold link — <strong> and <a> both survive, either nesting", () => {
    expect(sanitizeHtml('<p><strong><a href="/x">b</a></strong></p>')).toMatch(
      /<strong><a[^>]*href="\/x"[^>]*>b<\/a><\/strong>/,
    )
    expect(sanitizeHtml('<p><a href="/x"><strong>b</strong></a></p>')).toMatch(
      /<a[^>]*href="\/x"[^>]*><strong>b<\/strong><\/a>/,
    )
  })

  it("keeps an authored colour carrier nested inside a link", () => {
    const out = sanitizeHtml(
      '<p><a href="https://x.com"><span style="color:var(--rte-text-green)">c</span></a></p>',
    )
    expect(out).toContain("<span")
    expect(out).toContain("color:var(--rte-text-green)")
  })

  it("still strips inline style from the <a> itself", () => {
    const out = sanitizeHtml(
      '<a href="https://x.com" style="color:red;text-decoration:none">x</a>',
    )
    const anchor = out.slice(out.indexOf("<a"), out.indexOf("</a>"))
    expect(anchor).not.toMatch(/style=/)
  })

  it("drops near-black colour and disallowed style props", () => {
    expect(sanitizeHtml('<span style="color:black">x</span>')).not.toMatch(/color\s*:/i)
    expect(sanitizeHtml('<span style="color:windowtext">x</span>')).not.toMatch(/color\s*:/i)
    // font-size / position / line-height are not in STRICT_SAFE_STYLE
    const out = sanitizeHtml('<span style="color:#e11d48;font-size:40px;position:fixed">x</span>')
    expect(out).toContain("color:#e11d48")
    expect(out).not.toContain("font-size")
    expect(out).not.toContain("position")
  })

  it("still strips <script>, event handlers and javascript: from styled markup", () => {
    const out = sanitizeHtml(
      '<span style="color:#333" onclick="x()">hi</span><script>alert(1)</script>',
    )
    expect(out).not.toContain("<script")
    expect(out).not.toContain("onclick")
    expect(out).toContain("hi")
  })

  it("drops an empty <span> left behind by clearing a colour", () => {
    expect(sanitizeHtml("<p>a<span></span>b</p>")).toBe("<p>ab</p>")
  })
})

describe("sanitizeHtml — tables (strict profile)", () => {
  it("keeps table structure, colspan/rowspan and per-cell text-align", () => {
    const out = sanitizeHtml(
      '<table><thead><tr><th colspan="2">h</th></tr></thead>' +
        '<tbody><tr><td rowspan="2"><p style="text-align:center">c</p></td><td>d</td></tr></tbody></table>',
    )
    expect(out).toContain("<table>")
    expect(out).toContain("<thead>")
    expect(out).toContain('colspan="2"')
    expect(out).toContain('rowspan="2"')
    expect(out).toContain("text-align:center")
  })

  it("normalises anchors inside a table and drops nofollow", () => {
    const out = sanitizeHtml(
      '<table><tbody><tr><td><a href="/x" rel="nofollow">c</a></td></tr></tbody></table>',
    )
    expect(out).toContain("<td>")
    expect(out).not.toContain("nofollow")
  })
})

describe("wrapTables", () => {
  it("wraps each <table> in a horizontal-scroll container", () => {
    const out = wrapTables("<p>x</p><table><tbody><tr><td>a</td></tr></tbody></table>")
    expect(out).toBe(
      '<p>x</p><div class="overflow-x-auto"><table><tbody><tr><td>a</td></tr></tbody></table></div>',
    )
  })

  it("wraps a <table> that carries attributes", () => {
    expect(wrapTables('<table class="x"><tr><td>a</td></tr></table>')).toBe(
      '<div class="overflow-x-auto"><table class="x"><tr><td>a</td></tr></table></div>',
    )
  })

  it("is a no-op when there is no table", () => {
    expect(wrapTables("<p>no tables here</p>")).toBe("<p>no tables here</p>")
    expect(wrapTables("")).toBe("")
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

describe("linkifyPlainText", () => {
  it("wraps a bare https:// URL in an anchor", () => {
    const out = linkifyPlainText("visit https://example.com now")
    expect(out).toBe('visit <a href="https://example.com">https://example.com</a> now')
  })

  it("gives a www. host an https:// href", () => {
    const out = linkifyPlainText("see www.example.com")
    expect(out).toBe('see <a href="https://www.example.com">www.example.com</a>')
  })

  it("keeps trailing sentence punctuation outside the anchor", () => {
    const out = linkifyPlainText("read https://example.com/page.")
    expect(out).toBe(
      'read <a href="https://example.com/page">https://example.com/page</a>.',
    )
  })

  it("HTML-escapes the surrounding text", () => {
    const out = linkifyPlainText("a < b & c https://example.com")
    expect(out).toBe(
      'a &lt; b &amp; c <a href="https://example.com">https://example.com</a>',
    )
  })

  it("returns escaped text unchanged when there is no URL", () => {
    expect(linkifyPlainText('Tom & Jerry <best>')).toBe("Tom &amp; Jerry &lt;best&gt;")
    expect(linkifyPlainText("")).toBe("")
  })

  it("normalises to a secure dofollow external link once sanitised", () => {
    const out = sanitizeHtml(linkifyPlainText("visit https://external.example for more"))
    expect(out).toContain('href="https://external.example"')
    expect(out).toContain('target="_blank"')
    expect(out).toMatch(/rel="[^"]*noopener[^"]*noreferrer[^"]*"/)
    expect(out).not.toContain("nofollow")
  })
})

describe("linkifyHtml — bare URLs typed into the editor", () => {
  it("wraps a bare URL sitting in a <p> text node", () => {
    const out = linkifyHtml("<p>QTO DEV https://qtoerp.com creates experiences</p>")
    expect(out).toBe(
      '<p>QTO DEV <a href="https://qtoerp.com">https://qtoerp.com</a> creates experiences</p>',
    )
  })

  it("gives a www. host an https:// href", () => {
    expect(linkifyHtml("<p>see www.example.com</p>")).toBe(
      '<p>see <a href="https://www.example.com">www.example.com</a></p>',
    )
  })

  it("keeps trailing punctuation outside the anchor", () => {
    expect(linkifyHtml("<p>read https://example.com/page.</p>")).toBe(
      '<p>read <a href="https://example.com/page">https://example.com/page</a>.</p>',
    )
  })

  it("leaves a URL that is already inside an <a> untouched", () => {
    const input = '<p><a href="https://example.com">https://example.com</a></p>'
    expect(linkifyHtml(input)).toBe(input)
  })

  it("does not touch a URL that only appears in an attribute", () => {
    const input = '<p><a href="https://example.com">click here</a></p>'
    expect(linkifyHtml(input)).toBe(input)
  })

  it("does not double-escape existing entities in the text node", () => {
    expect(linkifyHtml("<p>Tom &amp; Jerry https://example.com</p>")).toBe(
      '<p>Tom &amp; Jerry <a href="https://example.com">https://example.com</a></p>',
    )
  })

  it("is a no-op when there is no URL", () => {
    expect(linkifyHtml("<p>just some prose</p>")).toBe("<p>just some prose</p>")
  })

  it("normalises to a secure dofollow external link once sanitised", () => {
    const out = sanitizeHtml(linkifyHtml("<p>QTO DEV https://qtoerp.com rocks</p>"))
    expect(out).toContain('href="https://qtoerp.com"')
    expect(out).toContain('target="_blank"')
    expect(out).toMatch(/rel="[^"]*noopener[^"]*noreferrer[^"]*"/)
    expect(out).not.toContain("nofollow")
  })

  it("keeps an internal bare URL dofollow and same-tab once sanitised", () => {
    const out = sanitizeHtml(linkifyHtml("<p>more at https://qtodev.com/about here</p>"))
    expect(out).toContain('href="https://qtodev.com/about"')
    expect(out).not.toContain("target=")
    expect(out).not.toContain("rel=")
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

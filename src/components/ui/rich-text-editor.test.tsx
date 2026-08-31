// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it } from "vitest"
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"

import { RichTextEditor } from "./rich-text-editor"
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider"

/**
 * Regression guard for #418 — editor text must stay legible in BOTH admin
 * themes, and the portaled block-style menu must carry the admin theme class
 * (it renders outside the .admin-* wrapper).
 *
 * jsdom does not run Tailwind and does NOT resolve `var()` in
 * getComputedStyle, so we inject the rules under test with the *resolved*
 * per-theme colours. KEEP THESE IN SYNC with src/app/globals.css:
 *   - `--foreground` in the .admin-light / .admin-dark token blocks
 *   - `[data-slot="rich-text-editor"] { background-color: var(--background) }`
 *     → --background is #ffffff (admin-light) / #0F0F12 (admin-dark)
 *   - the `[data-slot="rich-text-editor"] .tiptap` contrast-floor rules
 *
 * The dark-surface case is the #418 regression: an admin-dark editor with no
 * `.dark` on <html> used to inherit the page's near-white public background
 * and render near-white text on it.
 */
const THEME_CSS = `
  .admin-light [data-slot="rich-text-editor"] { background-color: #ffffff; }
  .admin-dark  [data-slot="rich-text-editor"] { background-color: #0F0F12; }
  .admin-light [data-slot="rich-text-editor"] .tiptap { color: #09090b; }
  .admin-dark  [data-slot="rich-text-editor"] .tiptap { color: #fafafa; }
`

beforeAll(() => {
  const style = document.createElement("style")
  style.textContent = THEME_CSS
  document.head.appendChild(style)
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

async function renderEditor(theme: "light" | "dark") {
  window.localStorage.setItem("admin-theme", theme)
  const utils = render(
    <AdminThemeProvider>
      <RichTextEditor value="<p>hello world</p>" onChange={() => {}} placeholder="Write…" />
    </AdminThemeProvider>,
  )
  const tiptap = await waitFor(() => {
    const el = utils.container.querySelector<HTMLElement>(".tiptap")
    if (!el) throw new Error("editor not mounted")
    return el
  })
  const slot = utils.container.querySelector<HTMLElement>('[data-slot="rich-text-editor"]')!
  return { ...utils, tiptap, slot }
}

describe("RichTextEditor theming (#418)", () => {
  it("renders near-black text on a light surface in admin-light", async () => {
    const { tiptap, slot } = await renderEditor("light")
    expect(getComputedStyle(tiptap).color).toBe("rgb(9, 9, 11)")
    expect(getComputedStyle(slot).backgroundColor).toBe("rgb(255, 255, 255)")
  })

  it("renders near-white text on a dark surface in admin-dark", async () => {
    const { tiptap, slot } = await renderEditor("dark")
    const color = getComputedStyle(tiptap).color
    const bg = getComputedStyle(slot).backgroundColor
    expect(color).toBe("rgb(250, 250, 250)")
    // #418: the surface must NOT fall through to the page's public near-white
    // background, or this is near-white text on near-white.
    expect(bg).toBe("rgb(15, 15, 18)")
    expect(bg).not.toBe("rgb(255, 255, 255)")
  })

  it("text colour differs between the two admin themes", async () => {
    const light = await renderEditor("light")
    const lightColor = getComputedStyle(light.tiptap).color
    cleanup()
    const dark = await renderEditor("dark")
    const darkColor = getComputedStyle(dark.tiptap).color
    expect(lightColor).not.toBe(darkColor)
  })

  it("portals the block-style menu with the current admin theme class", async () => {
    await renderEditor("light")
    // Radix opens the menu on keyboard activation reliably under jsdom
    // (pointer events aren't fully implemented there).
    const trigger = document.querySelector<HTMLElement>('[data-slot="dropdown-menu-trigger"]')!
    trigger.focus()
    fireEvent.keyDown(trigger, { key: "Enter" })
    const menu = await waitFor(() => {
      const el = document.querySelector<HTMLElement>('[role="menu"]')
      if (!el) throw new Error("menu not open")
      return el
    })
    expect(menu.className).toContain("admin-light")
    expect(menu.className).not.toContain("admin-dark")
  })
})

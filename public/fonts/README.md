# Fonts

**General Sans** (headings) is loaded from the Fontshare package in this folder.

- **Source:** [Fontshare – General Sans](https://www.fontshare.com/fonts/general-sans)
- **Layout:** Keep the `Fonts/WEB/fonts/` structure from the Fontshare ZIP. The app uses the variable font:
  - `Fonts/WEB/fonts/GeneralSans-Variable.woff2` (weights 200–700 in one file)
- **Loader:** `src/app/fonts.ts` loads this via `next/font/local` and exposes `--font-general-sans` for headings (h1–h6).

Do not remove or rename `Fonts/WEB/fonts/GeneralSans-Variable.woff2` or the build will fail.

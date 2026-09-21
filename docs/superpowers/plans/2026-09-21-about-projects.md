# About Projects Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the About essay with a bilingual portfolio for ShowcaseApp, webdav-image-saver, NewPicTab, and ScreenDeck, followed by Ko-fi and WeChat support options.

**Architecture:** Keep About metadata and its short introduction in the existing content entry. Add one focused Astro component that owns project data, responsive presentation, links, and support UI, then render it from the existing About route. Store all display images locally under `public/img/projects/` so both GitHub Pages and Cloudflare Pages produce the same self-contained page.

**Tech Stack:** Astro 7, Tailwind CSS 4 utility classes, existing SVG icon components, static public assets.

---

### Task 1: Add Local Project Assets

**Files:**
- Create: `public/img/projects/showcase.jpg`
- Create: `public/img/projects/webdav-image-saver.jpg`
- Create: `public/img/projects/newpictab.jpg`
- Create: `public/img/projects/screendeck.jpg`
- Create: `public/img/projects/wechat-donate.png`

- [ ] Download one meaningful product screenshot for each project from its official `mrjoechen` repository.
- [ ] Download the existing WeChat appreciation QR code from `ShowcaseApp/docs/images/wechat_donate.png`.
- [ ] Inspect all five files and confirm they are valid, non-empty images with sensible dimensions.

### Task 2: Replace About Copy

**Files:**
- Modify: `src/content/pages/about.md`

- [ ] Keep the existing frontmatter schema but update the description to describe the portfolio.
- [ ] Replace the essay with a concise English introduction followed by its Chinese counterpart.
- [ ] Run `npx prettier --check src/content/pages/about.md` and expect a zero exit code.

### Task 3: Build the Portfolio Component

**Files:**
- Create: `src/components/ProjectPortfolio.astro`

- [ ] Define typed local project data for all four projects, including names, platform labels, bilingual descriptions, local image paths, website links, and GitHub links.
- [ ] Render ShowcaseApp as the lead full-width project and render the remaining projects in a responsive grid.
- [ ] Use real screenshots with dimensions, descriptive alt text, lazy loading for below-fold images, and stable aspect ratios.
- [ ] Render accessible external website and GitHub actions using the existing arrow and GitHub icon assets.
- [ ] Add a bilingual support section with `https://ko-fi.com/joechen` and the local WeChat QR image.
- [ ] Preserve existing color tokens, keep radii at 8px or less, avoid nested cards, and provide responsive mobile stacking.

### Task 4: Integrate the Component

**Files:**
- Modify: `src/pages/about.astro`

- [ ] Import `ProjectPortfolio.astro`.
- [ ] Keep the existing content entry, Layout, Header, Breadcrumb, Main, and Footer flow.
- [ ] Render the shortened Markdown introduction before the portfolio component.

### Task 5: Verify and Preview

**Files:**
- Verify: `src/content/pages/about.md`
- Verify: `src/components/ProjectPortfolio.astro`
- Verify: `src/pages/about.astro`

- [ ] Run `npm run format:check` and confirm it exits successfully.
- [ ] Run `npm run lint` and confirm it exits successfully.
- [ ] Run `npm run build` and confirm Astro, TypeScript, Pagefind, and static generation succeed.
- [ ] Start `npm run dev -- --host 127.0.0.1` without committing changes.
- [ ] Inspect `/about/` at desktop and mobile viewport sizes for image loading, text overflow, focus behavior, light/dark styling, and working support links.
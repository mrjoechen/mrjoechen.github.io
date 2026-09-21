# About Projects Page Design

## Goal

Replace the existing long-form About essay with a concise bilingual portfolio that presents Joe Chen's current personal projects and gives visitors clear ways to explore the work or offer support.

## Page Structure

1. A short English and Chinese introduction that identifies Joe as a developer who builds practical, local-first tools around images, browsers, and connected displays.
2. ShowcaseApp as the lead project in a full-width feature section with a real product image, a concise bilingual description, and links to its website and GitHub repository.
3. A compact responsive project grid for webdav-image-saver, NewPicTab, and ScreenDeck. Each project includes a real screenshot, platform or technology label, bilingual description, project website link, and GitHub link.
4. A support section containing a Ko-fi link labelled "Buy me a coffee" and the existing WeChat appreciation QR code, with short bilingual explanatory text.

## Project Content

- **ShowcaseApp:** A Kotlin Multiplatform application for displaying image collections from local folders and remote sources such as FTP, SFTP, SMB, WebDAV, and TMDB.
- **webdav-image-saver:** A privacy-focused Chrome extension for saving individual or batched web images directly to one or more WebDAV servers.
- **NewPicTab:** A minimal Chrome new-tab extension that uses local, WebDAV, URL, JSON API, or TMDB images while keeping optional clock, weather, search, and shortcuts unobtrusive.
- **ScreenDeck:** Local-first firmware and a web controller that turn an ESP32-S3-4848S040 into a swipeable 480 x 480 content display.

Descriptions remain concise rather than reproducing full README feature lists.

## Visual Direction

- Preserve the site's existing typography, color tokens, header, breadcrumb, footer, and light/dark themes.
- Keep the page editorial and work-focused rather than using a marketing hero.
- Make ShowcaseApp visibly primary; keep the remaining projects equal in hierarchy.
- Use real project screenshots downloaded into `public/img/projects/` rather than remote hotlinks.
- Keep card radii at 8px or less, avoid nested cards, and use existing icon conventions for external links.
- Stack project content and support methods cleanly on mobile without cropped text or horizontal scrolling.

## Implementation Boundary

- Update the About content and presentation only.
- Reuse the existing About route, global layout, navigation, and content collection.
- Add only the project image and WeChat QR assets needed by this page.
- Do not add project detail routes, analytics, payment processing, or a new content model.
- Do not change Giscus configuration, deployment configuration, or canonical-domain configuration.

## Links

- ShowcaseApp website: `https://showcase.joechen.space/`
- ShowcaseApp repository: `https://github.com/mrjoechen/ShowcaseApp`
- webdav-image-saver website: `https://mrjoechen.github.io/webdav-image-saver/`
- webdav-image-saver repository: `https://github.com/mrjoechen/webdav-image-saver`
- NewPicTab website: `https://mrjoechen.github.io/NewPicTab/`
- NewPicTab repository: `https://github.com/mrjoechen/NewPicTab`
- ScreenDeck website: `https://mrjoechen.github.io/ScreenDeck/`
- ScreenDeck repository: `https://github.com/mrjoechen/ScreenDeck`
- Ko-fi: `https://ko-fi.com/joechen`
- WeChat QR source: `https://github.com/mrjoechen/ShowcaseApp/blob/main/docs/images/wechat_donate.png`

## Acceptance Criteria

- The About page presents all four named projects with accurate bilingual descriptions and working project/repository links.
- ShowcaseApp is the lead project and the other three remain easy to scan.
- Ko-fi and the WeChat appreciation QR code are both visible in the support section.
- Images are local, meaningful project assets and include useful alternative text.
- The page works at mobile and desktop widths in both light and dark themes.
- `npm run build`, lint, and formatting checks pass.
- Existing comments, search, RSS, sitemap, and deployment behavior are unchanged.
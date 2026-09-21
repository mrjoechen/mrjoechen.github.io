# Joe’s Blog

Personal blog based on [AstroPaper](https://github.com/satnaing/astro-paper), built with Astro.

## Local preview

Requires Node.js >= 22.12.0.

```sh
npm install
npm run build
npm run dev -- --host 127.0.0.1
```

Open http://127.0.0.1:4321. Build once (and again after editing articles) to refresh the Pagefind search index. Use `npm run preview -- --host 127.0.0.1` to preview the production build.

## Edit

- Site settings: `astro-paper.config.ts`
- Home: `src/pages/index.astro`
- Article: `src/content/posts/showcase.md`
- About: `src/content/pages/about.md`
- Static assets: `public/`

The old Jekyll article URLs redirect to `/posts/showcase/`. The article retains its original front-matter date (April 1, 2023). App ads and Google verification files remain available at their original paths. The default domain is `https://mrjoechen.github.io`; no custom-domain CNAME is needed.

## Publish

`.github/workflows/deploy.yml` installs locked dependencies with Node 24, checks lint/formatting, builds the search index and deploys `dist` after a push to `master`. It can also be run manually. In repository Settings → Pages, select GitHub Actions and set the custom domain to `mrjoechen.github.io`, with HTTPS enabled. This workflow does not change DNS. No commit or push is performed by the local setup.

## Comments

Giscus uses the public repository’s Announcements discussion category. Public IDs are in `src/comments.config.ts`; no secret is needed. Enable Discussions and install the giscus GitHub App for that repository. An empty category ID disables the widget until setup is complete.

Comments appear only under articles, use strict pathname mapping, and follow the site's light/dark theme. Keep article paths stable to preserve comment associations. The component remounts on Astro navigation and cleans up its theme observer. Comments posted from local preview go to the same public repository; avoid test comments unless you intend to publish them. Discussion backlinks point to the production domain.

AstroPaper code is MIT licensed (see LICENSE). Legacy licensing is preserved in LICENSE-legacy; existing article content remains with its original authors.

## Fonts

MiSans is self-hosted as Unicode shards to avoid downloading full CJK fonts on English pages. Complete original character coverage is retained. See `public/fonts/misans/README.md` for optional regeneration instructions.

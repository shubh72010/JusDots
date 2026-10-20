# JusDots showcase

Astro 7 + strict TS + Tailwind v4 + Content Collections. Static export, deployed to **GitHub Pages** at `/JusDots/`.

`astro.config.mjs` owns `site` and `base` — both must match the Pages URL, because canonical links, the sitemap and `robots.txt` are generated from them.

Deployment: `.github/workflows/deploy.yml` builds and publishes `dist` on every push to `main`. The `ci` workflow only checks and builds, it does not deploy.

```sh
pnpm install
pnpm dev
pnpm check
pnpm build     # dist/
```

Add a product: drop `src/content/products/<slug>.md` with the schema in `src/content.config.ts`.

Brand assets live in `public/`: `og.png` (1200×630 social card), `apple-touch-icon.png`, `icons/`.

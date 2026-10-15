# JusDots showcase

Astro (latest) + strict TS + Tailwind v4 + Content Collections. Static export, Cloudflare Pages.

Single deployment owner: Cloudflare Pages builds from GitHub. The `ci` workflow only lints/checks/builds, it does not deploy.

```sh
pnpm install
pnpm dev
pnpm build
```

Add a product: drop `src/content/products/<slug>.md` with the schema in `src/content.config.ts`.

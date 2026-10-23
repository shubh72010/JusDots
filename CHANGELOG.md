# Changelog — JusDots showcase

## 0.2.0 — per-project changelogs from GitHub (2026-10-23)

- New `/products/<slug>/changelog/` page per product: release notes fetched from the GitHub Releases API at build time, markdown rendered with `marked`, linked from the product page and the index changelog
- Download pill opens the release APK directly (`releases/download/<tag>/app-release.apk` — same URL as GitHub's own button, so download counts still increment); shows the newest release tag, preferencing `app-release.apk`, then arm64
- Version tiles and the changelog index row both link to the per-project changelog page
- Fetch is cached per repo per build and fails soft — a rate limit or outage renders a link to the repo's releases, never a broken build
- `GITHUB_TOKEN` passed to both workflows; `deploy.yml` gains a nightly cron so releases appear without a push

## 0.1.0 — full remake (2026-10-15)

Rebuilt from scratch. Old single-file site retired.

- Stack: Astro 7, strict TypeScript, Tailwind v4, Content Collections, zero client JS
- Design: paper `#F5F4F2` + ink `#141414` + coral `#F96749` (sampled from pinned UI board), Geist Black 900 display type, serif-italic accents
- Products from pinned repos with real versions, copy, and artwork: JusPlayer v15.0.0, JusBrowse v0.0.3A-3, JusNotes v0.3.7, JusCalc v1.0.1
- Real assets: 6 JusPlayer screens, 4 JusNotes screens, Mulberry banner, per-app launcher icons, JusDots dot-sphere logo
- Pages: index (stats + release-activity strip + phone lineup), product index, per-product split pages with spec tiles, changelog, about, 404
- One coral Download pill per product, wired to GitHub Releases
- CI: check + build on PRs; Pages deploy on main

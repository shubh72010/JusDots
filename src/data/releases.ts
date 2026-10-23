import { marked } from 'marked';

export interface Release {
  tag: string;
  name: string;
  date: Date;
  url: string;
  prerelease: boolean;
  /** direct download of the primary release APK, when this release ships one */
  apkUrl?: string;
  html: string;
}

// one fetch per repo per build, shared by every page that asks
const cache = new Map<string, Promise<Release[]>>();

export function getReleases(repoUrl: string | undefined): Promise<Release[]> {
  const repo = repoUrl
    ?.match(/github\.com\/([^/]+)\/([^/]+)/)
    ?.slice(1, 3)
    .join('/');
  if (!repo) return Promise.resolve([]);
  if (!cache.has(repo)) cache.set(repo, fetchReleases(repo));
  return cache.get(repo)!;
}

async function fetchReleases(repo: string): Promise<Release[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'user-agent': 'jusdots-showcase',
  };
  if (token) headers.authorization = `Bearer ${token}`;

  let releases: any[];
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=15`, {
      headers,
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    releases = (await res.json()) as any[];
  } catch (error) {
    // no release data must never fail the build — the page falls back to a GitHub link
    console.warn(`[releases] ${repo}: ${error}`);
    return [];
  }

  return releases
    .filter((r) => !r.draft)
    .map((r) => ({
      tag: r.tag_name as string,
      name: (r.name as string) || (r.tag_name as string),
      date: new Date(r.published_at ?? r.created_at),
      url: r.html_url as string,
      apkUrl: pickApk(r.assets ?? []),
      prerelease: Boolean(r.prerelease),
      // release notes are authored by us, on our own repos
      html: renderBody(r.body as string),
    }));
}

// the plain releases/download/ URL — the same one GitHub's release page uses, so it counts downloads
function pickApk(assets: any[]): string | undefined {
  const apks = assets.filter((a) => a.name.toLowerCase().endsWith('.apk'));
  const score = (n: string) => {
    const s = n.toLowerCase();
    return s === 'app-release.apk' ? 0 : /arm64/.test(s) ? 1 : /debug/.test(s) ? 3 : 2;
  };
  return apks.sort((a, b) => score(a.name) - score(b.name))[0]?.browser_download_url;
}

function renderBody(body: string): string {
  const html = marked.parse(body ?? '', { async: false, gfm: true }) as string;
  // notes open with a "# v1.2.3" heading that the row already shows — drop it, demote any other h1
  return html
    .replace(/^\s*<h1>[^]*?<\/h1>\s*/, '')
    .replace(/<h1>|<\/h1>/g, (tag) => (tag === '<h1>' ? '<h2>' : '</h2>'));
}

/**
 * Live release feed for desktop products.
 *
 * Mirrors what shell.magies.top already does: domestic visitors hit the
 * Cloudflare mirror first and fall back to GitHub, overseas visitors do the
 * reverse. Either source alone is enough to render the page, so a mirror that
 * is not populated yet just costs one failed request.
 */

export type Os = 'mac' | 'win' | 'linux' | 'android' | 'unknown'
export type Arch = 'arm64' | 'x64'

export interface ReleaseAsset {
  name: string
  url: string
  size: number
}

export interface PlatformDownload {
  os: Os
  arch: Arch
  files: ReleaseAsset[]
}

export interface LatestRelease {
  version: string
  publishedAt: string
  downloads: PlatformDownload[]
  source: 'mirror' | 'github'
}

/** Product-scoped feed endpoints used by the download center. */
export interface ProductReleaseSource {
  slug: string
  githubRepo: string
  mirror: string
  label: string
}

/**
 * Products whose install packages are read live from a release feed.
 * Magies Terminal uses the same sources as shell.magies.top.
 * Magies Office keeps the MagiesPdf binary path (repo/mirror names unchanged).
 */
export const PRODUCT_RELEASE_SOURCES: ProductReleaseSource[] = [
  {
    slug: 'magies-terminal',
    githubRepo: 'JasonZhangDad/MgTerminal-releases',
    mirror: 'https://dl.magies.top/stable',
    label: 'Magies Terminal'
  },
  {
    slug: 'magies-office',
    githubRepo: 'Zhangwei930/MagiesPdf',
    mirror: 'https://dl.magies.top/magiespdf/stable',
    label: 'Magies Office'
  }
]

const SOURCE_BY_SLUG = Object.fromEntries(
  PRODUCT_RELEASE_SOURCES.map((s) => [s.slug, s])
) as Record<string, ProductReleaseSource>

export function releaseSourceFor(slug?: string | null): ProductReleaseSource | null {
  if (!slug) return null
  return SOURCE_BY_SLUG[slug] || null
}

/** Mainland timezones — same list shell.magies.top ships. */
const CN_TIMEZONES = ['Asia/Shanghai', 'Asia/Urumqi', 'Asia/Chongqing', 'Asia/Harbin']

export function isCN(language?: string, timeZone?: string): boolean {
  if (language && /^zh-CN/i.test(language)) return true
  return !!timeZone && CN_TIMEZONES.includes(timeZone)
}

/** Read the current environment, guarding against SSR and locked-down browsers. */
export function isCNHere(): boolean {
  if (!import.meta.client) return false
  try {
    return isCN(navigator.language, Intl.DateTimeFormat().resolvedOptions().timeZone)
  } catch {
    return false
  }
}

/** User-Agent Client Hints know the real architecture; nothing else does. */
export function archFromUAData(architecture?: string): Arch | null {
  if (!architecture) return null
  return /arm/i.test(architecture) ? 'arm64' : 'x64'
}

/**
 * Fallback for browsers without Client Hints. Apple Silicon still reports
 * `MacIntel`, so core count is the usual tiebreak — it misreads an 8-core Intel
 * mac as Apple Silicon, which is why `archFromUAData` wins when it answers.
 */
export function detectPlatform(ua: string, platform: string, cores: number): { os: Os; arch: Arch } {
  const s = `${ua} ${platform}`.toLowerCase()
  const arm = /arm64|aarch64|armv8/.test(s)

  if (/android/.test(s)) return { os: 'android', arch: arm ? 'arm64' : 'x64' }
  if (/mac/.test(s)) return { os: 'mac', arch: cores >= 8 ? 'arm64' : 'x64' }
  if (/win/.test(s)) return { os: 'win', arch: arm ? 'arm64' : 'x64' }
  if (/linux|x11/.test(s)) return { os: 'linux', arch: arm ? 'arm64' : 'x64' }
  return { os: 'unknown', arch: arm ? 'arm64' : 'x64' }
}

export async function detectPlatformHere(): Promise<{ os: Os; arch: Arch }> {
  if (!import.meta.client) return { os: 'unknown', arch: 'x64' }
  const guess = detectPlatform(
    navigator.userAgent,
    navigator.platform,
    navigator.hardwareConcurrency || 0
  )
  try {
    const uaData = (navigator as any).userAgentData
    const hints = await uaData?.getHighEntropyValues(['architecture'])
    const arch = archFromUAData(hints?.architecture)
    if (arch) return { ...guess, arch }
  } catch (e) {
    console.warn('Client Hints unavailable, falling back to user-agent detection', e)
  }
  return guess
}

/** Update manifests and delta maps are machinery, not something a human downloads. */
function isInstallable(name: string): boolean {
  const n = name.toLowerCase()
  if (n.endsWith('.yml') || n.endsWith('.yaml') || n.endsWith('.blockmap')) return false
  // Match Terminal site: installer packages only (not rpm/pacman extras).
  return /\.(dmg|zip|exe|appimage|deb|apk)$/.test(n)
}

function assetOs(name: string): Os {
  const n = name.toLowerCase()
  if (n.includes('android') || n.endsWith('.apk')) return 'android'
  if (n.includes('mac') || n.endsWith('.dmg')) return 'mac'
  if (n.includes('linux') || n.endsWith('.appimage') || n.endsWith('.deb')) return 'linux'
  if (n.includes('win') || n.endsWith('.exe')) return 'win'
  return 'unknown'
}

function assetArch(name: string): Arch {
  return /arm64|aarch64/i.test(name) ? 'arm64' : 'x64'
}

/** Lower sorts first — the lead file is what the big download button uses. */
function assetRank(name: string, os: Os): number {
  const n = name.toLowerCase()
  if (os === 'mac') return n.endsWith('.dmg') ? 0 : 1
  if (os === 'linux') return n.endsWith('.appimage') ? 0 : 1
  if (os === 'win') {
    if (n.endsWith('.exe')) return n.includes('portable') ? 1 : 0
    return 2
  }
  if (os === 'android') return n.endsWith('.apk') ? 0 : 1
  return 9
}

const OS_ORDER: Os[] = ['mac', 'win', 'linux', 'android']

/** Group a release's assets into one entry per os/arch, best file first. */
export function pickDownloads(assets: ReleaseAsset[]): PlatformDownload[] {
  const groups = new Map<string, PlatformDownload>()

  for (const asset of assets) {
    if (!isInstallable(asset.name)) continue
    const os = assetOs(asset.name)
    if (os === 'unknown') continue
    const arch = assetArch(asset.name)
    const key = `${os}-${arch}`
    if (!groups.has(key)) groups.set(key, { os, arch, files: [] })
    groups.get(key)!.files.push(asset)
  }

  const out = [...groups.values()]
  for (const group of out) {
    group.files.sort((a, b) => assetRank(a.name, group.os) - assetRank(b.name, group.os))
  }
  return out.sort(
    (a, b) => OS_ORDER.indexOf(a.os) - OS_ORDER.indexOf(b.os) || archRank(a) - archRank(b)
  )
}

/** Macs are mostly Apple Silicon by now; everywhere else x64 is still the norm. */
function archRank(download: PlatformDownload): number {
  const lead: Arch = download.os === 'mac' ? 'arm64' : 'x64'
  return download.arch === lead ? 0 : 1
}

/** One column per OS, its architectures nested inside. */
export function groupByOs(downloads: PlatformDownload[]): { os: Os; variants: PlatformDownload[] }[] {
  const columns: { os: Os; variants: PlatformDownload[] }[] = []
  for (const download of downloads) {
    let column = columns.find((c) => c.os === download.os)
    if (!column) {
      column = { os: download.os, variants: [] }
      columns.push(column)
    }
    column.variants.push(download)
  }
  return columns
}

async function getJson(url: string): Promise<any> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} responded ${res.status}`)
  return res.json()
}

async function fromGithub(repo: string): Promise<LatestRelease> {
  const data = await getJson(`https://api.github.com/repos/${repo}/releases/latest`)
  const assets: ReleaseAsset[] = (data.assets || [])
    .filter((a: any) => a?.name && a?.browser_download_url)
    .map((a: any) => ({ name: a.name, url: a.browser_download_url, size: a.size || 0 }))
  return {
    version: String(data.tag_name || '').replace(/^v/i, ''),
    publishedAt: data.published_at || '',
    downloads: pickDownloads(assets),
    source: 'github'
  }
}

async function fromMirror(base: string): Promise<LatestRelease> {
  const data = await getJson(`${base}/release.json`)
  const assets: ReleaseAsset[] = (data.files || [])
    .filter((f: any) => f?.name && f?.url)
    .map((f: any) => ({ name: f.name, url: f.url, size: f.size || 0 }))
  return {
    version: String(data.version || data.tag || '').replace(/^v/i, ''),
    publishedAt: data.publishedAt || '',
    downloads: pickDownloads(assets),
    source: 'mirror'
  }
}

/** Closest source first; the other one stays as the fallback. */
export function sourceOrder(cn: boolean): ('mirror' | 'github')[] {
  return cn ? ['mirror', 'github'] : ['github', 'mirror']
}

/**
 * Fetch the latest release for a product feed, preferring whichever source is
 * closer to the visitor. Throws only when both sources fail.
 */
export async function fetchLatestRelease(source: ProductReleaseSource): Promise<LatestRelease> {
  const sources = sourceOrder(isCNHere()).map((name) =>
    name === 'mirror' ? () => fromMirror(source.mirror) : () => fromGithub(source.githubRepo)
  )

  let lastError: unknown
  for (const load of sources) {
    try {
      const release = await load()
      if (release.downloads.length) return release
      lastError = new Error('release carried no installable assets')
    } catch (e) {
      lastError = e
      console.warn(`Failed to fetch the latest ${source.label} release from a source`, e)
    }
  }
  throw lastError instanceof Error ? lastError : new Error('No release source responded')
}


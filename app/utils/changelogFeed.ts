/**
 * Version changelogs for Magies Terminal and Magies Office.
 * Terminal: shell.magies.top/changelog(.en).md
 * Office: GitHub Zhangwei930/MagiesPdf releases
 */

export interface ChangelogSection {
  title: string
  items: string[]
}

export interface ChangelogRelease {
  version: string
  date: string
  sections: ChangelogSection[]
  /** Unstructured notes when section parsing finds nothing useful. */
  notes: string
  url: string
}

export interface ProductChangelog {
  key: 'terminal' | 'office'
  slug: string
  label: string
  homepage: string
  releases: ChangelogRelease[]
  source: 'markdown' | 'github'
  error?: string
}

const TERMINAL_MD = {
  zh: 'https://shell.magies.top/changelog.md',
  en: 'https://shell.magies.top/changelog.en.md'
} as const

const OFFICE_GITHUB = 'Zhangwei930/MagiesPdf'
const OFFICE_RELEASES_PAGE = 'https://github.com/Zhangwei930/MagiesPdf/releases'
const TERMINAL_SITE = 'https://shell.magies.top'

async function getText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} responded ${res.status}`)
  return res.text()
}

async function getJson(url: string): Promise<any> {
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' }
  })
  if (!res.ok) throw new Error(`${url} responded ${res.status}`)
  return res.json()
}

/** Strip markdown emphasis / links for clean list display. */
export function cleanMdInline(text: string): string {
  return text
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Parse a Keep-a-Changelog style markdown file used by Magies Terminal.
 * Blocks look like: ## [0.6.2] - 2026-08-01
 */
export function parseMarkdownChangelog(md: string, baseUrl = TERMINAL_SITE): ChangelogRelease[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const releases: ChangelogRelease[] = []
  let current: ChangelogRelease | null = null
  let section: ChangelogSection | null = null

  const flushSection = () => {
    if (current && section && section.items.length) {
      current.sections.push(section)
    }
    section = null
  }

  const flushRelease = () => {
    flushSection()
    if (current) releases.push(current)
    current = null
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const heading = line.match(/^##\s+\[?v?([\d.]+)\]?\s*(?:[-–—]\s*(\d{4}-\d{2}-\d{2}))?/)
    if (heading) {
      flushRelease()
      current = {
        version: heading[1]!,
        date: heading[2] || '',
        sections: [],
        notes: '',
        url: `${baseUrl}/#download`
      }
      continue
    }

    if (!current) continue

    const sub = line.match(/^###\s+(.+)/)
    if (sub) {
      flushSection()
      section = { title: cleanMdInline(sub[1]!), items: [] }
      continue
    }

    const bullet = line.match(/^[-*+]\s+(.+)/)
    if (bullet) {
      const item = cleanMdInline(bullet[1]!)
      if (!item) continue
      if (!section) section = { title: '', items: [] }
      section.items.push(item)
      continue
    }
  }
  flushRelease()
  return releases
}

/** Parse a GitHub release body into sections / bullets when possible. */
export function parseGithubBody(body: string): { sections: ChangelogSection[]; notes: string } {
  if (!body?.trim()) return { sections: [], notes: '' }

  // Drop pure download tables / badge rows — not useful as a changelog.
  const cleaned = body
    .replace(/\r\n/g, '\n')
    .replace(/\|[^|\n]+\|[^|\n]*\|[\s\S]*?(?=\n\n|\n##|$)/g, '')
    .replace(/!\[.*?]\(https?:\/\/img\.shields\.io[^)]*\)/g, '')

  const lines = cleaned.split('\n')
  const sections: ChangelogSection[] = []
  let section: ChangelogSection | null = null
  const loose: string[] = []

  const flush = () => {
    if (section && section.items.length) sections.push(section)
    section = null
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    const sub = line.match(/^#{1,3}\s+(.+)/)
    if (sub) {
      flush()
      section = { title: cleanMdInline(sub[1]!), items: [] }
      continue
    }

    const bullet = line.match(/^[-*+]\s+(.+)/)
    if (bullet) {
      const item = cleanMdInline(bullet[1]!)
      if (!item) continue
      if (!section) section = { title: '', items: [] }
      section.items.push(item)
      continue
    }

    // Skip table residue
    if (line.startsWith('|') || /^:?-+:?$/.test(line.replace(/\|/g, ''))) continue

    if (section && section.items.length === 0 && !section.title) {
      // accumulate as notes under empty section later
    }
    if (!section) {
      const t = cleanMdInline(line)
      if (t) loose.push(t)
    }
  }
  flush()

  if (!sections.length && loose.length) {
    return { sections: [], notes: loose.join('\n') }
  }
  return { sections, notes: loose.join('\n') }
}

export async function fetchTerminalChangelog(locale: 'zh' | 'en'): Promise<ChangelogRelease[]> {
  const url = locale === 'en' ? TERMINAL_MD.en : TERMINAL_MD.zh
  try {
    const md = await getText(url)
    const list = parseMarkdownChangelog(md)
    if (list.length) return list
  } catch {
    // fall through to alternate locale
  }
  if (locale === 'en') {
    const md = await getText(TERMINAL_MD.zh)
    return parseMarkdownChangelog(md)
  }
  const md = await getText(TERMINAL_MD.en)
  return parseMarkdownChangelog(md)
}

export async function fetchOfficeChangelog(): Promise<ChangelogRelease[]> {
  const data = await getJson(
    `https://api.github.com/repos/${OFFICE_GITHUB}/releases?per_page=12`
  )
  if (!Array.isArray(data)) return []

  return data
    .filter((r: any) => r && !r.draft)
    .map((r: any) => {
      const version = String(r.tag_name || r.name || '').replace(/^v/i, '')
      const { sections, notes } = parseGithubBody(String(r.body || ''))
      return {
        version,
        date: String(r.published_at || '').slice(0, 10),
        sections,
        notes,
        url: r.html_url || OFFICE_RELEASES_PAGE
      } satisfies ChangelogRelease
    })
    .filter((r: ChangelogRelease) => r.version)
}

export async function fetchProductChangelogs(locale: 'zh' | 'en'): Promise<ProductChangelog[]> {
  const [terminal, office] = await Promise.allSettled([
    fetchTerminalChangelog(locale),
    fetchOfficeChangelog()
  ])

  return [
    {
      key: 'terminal',
      slug: 'magies-terminal',
      label: 'Magies Terminal',
      homepage: TERMINAL_SITE,
      releases: terminal.status === 'fulfilled' ? terminal.value : [],
      source: 'markdown',
      error: terminal.status === 'rejected' ? String(terminal.reason?.message || terminal.reason) : undefined
    },
    {
      key: 'office',
      slug: 'magies-office',
      label: 'Magies Office',
      homepage: OFFICE_RELEASES_PAGE,
      releases: office.status === 'fulfilled' ? office.value : [],
      source: 'github',
      error: office.status === 'rejected' ? String(office.reason?.message || office.reason) : undefined
    }
  ]
}

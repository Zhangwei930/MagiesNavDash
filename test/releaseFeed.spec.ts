import { describe, expect, it } from 'vitest'
import {
  archFromUAData,
  detectPlatform,
  groupByOs,
  isCN,
  pickDownloads
} from '../app/utils/releaseFeed'

describe('isCN', () => {
  it('treats a zh-CN browser as domestic regardless of timezone', () => {
    expect(isCN('zh-CN', 'America/Los_Angeles')).toBe(true)
    expect(isCN('zh-cn', 'UTC')).toBe(true)
  })

  it('treats a mainland timezone as domestic regardless of language', () => {
    expect(isCN('en-US', 'Asia/Shanghai')).toBe(true)
    expect(isCN('en-US', 'Asia/Urumqi')).toBe(true)
    expect(isCN('en-US', 'Asia/Chongqing')).toBe(true)
    expect(isCN('en-US', 'Asia/Harbin')).toBe(true)
  })

  it('does not treat other Chinese locales or nearby timezones as domestic', () => {
    expect(isCN('zh-TW', 'Asia/Taipei')).toBe(false)
    expect(isCN('zh-HK', 'Asia/Hong_Kong')).toBe(false)
    expect(isCN('en-US', 'Europe/London')).toBe(false)
  })

  it('falls back to overseas when the environment reports nothing', () => {
    expect(isCN(undefined, undefined)).toBe(false)
  })
})

describe('detectPlatform', () => {
  it('is only a fallback: an 8-core Intel mac is indistinguishable by core count', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    expect(detectPlatform(ua, 'MacIntel', 8).arch).toBe('arm64')
    expect(archFromUAData('x86')).toBe('x64')
  })

  it('reads Apple Silicon from a mac user agent', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    expect(detectPlatform(ua, 'MacIntel', 8)).toEqual({ os: 'mac', arch: 'arm64' })
  })

  it('reads Intel macs from the same user agent when there are few cores', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    expect(detectPlatform(ua, 'MacIntel', 4)).toEqual({ os: 'mac', arch: 'x64' })
  })

  it('reads windows on both architectures', () => {
    expect(detectPlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Win32', 8)).toEqual({
      os: 'win',
      arch: 'x64'
    })
    expect(detectPlatform('Mozilla/5.0 (Windows NT 10.0; ARM64)', 'Win32', 8)).toEqual({
      os: 'win',
      arch: 'arm64'
    })
  })

  it('reads linux and keeps android out of it', () => {
    expect(detectPlatform('Mozilla/5.0 (X11; Linux x86_64)', 'Linux x86_64', 8)).toEqual({
      os: 'linux',
      arch: 'x64'
    })
    expect(detectPlatform('Mozilla/5.0 (X11; Linux aarch64)', 'Linux aarch64', 8)).toEqual({
      os: 'linux',
      arch: 'arm64'
    })
    expect(detectPlatform('Mozilla/5.0 (Linux; Android 14; Pixel 8)', 'Linux armv8l', 8).os).toBe(
      'unknown'
    )
  })

  it('gives up rather than guessing on an unrecognised agent', () => {
    expect(detectPlatform('curl/8.4.0', '', 1)).toEqual({ os: 'unknown', arch: 'x64' })
  })
})

const ASSETS = [
  'MagiesPdf-1.0.1-mac-arm64.dmg',
  'MagiesPdf-1.0.1-mac-arm64.zip',
  'MagiesPdf-1.0.1-mac-x64.dmg',
  'MagiesPdf-1.0.1-mac-x64.zip',
  'MagiesPdf-1.0.1-win-x64.exe',
  'MagiesPdf-1.0.1-win-arm64.exe',
  'MagiesPdf-1.0.1-portable-win-x64.exe',
  'MagiesPdf-1.0.1-portable-win-arm64.exe',
  'MagiesPdf-1.0.1-win-x64.zip',
  'MagiesPdf-1.0.1-win-arm64.zip',
  'MagiesPdf-1.0.1-linux-x86_64.AppImage',
  'MagiesPdf-1.0.1-linux-arm64.AppImage',
  'MagiesPdf-1.0.1-linux-amd64.deb',
  'MagiesPdf-1.0.1-linux-arm64.deb',
  'MagiesPdf-1.0.1-mac-arm64.dmg.blockmap',
  'MagiesPdf-1.0.1-win-x64.exe.blockmap',
  'latest.yml',
  'latest-mac.yml',
  'builder-debug.yml'
].map((name) => ({ name, url: `https://example.test/${name}`, size: 1024 }))

function find(os: string, arch: string, downloads: ReturnType<typeof pickDownloads>) {
  return downloads.find((d) => d.os === os && d.arch === arch)
}

describe('pickDownloads', () => {
  const downloads = pickDownloads(ASSETS)

  it('drops update manifests, blockmaps and debug output', () => {
    const names = downloads.flatMap((d) => d.files.map((f) => f.name))
    expect(names.some((n) => n.endsWith('.yml'))).toBe(false)
    expect(names.some((n) => n.endsWith('.blockmap'))).toBe(false)
  })

  it('covers every os/arch combination the release ships', () => {
    expect(downloads.map((d) => `${d.os}-${d.arch}`).sort()).toEqual([
      'linux-arm64',
      'linux-x64',
      'mac-arm64',
      'mac-x64',
      'win-arm64',
      'win-x64'
    ])
  })

  it('leads each mac build with the dmg', () => {
    expect(find('mac', 'arm64', downloads)!.files[0]!.name).toBe('MagiesPdf-1.0.1-mac-arm64.dmg')
    expect(find('mac', 'x64', downloads)!.files[0]!.name).toBe('MagiesPdf-1.0.1-mac-x64.dmg')
  })

  it('leads each windows build with the installer, not the portable build', () => {
    expect(find('win', 'x64', downloads)!.files[0]!.name).toBe('MagiesPdf-1.0.1-win-x64.exe')
    expect(find('win', 'arm64', downloads)!.files[0]!.name).toBe('MagiesPdf-1.0.1-win-arm64.exe')
  })

  it('leads each linux build with the AppImage and keeps the deb as an alternate', () => {
    const linux = find('linux', 'x64', downloads)!
    expect(linux.files[0]!.name).toBe('MagiesPdf-1.0.1-linux-x86_64.AppImage')
    expect(linux.files.map((f) => f.name)).toContain('MagiesPdf-1.0.1-linux-amd64.deb')
  })

  it('maps the linux amd64 deb onto x64, not its own architecture', () => {
    expect(find('linux', 'arm64', downloads)!.files.map((f) => f.name)).not.toContain(
      'MagiesPdf-1.0.1-linux-amd64.deb'
    )
  })

  it('returns nothing for a release with no installable assets', () => {
    expect(pickDownloads([{ name: 'latest.yml', url: 'u', size: 1 }])).toEqual([])
  })
})

describe('archFromUAData', () => {
  it('trusts Client Hints over any user-agent guessing', () => {
    expect(archFromUAData('arm')).toBe('arm64')
    expect(archFromUAData('x86')).toBe('x64')
  })

  it('reports nothing when the browser does not expose the hint', () => {
    expect(archFromUAData(undefined)).toBeNull()
    expect(archFromUAData('')).toBeNull()
  })
})

describe('groupByOs', () => {
  it('collapses the arch variants into one column per os, in release order', () => {
    const grouped = groupByOs(pickDownloads(ASSETS))
    expect(grouped.map((g) => g.os)).toEqual(['mac', 'win', 'linux'])
    expect(grouped.map((g) => g.variants.length)).toEqual([2, 2, 2])
  })

  it('leads with the architecture most people on that os are running', () => {
    const grouped = groupByOs(pickDownloads(ASSETS))
    const archOrder = Object.fromEntries(
      grouped.map((g) => [g.os, g.variants.map((v) => v.arch)])
    )
    expect(archOrder.mac).toEqual(['arm64', 'x64'])
    expect(archOrder.win).toEqual(['x64', 'arm64'])
    expect(archOrder.linux).toEqual(['x64', 'arm64'])
  })

  it('keeps an os that only ships one architecture', () => {
    const grouped = groupByOs([
      { os: 'win', arch: 'x64', files: [{ name: 'a.exe', url: 'u', size: 1 }] }
    ])
    expect(grouped).toHaveLength(1)
    expect(grouped[0]!.variants).toHaveLength(1)
  })
})

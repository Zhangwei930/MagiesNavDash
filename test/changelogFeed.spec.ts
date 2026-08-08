import { describe, expect, it } from 'vitest'
import {
  cleanMdInline,
  parseGithubBody,
  parseMarkdownChangelog
} from '../app/utils/changelogFeed'

describe('cleanMdInline', () => {
  it('strips emphasis links and code ticks', () => {
    expect(cleanMdInline('**Bold** and [link](https://x.test) `code`')).toBe('Bold and link code')
  })
})

describe('parseMarkdownChangelog', () => {
  const md = `# Changelog

## [0.6.2] - 2026-08-01

### 新增
- **数据库结构树**：左侧列出表
- SQL 补全

### 修复
- 直连数据库终于能连上

## [0.6.1] - 2026-08-01

### 修复
- 保存数据库连接不再覆盖
`

  it('splits releases by version heading', () => {
    const releases = parseMarkdownChangelog(md)
    expect(releases.map((r) => r.version)).toEqual(['0.6.2', '0.6.1'])
    expect(releases[0]!.date).toBe('2026-08-01')
  })

  it('groups bullets under section titles', () => {
    const [latest] = parseMarkdownChangelog(md)
    expect(latest!.sections.map((s) => s.title)).toEqual(['新增', '修复'])
    expect(latest!.sections[0]!.items[0]).toContain('数据库结构树')
    expect(latest!.sections[1]!.items).toHaveLength(1)
  })
})

describe('parseGithubBody', () => {
  it('reads markdown headings and bullets from a release body', () => {
    const body = `### Office documents open in this window

- **Word opens as tabs** inside the app
- Create and Save As from the file menu

### PDF tools

- Tools open as a right-hand pane
`
    const { sections } = parseGithubBody(body)
    expect(sections).toHaveLength(2)
    expect(sections[0]!.title).toContain('Office documents')
    expect(sections[0]!.items[0]).toContain('Word opens as tabs')
  })

  it('drops shield badge download tables', () => {
    const body = `## Download based on your OS:

| OS | Download |
| :--- | :--- |
| Windows | [![Setup](https://img.shields.io/badge/x-1)](https://x) |

### Features
- Real note here
`
    const { sections } = parseGithubBody(body)
    expect(sections.some((s) => s.items.some((i) => i.includes('Real note')))).toBe(true)
    expect(sections.flatMap((s) => s.items).join(' ')).not.toContain('img.shields.io')
  })
})

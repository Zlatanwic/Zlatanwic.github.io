type SlideFrontmatter = {
  title?: string
  subtitle?: string
  kicker?: string
  date?: string
  deploy?: boolean
}

export type InlineKind = 'text' | 'strong' | 'code'

export interface InlineToken {
  kind: InlineKind
  text: string
}

export interface ListItem {
  level: number
  tokens: InlineToken[]
}

export interface TableBlock {
  type: 'table'
  headers: InlineToken[][]
  rows: InlineToken[][][]
}

export interface ListBlock {
  type: 'list'
  ordered: boolean
  items: ListItem[]
}

export interface ParagraphBlock {
  type: 'paragraph'
  tokens: InlineToken[]
}

export interface CodeBlock {
  type: 'code'
  language: string
  code: string
}

export interface QuoteBlock {
  type: 'quote'
  tokens: InlineToken[]
}

export interface ImageBlock {
  type: 'image'
  src: string
  alt: string
}

export type SlideBlock =
  | TableBlock
  | ListBlock
  | ParagraphBlock
  | CodeBlock
  | QuoteBlock
  | ImageBlock

export interface Slide {
  index: number
  number: string
  title: string
  displayTitle: string
  time: string
  section: 'main' | 'backup'
  blocks: SlideBlock[]
  notes: SlideBlock[]
}

export interface SlideDeck {
  slug: string
  sourcePath: string
  title: string
  subtitle: string
  kicker: string
  date: string
  overview: SlideBlock[]
  slides: Slide[]
}

const contentAssets = import.meta.glob<string>(
  '../content/slides/**/*.{avif,gif,jpeg,jpg,png,svg,webp}',
  {
    query: '?url',
    import: 'default',
    eager: true
  }
)

const modules = import.meta.glob<string>('../content/slides/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

function parseFrontmatter(raw: string): { data: SlideFrontmatter; content: string } {
  if (!raw.startsWith('---')) return { data: {}, content: raw }

  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { data: {}, content: raw }

  const block = raw.slice(3, end).trim()
  const content = raw.slice(end + 4).trimStart()
  const data: SlideFrontmatter = {}

  for (const line of block.split('\n')) {
    const index = line.indexOf(':')
    if (index === -1) continue

    const key = line.slice(0, index).trim() as keyof SlideFrontmatter
    const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, '')

    if (key === 'deploy') {
      data.deploy = value.toLowerCase() !== 'false'
      continue
    }

    if (key === 'title' || key === 'subtitle' || key === 'kicker' || key === 'date') {
      data[key] = value
    }
  }

  return { data, content }
}

function slugFromPath(path: string) {
  return path.split('/').pop()?.replace(/\.md$/, '') ?? path
}

function shouldIncludeDeck(data: SlideFrontmatter) {
  return !import.meta.env.PROD || data.deploy !== false
}

function splitSlideChunks(content: string) {
  return content
    .split(/^---\s*$/m)
    .map(chunk => chunk.trim())
    .filter(Boolean)
}

function firstMarkdownHeading(content: string) {
  const match = content.match(/^#{1,3}\s+(.+)$/m)
  return match?.[1].replace(/\s+#*$/, '').trim()
}

function isExternalOrRootPath(src: string) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/|\/|#)/i.test(src)
}

function normalizeRelativePath(path: string) {
  const parts: string[] = []

  for (const part of path.replace(/\\/g, '/').split('/')) {
    if (!part || part === '.') continue
    if (part === '..' && parts.length && parts[parts.length - 1] !== '..') {
      parts.pop()
      continue
    }
    parts.push(part)
  }

  return parts.join('/')
}

function resolveContentAsset(src: string, sourcePath: string) {
  if (!sourcePath || isExternalOrRootPath(src)) return src

  const sourceDir = sourcePath.slice(0, sourcePath.lastIndexOf('/'))
  const assetPath = normalizeRelativePath(`${sourceDir}/${src}`)
  return contentAssets[assetPath] ?? src
}

function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = []
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      tokens.push({ kind: 'text', text: text.slice(lastIndex, match.index) })
    }

    const value = match[0]
    if (value.startsWith('`')) {
      tokens.push({ kind: 'code', text: value.slice(1, -1) })
    } else {
      tokens.push({ kind: 'strong', text: value.slice(2, -2) })
    }
    lastIndex = match.index + value.length
  }

  if (lastIndex < text.length) {
    tokens.push({ kind: 'text', text: text.slice(lastIndex) })
  }

  return tokens.filter(token => token.text.length)
}

function stripHeadingPrefix(line: string) {
  return line.replace(/^#{1,6}\s+/, '').replace(/\s+#*$/, '').trim()
}

function cleanSlideTitle(rawTitle: string) {
  const timeMatch = rawTitle.match(/(?:（|\()([^()（）]*\d+:\d+[^()（）]*)(?:）|\))\s*$/)
  const time = timeMatch?.[1]?.trim() ?? ''
  const withoutTime = timeMatch ? rawTitle.slice(0, timeMatch.index).trim() : rawTitle.trim()
  const numberMatch = withoutTime.match(/^(?:Slide\s*)?([A-Z]|\d+|Backup\s*\d+)\s*(?:[-:：]\s*)?(.*)$/i)
  const number = numberMatch?.[1]?.trim() ?? ''
  const displayTitle = (numberMatch?.[2] || withoutTime).trim()

  return {
    number,
    displayTitle: displayTitle || withoutTime,
    title: withoutTime,
    time
  }
}

function isHeading(line: string) {
  return /^#{1,6}\s+/.test(line)
}

function isSectionHeading(line: string) {
  return /^###\s+/.test(line)
}

function isBodySection(line: string) {
  return /^###\s+/.test(line) && /PPT|内容|鍐呭/.test(line)
}

function isSpeakerSection(line: string) {
  return /^###\s+/.test(line) && !isBodySection(line)
}

function isListLine(line: string) {
  return /^(\s*)([-*+]\s+|\d+[.)]\s+)/.test(line)
}

function isTableStart(lines: string[], index: number) {
  return Boolean(
    lines[index]?.includes('|') &&
    lines[index + 1]?.includes('|') &&
    /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1])
  )
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(cell => cell.trim())
}

function parseBlocks(markdown: string, sourcePath: string): SlideBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: SlideBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed || isHeading(trimmed)) {
      i += 1
      continue
    }

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imageMatch) {
      blocks.push({
        type: 'image',
        alt: imageMatch[1],
        src: resolveContentAsset(imageMatch[2], sourcePath)
      })
      i += 1
      continue
    }

    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim()
      const codeLines: string[] = []
      i += 1
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i += 1
      }
      blocks.push({ type: 'code', language, code: codeLines.join('\n') })
      i += 1
      continue
    }

    if (isTableStart(lines, i)) {
      const tableLines: string[] = [lines[i]]
      i += 2
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        tableLines.push(lines[i])
        i += 1
      }
      blocks.push({
        type: 'table',
        headers: splitTableRow(tableLines[0]).map(parseInline),
        rows: tableLines.slice(1).map(row => splitTableRow(row).map(parseInline))
      })
      continue
    }

    if (isListLine(line)) {
      const items: ListItem[] = []
      const ordered = /^\s*\d+[.)]\s+/.test(line)

      while (i < lines.length && isListLine(lines[i])) {
        const itemMatch = lines[i].match(/^(\s*)(?:[-*+]\s+|\d+[.)]\s+)(.*)$/)
        if (itemMatch) {
          items.push({
            level: Math.floor(itemMatch[1].length / 2),
            tokens: parseInline(itemMatch[2].trim())
          })
        }
        i += 1
      }

      blocks.push({ type: 'list', ordered, items })
      continue
    }

    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''))
        i += 1
      }
      blocks.push({ type: 'quote', tokens: parseInline(quoteLines.join(' ')) })
      continue
    }

    const paragraphLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !isHeading(lines[i].trim()) &&
      !lines[i].trim().startsWith('```') &&
      !isListLine(lines[i]) &&
      !isTableStart(lines, i)
    ) {
      paragraphLines.push(lines[i].trim())
      i += 1
    }

    if (paragraphLines.length) {
      blocks.push({ type: 'paragraph', tokens: parseInline(paragraphLines.join(' ')) })
    }
  }

  return blocks
}

function splitSlideSections(chunk: string) {
  const lines = chunk.replace(/\r\n/g, '\n').split('\n')
  const bodyLines: string[] = []
  const noteLines: string[] = []
  let mode: 'body' | 'notes' | 'skip' = 'skip'

  for (const line of lines) {
    if (isBodySection(line.trim())) {
      mode = 'body'
      continue
    }
    if (isSpeakerSection(line.trim())) {
      mode = 'notes'
      continue
    }

    if (mode === 'body') bodyLines.push(line)
    if (mode === 'notes') noteLines.push(line)
  }

  if (!bodyLines.length && !noteLines.length) {
    return { body: chunk, notes: '' }
  }

  return {
    body: bodyLines.join('\n').trim(),
    notes: noteLines.join('\n').trim()
  }
}

function parseSlide(chunk: string, index: number, sourcePath: string, backupMode: boolean): Slide | null {
  const lines = chunk.replace(/\r\n/g, '\n').split('\n')
  const titleLine = lines.find(line => /^##\s+/.test(line)) ?? lines.find(line => /^#\s+/.test(line))
  if (!titleLine) return null

  const rawTitle = stripHeadingPrefix(titleLine)
  if (/^backup slides$/i.test(rawTitle)) return null

  const title = cleanSlideTitle(rawTitle)
  const sections = splitSlideSections(chunk)
  const section = backupMode || /^backup\b/i.test(rawTitle) ? 'backup' : 'main'

  return {
    index,
    number: title.number || String(index + 1),
    title: title.title,
    displayTitle: title.displayTitle,
    time: title.time,
    section,
    blocks: parseBlocks(sections.body, sourcePath),
    notes: parseBlocks(sections.notes, sourcePath)
  }
}

function parseDeck(path: string, raw: string): SlideDeck | null {
  const parsed = parseFrontmatter(raw)
  if (!shouldIncludeDeck(parsed.data)) return null

  const chunks = splitSlideChunks(parsed.content)
  const firstChunk = chunks[0] ?? ''
  const hasPreface = !/^##\s+/m.test(firstChunk)
  const preface = hasPreface ? firstChunk : ''
  const slideChunks = hasPreface ? chunks.slice(1) : chunks
  let backupMode = false

  const slides = slideChunks.flatMap((chunk, sourceIndex) => {
    if (/^#\s+Backup Slides\s*$/im.test(chunk)) backupMode = true
    const slide = parseSlide(chunk, sourceIndex, path, backupMode)
    return slide ? [slide] : []
  })

  return {
    slug: slugFromPath(path),
    sourcePath: path,
    title: parsed.data.title ?? firstMarkdownHeading(preface || parsed.content) ?? slugFromPath(path),
    subtitle: parsed.data.subtitle ?? '',
    kicker: parsed.data.kicker ?? 'PUBLICATION DECK',
    date: parsed.data.date ?? '',
    overview: parseBlocks(preface, path),
    slides: slides.map((slide, index) => ({ ...slide, index }))
  }
}

export const slideDecks: SlideDeck[] = Object.entries(modules)
  .flatMap(([path, raw]) => {
    const deck = parseDeck(path, raw)
    return deck ? [deck] : []
  })
  .sort((a, b) => a.title.localeCompare(b.title))

export function findSlideDeck(slug: string) {
  return slideDecks.find(deck => deck.slug === slug)
}

import MarkdownIt from 'markdown-it'
import katex from 'katex'

type KatexOptions = { throwOnError?: boolean; errorColor?: string }

function katexPlugin(md: MarkdownIt, opts: KatexOptions = {}) {
  const renderMath = (src: string, displayMode: boolean) => {
    try {
      return katex.renderToString(src, {
        throwOnError: opts.throwOnError ?? false,
        errorColor: opts.errorColor ?? '#ff4eb2',
        displayMode,
        output: 'html'
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return `<span class="katex-error" title="${md.utils.escapeHtml(message)}">${md.utils.escapeHtml(src)}</span>`
    }
  }

  md.inline.ruler.after('escape', 'math_inline', (state, silent) => {
    if (state.src[state.pos] !== '$') return false
    const start = state.pos + 1
    if (state.src[start] === '$') return false
    const end = state.src.indexOf('$', start)
    if (end === -1) return false
    const content = state.src.slice(start, end)
    if (!content.trim()) return false
    if (/^\s|\s$/.test(content)) return false
    if (!silent) {
      const token = state.push('math_inline', 'math', 0)
      token.markup = '$'
      token.content = content
    }
    state.pos = end + 1
    return true
  })

  md.block.ruler.after('blockquote', 'math_block', (state, startLine, endLine, silent) => {
    const startPos = state.bMarks[startLine] + state.tShift[startLine]
    const maxPos = state.eMarks[startLine]
    if (startPos + 2 > maxPos) return false
    if (state.src.slice(startPos, startPos + 2) !== '$$') return false

    let nextLine = startLine
    let lastLine: string | null = null
    let found = false
    let firstLine = state.src.slice(startPos + 2, maxPos)
    if (firstLine.trim().endsWith('$$')) {
      firstLine = firstLine.trim().slice(0, -2)
      found = true
    }

    while (!found) {
      nextLine += 1
      if (nextLine >= endLine) break
      const begin = state.bMarks[nextLine] + state.tShift[nextLine]
      const end = state.eMarks[nextLine]
      const line = state.src.slice(begin, end)
      if (line.trim().endsWith('$$')) {
        lastLine = line.trim().slice(0, -2)
        found = true
        break
      }
    }

    if (!found) return false
    if (silent) return true

    const middle = nextLine > startLine
      ? state.src.slice(state.bMarks[startLine + 1], state.bMarks[nextLine])
      : ''
    const content = [firstLine, middle, lastLine].filter(s => s !== null && s !== '').join('\n').trim()

    const token = state.push('math_block', 'math', 0)
    token.block = true
    token.content = content
    token.markup = '$$'
    token.map = [startLine, nextLine + 1]
    state.line = nextLine + 1
    return true
  }, { alt: [] })

  md.renderer.rules.math_inline = (tokens, idx) => renderMath(tokens[idx].content, false)
  md.renderer.rules.math_block = (tokens, idx) => `<div class="math-block">${renderMath(tokens[idx].content, true)}</div>`
}

export type PostStatus = 'draft' | 'planned' | 'published'
export type PostFill = 'dark' | 'mint' | 'uv' | 'yellow'

export interface PostTocItem {
  id: string
  level: 2 | 3
  title: string
}

export const postCollectionLabels: Record<string, string> = {
  'paper-notes': 'PAPER NOTES',
  tech: 'TECH',
  misc: 'MISC'
}

export const postCollectionDecks: Record<string, string> = {
  'paper-notes': 'reading notes',
  tech: 'technical blogs',
  misc: 'logs & essays'
}

export interface Post {
  slug: string
  collection: string
  title: string
  date: string
  time: string
  category: string
  status: PostStatus
  deck: string
  fill: PostFill
  toc: PostTocItem[]
  html: string
}

interface PostFrontmatter {
  title?: string
  date?: string
  category?: string
  status?: PostStatus
  deck?: string
  fill?: PostFill
  deploy?: boolean
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
}).use(katexPlugin, {
  throwOnError: false,
  errorColor: '#ff4eb2'
})

const defaultHeadingOpen =
  md.renderer.rules.heading_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const toc = env.toc as PostTocItem[] | undefined
  const level = Number(tokens[idx].tag.slice(1))

  if (toc && (level === 2 || level === 3)) {
    const inline = tokens[idx + 1]
    const title = inline?.type === 'inline' ? inline.content : ''
    const id = uniqueHeadingId(title, toc)
    tokens[idx].attrSet('id', id)
    toc.push({ id, level, title })
  }

  return defaultHeadingOpen(tokens, idx, options, env, self)
}

const modules = import.meta.glob<string>('../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

function parseFrontmatter(raw: string): { data: PostFrontmatter; content: string } {
  if (!raw.startsWith('---')) return { data: {}, content: raw }

  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { data: {}, content: raw }

  const block = raw.slice(3, end).trim()
  const content = raw.slice(end + 4).trimStart()
  const data: PostFrontmatter = {}

  for (const line of block.split('\n')) {
    const index = line.indexOf(':')
    if (index === -1) continue
    const key = line.slice(0, index).trim() as keyof PostFrontmatter
    const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, '')
    if (key === 'deploy') {
      data.deploy = value.toLowerCase() !== 'false'
      continue
    }

    if (key === 'title' || key === 'date' || key === 'category' || key === 'status' || key === 'deck' || key === 'fill') {
      data[key] = value as never
    }
  }

  return { data, content }
}

function slugFromPath(path: string) {
  return path.split('/').pop()?.replace(/\.md$/, '') ?? path
}

function collectionFromPath(path: string) {
  return path.match(/content\/([^/]+)\//)?.[1] ?? 'posts'
}

export function labelPostCollection(collection: string) {
  return postCollectionLabels[collection] ?? collection.replace(/-/g, ' ')
}

export function describePostCollection(collection: string) {
  return postCollectionDecks[collection] ?? 'writing collection'
}

function slugifyHeading(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[`~!@#$%^&*()+=[\]{}|\\:;"'<>,.?/]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || 'section'
}

function uniqueHeadingId(title: string, toc: PostTocItem[]) {
  const base = slugifyHeading(title)
  let id = base
  let index = 2

  while (toc.some(item => item.id === id)) {
    id = `${base}-${index}`
    index += 1
  }

  return id
}

function formatTime(date: string) {
  const [year, month, day] = date.split('-')
  return [year, month, day].filter(Boolean).join(' · ')
}

function renderMarkdown(content: string, toc: PostTocItem[]) {
  return md.render(content, { toc })
}

function shouldIncludePost(data: PostFrontmatter) {
  return !import.meta.env.PROD || data.deploy !== false
}

export const posts: Post[] = Object.entries(modules)
  .flatMap(([path, raw]) => {
    const parsed = parseFrontmatter(raw)
    const data = parsed.data
    if (!shouldIncludePost(data)) return []

    const slug = slugFromPath(path)
    const collection = collectionFromPath(path)
    const date = data.date ?? '1970-01-01'
    const toc: PostTocItem[] = []

    return {
      slug,
      collection,
      title: data.title ?? slug,
      date,
      time: formatTime(date),
      category: data.category ?? 'NOTE',
      status: data.status ?? 'draft',
      deck: data.deck ?? '',
      fill: data.fill ?? 'dark',
      toc,
      html: renderMarkdown(parsed.content, toc)
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export function findPost(slug: string) {
  return posts.find(post => post.slug === slug)
}

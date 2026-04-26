import MarkdownIt from 'markdown-it'
import markdownItKatex from 'markdown-it-katex'

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
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
}).use(markdownItKatex, {
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
  return postCollectionLabels[collection] ?? collection.replace(/-/g, ' ').toUpperCase()
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
  return md
    .render(content, { toc })
    .replace(
      /<p>\s*(<span class="katex-display">[\s\S]*?<\/span>)\s*<\/p>/g,
      '<div class="math-block">$1</div>'
    )
}

export const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const parsed = parseFrontmatter(raw)
    const data = parsed.data
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

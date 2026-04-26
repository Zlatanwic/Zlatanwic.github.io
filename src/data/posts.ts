import MarkdownIt from 'markdown-it'

export type PostStatus = 'draft' | 'planned' | 'published'
export type PostFill = 'dark' | 'mint' | 'uv' | 'yellow'

export interface Post {
  slug: string
  title: string
  date: string
  time: string
  category: string
  status: PostStatus
  deck: string
  fill: PostFill
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
})

const modules = import.meta.glob<string>('../content/posts/*.md', {
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

function formatTime(date: string) {
  const [year, month, day] = date.split('-')
  return [year, month, day].filter(Boolean).join(' · ')
}

export const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const parsed = parseFrontmatter(raw)
    const data = parsed.data
    const slug = slugFromPath(path)
    const date = data.date ?? '1970-01-01'

    return {
      slug,
      title: data.title ?? slug,
      date,
      time: formatTime(date),
      category: data.category ?? 'NOTE',
      status: data.status ?? 'draft',
      deck: data.deck ?? '',
      fill: data.fill ?? 'dark',
      html: md.render(parsed.content)
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export function findPost(slug: string) {
  return posts.find(post => post.slug === slug)
}

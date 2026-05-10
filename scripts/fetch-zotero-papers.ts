import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

type PaperStatus = 'deep-read' | 'skim-read' | 'reading' | 'queued'

interface ZoteroTag {
  tag: string
}

interface ZoteroCreator {
  firstName?: string
  lastName?: string
  name?: string
  creatorType?: string
}

interface ZoteroItemData {
  key: string
  itemType: string
  title?: string
  url?: string
  DOI?: string
  date?: string
  publicationTitle?: string
  conferenceName?: string
  proceedingsTitle?: string
  repository?: string
  publisher?: string
  abstractNote?: string
  extra?: string
  tags?: ZoteroTag[]
  creators?: ZoteroCreator[]
}

interface ZoteroItem {
  key: string
  version: number
  data: ZoteroItemData
}

interface GeneratedPaper {
  title: string
  url?: string
  venue: string
  category: string | string[]
  area?: string
  status: PaperStatus
  takeaway?: string
  noteSlug?: string
  zoteroKey: string
}

interface CacheFile {
  fetchedAt?: string
  libraryVersion?: string
  source?: Record<string, string | undefined>
  papers?: GeneratedPaper[]
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function loadLocalEnv() {
  const envPath = path.resolve(__dirname, '../.env')
  if (!fs.existsSync(envPath)) return

  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const index = line.indexOf('=')
    if (index === -1) continue

    const key = line.slice(0, index).trim()
    const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, '')
    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

loadLocalEnv()

const OUT = path.resolve(__dirname, '../src/data/generated/zotero-papers.json')

const LIBRARY_ID = process.env.ZOTERO_LIBRARY_ID
const LIBRARY_TYPE = (process.env.ZOTERO_LIBRARY_TYPE || 'user').toLowerCase()
const API_KEY = process.env.ZOTERO_API_KEY
const COLLECTION_KEY = process.env.ZOTERO_COLLECTION_KEY
const TAG = process.env.ZOTERO_TAG
const MAX_ITEMS = Number(process.env.ZOTERO_LIMIT || '300')

const CATEGORY_ORDER = [
  'MLSYS',
  'DL COMPILER',
  'ARCHITECTURE',
  'ALGORITHM',
  'AGENTIC AI',
  'MISC'
]

function readCache(): CacheFile {
  if (!fs.existsSync(OUT)) return {}
  try {
    return JSON.parse(fs.readFileSync(OUT, 'utf8')) as CacheFile
  } catch {
    return {}
  }
}

function zoteroPrefix() {
  if (LIBRARY_TYPE === 'group') return `groups/${LIBRARY_ID}`
  return `users/${LIBRARY_ID}`
}

function endpoint(start: number) {
  const scope = COLLECTION_KEY
    ? `${zoteroPrefix()}/collections/${COLLECTION_KEY}/items/top`
    : `${zoteroPrefix()}/items/top`
  const params = new URLSearchParams({
    v: '3',
    format: 'json',
    include: 'data',
    limit: '100',
    start: String(start),
    sort: 'dateModified',
    direction: 'desc'
  })
  if (TAG) params.append('tag', TAG)
  return `https://api.zotero.org/${scope}?${params.toString()}`
}

function parseLinkHeader(header: string | null) {
  if (!header) return {}
  return Object.fromEntries(
    header.split(',').flatMap(part => {
      const url = part.match(/<([^>]+)>/)?.[1]
      const rel = part.match(/rel="([^"]+)"/)?.[1]
      return url && rel ? [[rel, url]] : []
    })
  ) as Record<string, string | undefined>
}

async function fetchPage(url: string, libraryVersion?: string) {
  const headers: Record<string, string> = {
    'Zotero-API-Version': '3',
    'User-Agent': 'rodebiau-site-build'
  }
  if (API_KEY) headers['Zotero-API-Key'] = API_KEY
  if (libraryVersion) headers['If-Modified-Since-Version'] = libraryVersion

  const response = await fetch(url, { headers })
  if (response.status === 304) {
    return { unchanged: true, items: [], libraryVersion } as const
  }
  if (!response.ok) {
    throw new Error(`Zotero ${response.status}: ${await response.text()}`)
  }

  const items = await response.json() as ZoteroItem[]
  return {
    unchanged: false,
    items,
    next: parseLinkHeader(response.headers.get('link')).next,
    libraryVersion: response.headers.get('last-modified-version') ?? libraryVersion
  } as const
}

function fieldFromExtra(extra: string | undefined, key: string) {
  if (!extra) return undefined
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`^\\s*${escapedKey}\\s*[:\\uFF1A]\\s*(.+)$`, 'im')
  return extra.match(pattern)?.[1]?.trim()
}

function normalizeCategory(category: string) {
  const normalized = category.trim().toUpperCase()
  return normalized === 'INFERENCE' ? 'MLSYS' : normalized
}

function normalizedTags(data: ZoteroItemData) {
  return (data.tags ?? []).map(item => item.tag.trim()).filter(Boolean)
}

function tagValue(tags: string[], key: string) {
  const prefix = `${key}:`
  return tags.find(tag => tag.toLowerCase().startsWith(prefix))?.slice(prefix.length).trim()
}

function inferStatus(tags: string[], extra?: string): PaperStatus {
  const value = (fieldFromExtra(extra, 'status') || tagValue(tags, 'status') || '').toLowerCase()
  if (['deep-read', 'deep', 'intensive', 'read', 'done', 'finished', '已读', '已精读', '精读'].includes(value)) return 'deep-read'
  if (['skim-read', 'skim', 'skimmed', 'scanned', 'light-read', '已略读', '略读'].includes(value)) return 'skim-read'
  if (['reading', 'current', '在读'].includes(value)) return 'reading'
  return 'queued'
}

function inferCategory(tags: string[], extra?: string): string | string[] {
  const value = fieldFromExtra(extra, 'category') || tagValue(tags, 'category')
  if (value) {
    const categories = value.split(/[;,]/).map(normalizeCategory).filter(Boolean)
    return categories.length > 1 ? categories : categories[0] ?? 'MISC'
  }

  const direct = tags
    .map(normalizeCategory)
    .filter(tag => CATEGORY_ORDER.includes(tag))
  if (direct.length) return Array.from(new Set(direct))

  return 'MISC'
}

function inferArea(tags: string[], extra?: string) {
  return fieldFromExtra(extra, 'area') || tagValue(tags, 'area')
}

function inferUrl(data: ZoteroItemData) {
  if (data.url) return data.url
  if (data.DOI) return `https://doi.org/${data.DOI}`
  return undefined
}

function yearFromDate(date: string | undefined) {
  return date?.match(/\d{4}/)?.[0]
}

function inferVenue(data: ZoteroItemData, extra?: string) {
  const explicitVenue = fieldFromExtra(extra, 'venue')
  if (explicitVenue) return explicitVenue.toUpperCase()

  const base =
    data.conferenceName ||
    data.proceedingsTitle ||
    data.publicationTitle ||
    data.repository ||
    data.publisher ||
    data.itemType
  const year = yearFromDate(data.date)

  return [base, year].filter(Boolean).join(' ').toUpperCase() || 'ZOTERO'
}

function inferTakeaway(data: ZoteroItemData) {
  return fieldFromExtra(data.extra, 'takeaway')
}

function inferNoteSlug(data: ZoteroItemData) {
  return fieldFromExtra(data.extra, 'noteSlug')
}

function isPaperLike(data: ZoteroItemData) {
  return !['attachment', 'note', 'annotation'].includes(data.itemType)
}

function mapItem(item: ZoteroItem): GeneratedPaper | null {
  const data = item.data
  if (!isPaperLike(data) || !data.title) return null

  const tags = normalizedTags(data)

  return {
    title: data.title,
    url: inferUrl(data),
    venue: inferVenue(data, data.extra),
    category: inferCategory(tags, data.extra),
    area: inferArea(tags, data.extra),
    status: inferStatus(tags, data.extra),
    takeaway: inferTakeaway(data),
    noteSlug: inferNoteSlug(data),
    zoteroKey: data.key || item.key
  }
}

async function fetchAll() {
  const cache = readCache()
  let url: string | undefined = endpoint(0)
  let libraryVersion = cache.libraryVersion
  const items: ZoteroItem[] = []

  while (url && items.length < MAX_ITEMS) {
    const page = await fetchPage(url, items.length === 0 ? libraryVersion : undefined)
    if (page.unchanged) {
      console.log('[fetch-zotero] Library unchanged; keeping cached papers.')
      return cache
    }

    items.push(...page.items)
    libraryVersion = page.libraryVersion
    url = page.next
  }

  const papers = items
    .slice(0, MAX_ITEMS)
    .map(mapItem)
    .filter((item): item is GeneratedPaper => Boolean(item))

  return {
    fetchedAt: new Date().toISOString(),
    libraryVersion,
    source: {
      libraryType: LIBRARY_TYPE,
      libraryId: LIBRARY_ID,
      collectionKey: COLLECTION_KEY,
      tag: TAG
    },
    papers
  } satisfies CacheFile
}

async function main() {
  if (!LIBRARY_ID) {
    console.log('[fetch-zotero] No ZOTERO_LIBRARY_ID found; keeping existing generated papers.')
    console.log('[fetch-zotero] Set ZOTERO_LIBRARY_ID, optional ZOTERO_API_KEY, and optional ZOTERO_COLLECTION_KEY to sync Zotero.')
    return
  }

  const payload = await fetchAll()
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2))
  console.log(`[fetch-zotero] Wrote ${payload.papers?.length ?? 0} papers to ${OUT}`)
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error)
  console.error('[fetch-zotero] Failed:', message)
  process.exit(1)
})

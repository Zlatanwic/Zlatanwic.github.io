import { ref, computed, onMounted } from 'vue'

const username = 'Zlatanwic'
const EVENTS_CACHE_KEY = 'rodebiau:github-events'
const EVENTS_CACHE_TTL = 1000 * 60 * 30 // 30 min

const rawEvents = ref([])
const staticData = ref(null) // Build-time contribution data
const loading = ref(false)
const error = ref(null)
const hasRealData = ref(false)

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

function readCache() {
  try {
    const raw = localStorage.getItem(EVENTS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.ts > EVENTS_CACHE_TTL) return null
    return parsed.data
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  } catch { /* ignore */ }
}

async function fetchEvents(page = 1) {
  const res = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`
  )
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  return res.json()
}

async function loadStatic() {
  try {
    const res = await fetch('/github-contributions.json')
    if (!res.ok) return false
    const json = await res.json()
    if (!json.weeks) return false
    staticData.value = json
    hasRealData.value = true
    return true
  } catch {
    return false
  }
}

async function loadEvents() {
  loading.value = true
  error.value = null

  const cached = readCache()
  if (cached) {
    rawEvents.value = cached
    loading.value = false
    return
  }

  try {
    const all = []
    for (let page = 1; page <= 3; page++) {
      const batch = await fetchEvents(page)
      if (!batch.length) break
      all.push(...batch)
      if (batch.length < 100) break
    }
    rawEvents.value = all
    writeCache(all)
  } catch (e) {
    error.value = e.message || 'Failed to load GitHub activity'
  } finally {
    loading.value = false
  }
}

export function useGithubActivity() {
  onMounted(async () => {
    const ok = await loadStatic()
    if (!ok) await loadEvents()
  })

  // ---------- Real contribution data (build-time GraphQL) ----------
  const contributionDays = computed(() => {
    if (!staticData.value?.weeks) return []
    const days = []
    for (const week of staticData.value.weeks) {
      for (const day of week.contributionDays) {
        const count = day.contributionCount
        let level = 0
        if (count >= 8) level = 4
        else if (count >= 4) level = 3
        else if (count >= 2) level = 2
        else if (count >= 1) level = 1
        days.push({
          date: day.date,
          count,
          level,
          isFuture: false,
          weekday: day.weekday
        })
      }
    }
    return days
  })

  const contributionWeeks = computed(() => {
    const d = contributionDays.value
    const w = []
    for (let i = 0; i < d.length; i += 7) {
      w.push(d.slice(i, i + 7))
    }
    return w
  })

  const contributionStats = computed(() => {
    const total = staticData.value?.totalContributions || 0
    const days = contributionDays.value
    let streak = 0
    let maxStreak = 0
    let running = 0

    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) {
        running++
        maxStreak = Math.max(maxStreak, running)
        streak = running
      } else {
        running = 0
      }
    }

    const activeDays = days.filter(d => d.count > 0).length
    return { total, streak, maxStreak, activeDays }
  })

  // ---------- Fallback: Events API ----------
  const eventDays = computed(() => {
    const counts = new Map()
    rawEvents.value.forEach(ev => {
      const d = isoDate(new Date(ev.created_at))
      counts.set(d, (counts.get(d) || 0) + 1)
    })

    // Only build weeks that have data, plus a small buffer
    const dates = Array.from(counts.keys()).sort()
    if (!dates.length) return []

    const firstDate = new Date(dates[0])
    const today = new Date()
    const dayOfWeek = firstDate.getDay()
    const startOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const start = new Date(firstDate)
    start.setDate(firstDate.getDate() - startOffset)

    const list = []
    const msPerDay = 86400000
    for (let t = start.getTime(); t <= today.getTime(); t += msPerDay) {
      const d = new Date(t)
      const s = isoDate(d)
      const count = counts.get(s) || 0
      let level = 0
      if (count >= 8) level = 4
      else if (count >= 4) level = 3
      else if (count >= 2) level = 2
      else if (count >= 1) level = 1
      list.push({ date: s, count, level, isFuture: false })
    }
    return list
  })

  const eventWeeks = computed(() => {
    const d = eventDays.value
    const w = []
    for (let i = 0; i < d.length; i += 7) {
      w.push(d.slice(i, i + 7))
    }
    return w
  })

  const eventStats = computed(() => {
    const total = rawEvents.value.length
    const days = eventDays.value
    let streak = 0
    let maxStreak = 0
    let running = 0

    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) {
        running++
        maxStreak = Math.max(maxStreak, running)
        streak = running
      } else {
        running = 0
      }
    }

    const activeDays = days.filter(d => d.count > 0).length
    return { total, streak, maxStreak, activeDays }
  })

  // ---------- Unified interface ----------
  const days = computed(() => (hasRealData.value ? contributionDays.value : eventDays.value))
  const weeks = computed(() => (hasRealData.value ? contributionWeeks.value : eventWeeks.value))
  const stats = computed(() => (hasRealData.value ? contributionStats.value : eventStats.value))

  return {
    loading,
    error,
    days,
    weeks,
    stats,
    hasRealData,
    reload: () => loadStatic().then(ok => { if (!ok) loadEvents() })
  }
}

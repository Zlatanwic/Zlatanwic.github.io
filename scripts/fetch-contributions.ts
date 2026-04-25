/**
 * Build-time fetcher for GitHub contribution data.
 *
 * Uses GitHub GraphQL API to get the real contributionCalendar
 * (the same data that powers the profile graph).
 *
 * Run with: GITHUB_TOKEN=ghp_xxx pnpm exec tsx scripts/fetch-contributions.ts
 * Output: public/github-contributions.json
 */

import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const USERNAME = 'Zlatanwic'
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const OUT = path.resolve(__dirname, '../public/github-contributions.json')

const QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
            weekday
          }
        }
      }
    }
  }
}
`

interface GraphQLContributionDay {
  contributionCount: number
  date: string
  weekday: number
}

interface GraphQLContributionCalendar {
  totalContributions: number
  weeks: Array<{
    contributionDays: GraphQLContributionDay[]
  }>
}

interface GraphQLData {
  user?: {
    contributionsCollection?: {
      contributionCalendar?: GraphQLContributionCalendar
    }
  }
}

interface GraphQLResponse {
  data?: GraphQLData
  errors?: Array<{ message: string }>
}

function graphQL(): Promise<GraphQLData | undefined> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: QUERY, variables: { login: USERNAME } })
    const req = https.request(
      {
        hostname: 'api.github.com',
        path: '/graphql',
        method: 'POST',
        headers: {
          'Authorization': `bearer ${TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'rodebiau-site-build',
          'Content-Length': Buffer.byteLength(body)
        }
      },
      (res) => {
        let data = ''
        res.on('data', chunk => { data += chunk })
        res.on('end', () => {
          try {
            const json = JSON.parse(data) as GraphQLResponse
            if (json.errors) {
              reject(new Error(json.errors.map((e) => e.message).join('; ')))
            } else {
              resolve(json.data)
            }
          } catch (e) {
            reject(e)
          }
        })
      }
    )
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function main() {
  if (!TOKEN) {
    console.log('[fetch-contributions] No GITHUB_TOKEN found — skipping real contribution fetch.')
    console.log('[fetch-contributions] The site will fall back to Events API at runtime.')
    console.log('[fetch-contributions] To enable accurate data, add a GITHUB_TOKEN secret to your repo.')
    process.exit(0)
  }

  try {
    const data = await graphQL()
    const calendar = data?.user?.contributionsCollection?.contributionCalendar
    if (!calendar) {
      throw new Error('Unexpected GraphQL response shape')
    }

    const payload = {
      fetchedAt: new Date().toISOString(),
      username: USERNAME,
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks
    }

    fs.mkdirSync(path.dirname(OUT), { recursive: true })
    fs.writeFileSync(OUT, JSON.stringify(payload, null, 2))
    console.log(`[fetch-contributions] Wrote ${calendar.totalContributions} contributions to ${OUT}`)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[fetch-contributions] Failed:', message)
    process.exit(1)
  }
}

main()

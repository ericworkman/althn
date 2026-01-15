import { NextResponse } from 'next/server'

// In-memory cache
let cachedStories: number[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function GET() {
  const now = Date.now()

  // Return cached data if still fresh
  if (cachedStories && now - lastFetchTime < CACHE_DURATION) {
    return NextResponse.json({
      stories: cachedStories,
      cached: true,
      age: Math.floor((now - lastFetchTime) / 1000),
    })
  }

  try {
    // Fetch fresh data from Firebase
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }

    const stories = await response.json()

    // Update cache
    cachedStories = stories.slice(0, 100)
    lastFetchTime = now

    return NextResponse.json({
      stories: cachedStories,
      cached: false,
      age: 0,
    })
  } catch (error) {
    // If fetch fails but we have cached data, return it anyway
    if (cachedStories) {
      return NextResponse.json({
        stories: cachedStories,
        cached: true,
        error: 'Failed to refresh, serving stale data',
        age: Math.floor((now - lastFetchTime) / 1000),
      })
    }

    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
  }
}

import fetchMeta from 'fetch-meta-tags'
import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_IMAGE_URL = 'https://placehold.co/100/fd790f/white?text=//'

// In-memory cache for preview metadata
interface PreviewData {
  status: string
  icon?: string | null
  image?: string | null
  fallback: string
  error?: string
}

const previewCache = new Map<string, { data: PreviewData; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url || url == 'undefined') {
    return NextResponse.json({
      status: 'ok',
      image: DEFAULT_IMAGE_URL,
    })
  }

  // Check cache first
  const now = Date.now()
  const cached = previewCache.get(url)
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data)
  }

  try {
    const meta = await fetchMeta(url)
    const response = {
      status: 'ok',
      icon: meta.icon,
      image: meta.image,
      fallback: DEFAULT_IMAGE_URL,
    }

    // Store in cache
    previewCache.set(url, { data: response, timestamp: now })

    return NextResponse.json(response)
  } catch (error) {
    // Return fallback on error
    const fallbackResponse = {
      status: 'error',
      icon: null,
      image: null,
      fallback: DEFAULT_IMAGE_URL,
    }
    return NextResponse.json(fallbackResponse)
  }
}

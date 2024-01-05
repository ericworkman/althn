import fetchMeta from 'fetch-meta-tags'
import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_IMAGE_URL = 'https://placehold.co/405x720?text=discuss'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url || url == 'undefined') {
    return NextResponse.json({
      status: 'ok',
      image: DEFAULT_IMAGE_URL,
    })
  }

  const meta = await fetchMeta(url)
  return NextResponse.json({
    status: 'ok',
    image: meta.image || meta.icon || DEFAULT_IMAGE_URL,
  })
}

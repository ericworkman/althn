import { NextRequest, NextResponse } from 'next/server'
import { ref, child, get, query, limitToFirst } from 'firebase/database'
import { db } from '@/components/FirebaseConfig'

export async function GET(req: NextRequest) {
  const topStoriesRef = query(child(ref(db), 'v0/topstories'), limitToFirst(30))
  const topStories = await get(topStoriesRef)
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : []))
    .catch((error) => {
      console.error(error)
    })

  return NextResponse.json({
    status: 'ok',
    stories: topStories,
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { ref, child, get } from 'firebase/database'
import { db } from '@/components/FirebaseConfig'

export async function GET(req: NextRequest, { params }: { params: { itemID: number } }) {
  const item = await get(child(ref(db), `v0/item/${params.itemID}`))
    .then((snapshot) => snapshot.val())
    .catch((error) => {
      console.error(error)
    })

  return NextResponse.json({
    status: 'ok',
    item: item,
  })
}

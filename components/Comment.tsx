import { ref, child, get } from 'firebase/database'

import { db } from '@/components/FirebaseConfig'
import { htmlDecode } from '@/components/Helpers'

async function Comment({ id }: { id: number }) {
  const comment = await get(child(ref(db), `v0/item/${id}`))
    .then((snapshot) => snapshot.val())
    .catch((error) => {
      console.error(error)
    })

  const text = comment ? htmlDecode(comment.text) : { __html: '' }

  return (
    <div className="text-md leading-6 text-gray-700 line-clamp-5" dangerouslySetInnerHTML={text} />
  )
}

export default Comment

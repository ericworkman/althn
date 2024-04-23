'use client'

import { htmlDecode } from '@/components/Helpers'
import useSWR from 'swr'
import RelativeTime from './RelativeTime'
import { useState } from 'react'
import { ref, child, get } from 'firebase/database'
import { db } from '@/components/FirebaseConfig'

function Comment({ id, level = 0 }: { id: number; level: number }) {
  const [children, setChildren] = useState([])
  const [collapse, setCollapse] = useState(false)

  async function fetchItem(id: number) {
    return await get(child(ref(db), `v0/item/${id}`))
      .then((snapshot) => snapshot.val())
      .catch((error) => {
        console.error(error)
      })
  }
  const { data, error, isLoading } = useSWR(id.toString(), () => fetchItem(id))

  if (isLoading) return <div>Loading</div>
  if (error) return <div>error {error} </div>

  const comment = data
  const text = comment ? htmlDecode(comment.text) : { __html: '' }

  function loadChildren() {
    setChildren(comment.kids.map((kid: number) => <Comment id={kid} level={level + 1} key={kid} />))
  }

  return (
    <div className="ml-4">
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setCollapse(!collapse)}
          className="cursor-pointer hover:text-slate-300"
        >
          [-]
        </button>
        <span className="text-lg">{comment.by}</span>
        <span className="text-sm">
          <RelativeTime unixTimestamp={comment.time} />
        </span>
      </div>
      {collapse ? (
        <></>
      ) : (
        <div className="border-l-2 border-slate-200 dark:border-slate-600 ml-2">
          <p className="text-md font-light leading-7 pl-4 w-full" dangerouslySetInnerHTML={text} />
          {comment.kids && children.length == 0 && (
            <button onClick={() => loadChildren()} className="cursor-pointer mt-3 ml-2">
              Load Replies
            </button>
          )}
          <div className="mt-3">{children}</div>
        </div>
      )}
    </div>
  )
}

export default Comment

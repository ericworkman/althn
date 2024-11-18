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
  const { data: comment, error, isLoading } = useSWR(id.toString(), () => fetchItem(id))

  if (isLoading) return <div className="pl-2">Loading</div>
  if (error) return <div className="pl-2">error {error} </div>
  if (!comment) return <></>

  const text = comment ? htmlDecode(comment.text) : { __html: '' }

  function loadChildren() {
    setChildren(comment.kids.map((kid: number) => <Comment id={kid} level={level + 1} key={kid} />))
  }

  return (
    <div className={['overflow-hidden mb-1', level > 0 ? 'ml-2' : ''].join(' ')}>
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setCollapse(!collapse)}
          className={[
            'cursor-pointer hover:text-slate-300',
            collapse ? 'text-slate-200 dark:text-slate-600' : 'text-slate-900 dark:text-slate-200',
          ].join(' ')}
        >
          [-]
        </button>
        <a
          href={`https://news.ycombinator.com/user?id=${comment.by}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-500 text-lg"
        >
          {comment.by}
        </a>
        <span className="text-sm">
          <RelativeTime unixTimestamp={comment.time} />
        </span>
      </div>
      {collapse ? (
        <></>
      ) : (
        <div className="border-l-2 border-slate-200 dark:border-slate-600 ml-2 overflow-x-auto">
          <p className="text-base/7 font-light pl-4 w-full" dangerouslySetInnerHTML={text} />
          {comment.kids && children.length == 0 && (
            <button
              onClick={() => loadChildren()}
              className="cursor-pointer mt-3 ml-2 font-light text-sm"
            >
              Load Replies
            </button>
          )}
          {children.length > 0 && <div className="mt-3">{children}</div>}
        </div>
      )}
    </div>
  )
}

export default Comment

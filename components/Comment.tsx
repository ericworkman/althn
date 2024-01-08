'use client'

import { htmlDecode } from '@/components/Helpers'
import useSWR from 'swr'
import RelativeTime from './RelativeTime'
import { useState } from 'react'

function Comment({ id, level = 0 }: { id: number; level: number }) {
  const [children, setChildren] = useState([])
  const [collapse, setCollapse] = useState(false)

  // @ts-ignore
  const fetcher = (...args) => fetch(...args).then((res) => res.json())
  const { data, error, isLoading } = useSWR(`/api/items/${id}`, fetcher)

  if (isLoading) return <div>Loading</div>
  if (error) return <div>error {error} </div>

  const comment = data.item
  const text = comment ? htmlDecode(comment.text) : { __html: '' }

  function loadChildren() {
    setChildren(comment.kids.map((kid: number) => <Comment id={kid} level={level + 1} key={kid} />))
  }

  let indent: string
  switch (level) {
    case 0:
      indent = 'ml-0'
      break
    case 1:
      indent = 'ml-4'
      break
    case 2:
      indent = 'ml-8'
      break
    default:
      indent = 'ml-12'
  }

  return (
    <div className={indent}>
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setCollapse(!collapse)}
          className="cursor-pointer hover:text-gray-300"
        >
          [-]
        </button>
        <span className="text-lg">{comment.by}</span>
        <span className="text-sm">
          <RelativeTime unixTimestamp={comment.time} />
        </span>
      </div>
      {collapse ? (
        <span className="text-gray-500">hidden</span>
      ) : (
        <>
          <p
            className="text-md font-light leading-7 border-l-2 pl-4 w-full"
            dangerouslySetInnerHTML={text}
          />
          {comment.kids && children.length == 0 && (
            <button onClick={() => loadChildren()} className="cursor-pointer mt-3 ml-2">
              Load Replies
            </button>
          )}
          <div className="mt-3">{children}</div>
        </>
      )}
    </div>
  )
}

export default Comment

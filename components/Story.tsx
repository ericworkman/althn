'use client'

import Comment from '@/components/Comment'
import { htmlDecode } from '@/components/Helpers'
import ItemMeta from './ItemMeta'
import HNItem from '@/lib/types/HNItem'
import { useEffect, useRef } from 'react'

function Story({ story }: { story: HNItem }) {
  const storyRef = useRef(null)

  useEffect(() => {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    // @ts-ignore
    storyRef?.current?.scrollIntoView()
  }, [story, storyRef])

  if (!story.id) return <></>

  const text = htmlDecode(story.text)

  return (
    <article key={story.id} className="px-4">
      <h3 className="mb-3 text-2xl md:text-4xl font-semibold text-slate-900 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300 pt-2 md:pt-0">
        <a
          href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
          target="_blank"
          rel="noopener noreferrer"
          ref={storyRef}
        >
          {story.title}
        </a>
      </h3>

      <div className="text-xs flex items-center gap-3 mb-4">
        <ItemMeta item={story} />
      </div>

      <div className="flex flex-col gap-4">
        {story.text && (
          <p className="text-base/7 font-light text-ellipsis" dangerouslySetInnerHTML={text} />
        )}
        {story.kids &&
          story.kids.map((commentID: number) => (
            <Comment id={commentID} key={commentID} level={0} />
          ))}
        {!story.kids && <p className="">No comments</p>}
      </div>
    </article>
  )
}

export default Story

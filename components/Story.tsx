'use client'

import Comment from '@/components/Comment'
import { htmlDecode } from '@/components/Helpers'
import ItemMeta from './ItemMeta'
import HNItem from '@/lib/types/HNItem'

function Story({ story }: { story: HNItem }) {
  if (!story.id) return <></>

  const text = htmlDecode(story.text)

  return (
    <article key={story.id} className="px-4">
      <h3 className="mb-3 text-4xl font-semibold text-gray-900 hover:text-gray-700">
        <a
          href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {story.title}
        </a>
      </h3>

      <div className="text-xs flex items-center gap-3 mb-4">
        <ItemMeta item={story} />
      </div>

      <div className="flex flex-col gap-6">
        {story.text && (
          <p
            className="text-md font-light leading-6 text-ellipsis"
            dangerouslySetInnerHTML={text}
          />
        )}
        {story.kids &&
          story.kids.map((commentID: number) => (
            <Comment id={commentID} key={commentID} level={0} />
          ))}
      </div>
    </article>
  )
}

export default Story

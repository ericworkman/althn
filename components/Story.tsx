import { ref, child, get } from 'firebase/database'
import { db } from '@/components/FirebaseConfig'

import Tag from '@/components/Tag'
import Comment from '@/components/Comment'
import RelativeTime from '@/components/RelativeTime'
import PreviewImage from './PreviewImage'
import { htmlDecode, pluralize } from '@/components/Helpers'

async function Story({ storyID }: { storyID: number }) {
  const story = await get(child(ref(db), `v0/item/${storyID}`))
    .then((snapshot) => snapshot.val())
    .catch((error) => {
      console.error(error)
    })

  const text = htmlDecode(story.text)

  return (
    <>
      <article key={story.id} className="relative isolate flex flex-col md:flex-row gap-8">
        <PreviewImage url={story.url} />
        <div>
          <div className="grid grid-cols-2 md:grid-cols-1 md:flex items-center gap-2 gap-x-4 text-sm">
            <RelativeTime unixTimestamp={story.time} />
            <a href={`https://news.ycombinator.com/user?id=${story.by}`} target="_blank" rel="noopener noreferrer">
              <Tag text={story.by} />
            </a>
            <div>
              <Tag text={pluralize('point', story.score)} />
            </div>
            <a href={`https://news.ycombinator.com/item?id=${story.id}`} target="_blank" rel="noopener noreferrer">
              <Tag text={pluralize('comment', story.descendants)} />
            </a>
          </div>
          <h3 className="my-3 text-3xl font-semibold text-gray-900 hover:text-gray-700">
            <a href={story.url || `https://news.ycombinator.com/item?id=${story.id}`} target="_blank" rel="noopener noreferrer">
              {story.title}
            </a>
          </h3>
          <div className="grid gap-6">
            {story.text && (
              <div
                className="text-md leading-6 text-gray-700 line-clamp-5"
                dangerouslySetInnerHTML={text}
              />
            )}
            {story.kids && (
              <div className="overflow-hidden">
                <h4 className="text-lg">Top Comment</h4>
                <Comment id={story.kids[0]} />
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  )
}

export default Story

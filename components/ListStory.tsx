'use client'

import PreviewImage from './PreviewImage'
import useSWR from 'swr'
import ItemMeta from './ItemMeta'
import HNItem from '@/lib/types/HNItem'

function ListStory({
  storyID,
  selected,
  setSelected,
}: {
  storyID: number
  selected: HNItem
  setSelected: (story: HNItem) => void
}) {
  // @ts-ignore
  const fetcher = (...args) => fetch(...args).then((res) => res.json())
  const { data, error, isLoading } = useSWR(`/api/items/${storyID}`, fetcher)

  if (isLoading) return <div>Loading</div>
  if (error) return <div>error {error} </div>

  const story = data.item
  const focusClass = storyID == selected.id ? 'ring ring-indigo-300 rounded-lg' : ''

  return (
    <article key={story.id} className={`${focusClass} shrink-0 p-1 w-10/12 lg:w-full`}>
      <div className="flex gap-3">
        <PreviewImage url={story.url} />
        <h3 className="text-xl font-semibold text-gray-900 hover:text-gray-700">
          <button onClick={() => setSelected(story)} className="cursor-pointer text-left">
            {story.title}
          </button>
        </h3>
      </div>

      <div className="text-xs flex items-center gap-3">
        <ItemMeta item={story} />
      </div>
    </article>
  )
}

export default ListStory

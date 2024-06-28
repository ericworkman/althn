'use client'

import { ref, child, get } from 'firebase/database'
import { db } from '@/components/FirebaseConfig'
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
  async function fetchItem(id: number) {
    return await get(child(ref(db), `v0/item/${id}`))
      .then((snapshot) => snapshot.val())
      .catch((error) => {
        console.error(error)
      })
  }
  const { data: story, error, isLoading } = useSWR(storyID.toString(), () => fetchItem(storyID))

  if (isLoading) return <div>Loading</div>
  if (error) return <div>error {error} </div>
  if (!story) return <></>

  const focusClass = storyID == selected.id ? 'ring ring-indigo-300 rounded-lg' : ''

  return (
    <article
      key={story.id}
      className={`${focusClass} shrink-0 p-1 w-10/12 lg:w-full flex gap-3 snap-center`}
    >
      <PreviewImage url={story.url} />
      <div>
        <h3 className="text-xl/7 font-semibold text-slate-900 dark:text-slate-100 hover:text-slate-500 dark:hover:text-slate-300">
          <button onClick={() => setSelected(story)} className="cursor-pointer text-left">
            {story.title}
          </button>
        </h3>
        <div className="flex items-center gap-3 mt-1">
          <ItemMeta item={story} />
        </div>
      </div>
    </article>
  )
}

export default ListStory

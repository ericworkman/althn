'use client'

import { ref, child, get } from 'firebase/database'
import { db } from '@/components/FirebaseConfig'
import PreviewImage from './PreviewImage'
import useSWR from 'swr'
import ItemMeta from './ItemMeta'
import HNItem from '@/lib/types/HNItem'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ListStory({
  storyID,
  selected,
  setSelected,
  onSelect,
}: {
  storyID: number
  selected: HNItem
  setSelected: (story: HNItem) => void
  onSelect?: () => void
}) {
  const searchParams = useSearchParams()

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

  const focusClass =
    storyID == selected.id
      ? 'border-r-4 border-r-indigo-500'
      : 'border-r-4 border-r-transparent hover:border-r-indigo-300 dark:hover:border-r-indigo-400'

  function setAndPushStory(story: HNItem) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('item', story.id as unknown as string)
    window.history.pushState(null, '', `?${params.toString()}`)
    setSelected(story)
    onSelect?.()
  }

  return (
    <article
      key={story.id}
      className={`${focusClass} shrink-0 w-full flex gap-3 flex-col overflow-hidden transition-colors pr-2`}
    >
      <button
        onClick={() => setAndPushStory(story)}
        className="flex gap-4 cursor-pointer text-left"
      >
        <PreviewImage url={story.url} />
        <div>
          <h3 className="text-xl/7 font-normal text-slate-900 dark:text-slate-100 hover:text-slate-500 dark:hover:text-slate-300">
            <Suspense>
              <span className="line-clamp-4 md:line-clamp-3">{story.title}</span>
            </Suspense>
          </h3>
        </div>
      </button>
      <div className="flex items-center gap-3">
        <ItemMeta item={story} />
      </div>
    </article>
  )
}

export default ListStory

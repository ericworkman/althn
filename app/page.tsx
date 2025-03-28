'use client'

import { ref, child, get, query, limitToFirst } from 'firebase/database'
import { db } from '@/components/FirebaseConfig'
import ListStory from '@/components/ListStory'
import Story from '@/components/Story'
import HNItem from '@/lib/types/HNItem'
import { useEffect, useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'

export default function TopStories() {
  const [selected, setSelected] = useState<HNItem>({
    id: 0,
    by: 'noone',
    time: 0,
    type: 'story',
  })

  const searchParams = useSearchParams()
  const item = searchParams.get('item')

  async function fetchItem(id: number) {
    return await get(child(ref(db), `v0/item/${id}`))
      .then((snapshot) => snapshot.val())
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    const fetchStory = async (item: number) => {
      return await fetchItem(item)
    }

    if (item) {
      fetchStory(item as unknown as number)
        .then((story) => setSelected(story))
        .catch(console.error)
    }
  }, [item])

  async function fetchItems() {
    const topStoriesRef = query(child(ref(db), 'v0/topstories'), limitToFirst(60))
    return await get(topStoriesRef)
      .then((snapshot) => (snapshot.exists() ? snapshot.val() : []))
      .catch((error) => {
        console.error(error)
      })
  }
  const { data, error, isLoading } = useSWR('topStories', fetchItems, {
    refreshInterval: 300 * 1000,
  })

  const stories = data

  if (isLoading)
    return (
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="#fd790f"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass="h-screen flex items-center justify-center"
      />
    )
  if (error) return <div>Error {error}</div>

  return (
    <main className="w-full px-2 lg:px-4">
      <h1 className="text-2xl lg:text-5xl font-light py-2 lg:py-5">Alt HN</h1>
      <div className="grid grid-cols-1 lg:grid-cols-16 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="flex lg:flex-col gap-6 lg:h-[calc(100vh-88px)] overflow-y-none lg:overflow-y-auto overflow-x-auto lg:overflow-x-auto pl-2 pr-4 py-4 snap-x snap-mandatory">
            {stories.map((storyID: number) => (
              <ListStory
                storyID={storyID}
                key={storyID}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-11 pt-4 lg:h-[calc(100vh-88px)] overflow-y-none lg:overflow-y-auto overflow-x-auto lg:overflow-x-auto">
          {selected && <Story story={selected} />}
        </div>
      </div>
    </main>
  )
}

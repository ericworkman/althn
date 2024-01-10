'use client'

import { ref, child, get, query, limitToFirst } from 'firebase/database'
import { db } from '@/components/FirebaseConfig'
import ListStory from '@/components/ListStory'
import Story from '@/components/Story'
import HNItem from '@/lib/types/HNItem'
import { useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import useSWR from 'swr'

// Forcing the page rerender periodically
export const revalidate = 600 // seconds

export default function TopStories() {
  const [selected, setSelected] = useState<HNItem>({
    id: 0,
    by: 'noone',
    time: 0,
    type: 'story',
  })

  async function fetchItems() {
    const topStoriesRef = query(child(ref(db), 'v0/topstories'), limitToFirst(30))
    return await get(topStoriesRef)
      .then((snapshot) => (snapshot.exists() ? snapshot.val() : []))
      .catch((error) => {
        console.error(error)
      })
  }
  const { data, error, isLoading } = useSWR('topStories', fetchItems, {
    refreshInterval: 60 * 1000,
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
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="flex lg:flex-col gap-6 lg:h-[calc(100vh-88px)] overflow-y-none lg:overflow-y-scroll overflow-x-scroll lg:overflow-x-auto px-2 py-4">
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
        <div className="lg:col-span-8 pt-4 lg:h-[calc(100vh-88px)] overflow-y-none lg:overflow-y-scroll overflow-x-scroll lg:overflow-x-auto">
          {selected && <Story story={selected} />}
        </div>
      </div>
    </main>
  )
}

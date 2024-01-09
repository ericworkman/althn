'use client'

import ListStory from '@/components/ListStory'
import Story from '@/components/Story'
import HNItem from '@/lib/types/HNItem'
import { useState } from 'react'
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

  // @ts-ignore
  const fetcher = (...args) => fetch(...args).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/items', fetcher, { refreshInterval: 60 * 1000 })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error {error}</div>

  return (
    <main className="w-full px-2 lg:px-4">
      <h1 className="text-5xl font-light py-2 lg:py-5">Alt HN</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="flex lg:flex-col gap-6 lg:h-[calc(100vh-88px)] overflow-y-none lg:overflow-y-scroll overflow-x-scroll lg:overflow-x-auto px-2 py-4">
            {data.stories.map((storyID: number) => (
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

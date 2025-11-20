'use client'

import { ref, child, get, query, limitToFirst } from 'firebase/database'
import { db } from '@/components/FirebaseConfig'
import ListStory from '@/components/ListStory'
import Story from '@/components/Story'
import HNItem from '@/lib/types/HNItem'
import { useEffect, useState, Suspense } from 'react'
import { TailSpin } from 'react-loader-spinner'
import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'

function FetchStories() {
  const [selected, setSelected] = useState<HNItem>({
    id: 0,
    by: 'noone',
    time: 0,
    type: 'story',
  })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [leftWidth, setLeftWidth] = useState(25) // percentage
  const [isResizing, setIsResizing] = useState(false)

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = (e.clientX / window.innerWidth) * 100
      if (newWidth >= 20 && newWidth <= 60) {
        setLeftWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

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
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 flex items-center justify-between py-2 lg:py-5 lg:static">
        <h1 className="text-2xl lg:text-5xl font-light">Alt HN</h1>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="lg:hidden p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
          aria-label="Open stories menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsDrawerOpen(false)
          }}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

      <div className="lg:flex lg:gap-0">
        {/* Desktop sidebar / Mobile drawer */}
        <div
          className={`
          fixed lg:relative
          top-0 left-0
          h-full lg:h-auto
          w-11/12 sm:w-5/6
          bg-white dark:bg-slate-800
          z-50 lg:z-0
          transform lg:transform-none
          transition-transform duration-300 ease-in-out
          ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
          style={{
            width:
              typeof window !== 'undefined' && window.innerWidth >= 1024
                ? `${leftWidth}%`
                : undefined,
          }}
        >
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold">Stories</h2>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-6 h-[calc(100vh-88px)] overflow-y-auto pt-2 md:pt-0 pl-2 pr-2 md:pr-3 pb-4">
            {stories.map((storyID: number) => (
              <ListStory
                storyID={storyID}
                key={storyID}
                selected={selected}
                setSelected={setSelected}
                onSelect={() => setIsDrawerOpen(false)}
              />
            ))}
          </div>
        </div>

        {/* Resizable divider - desktop only */}
        <button
          type="button"
          className="hidden lg:block w-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500 cursor-col-resize transition-colors relative group"
          onMouseDown={() => setIsResizing(true)}
          aria-label="Resize sidebar"
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </button>

        <div className="flex-1 lg:h-[calc(100vh-88px)] overflow-y-auto lg:pl-4">
          {selected && <Story story={selected} />}
        </div>
      </div>
    </main>
  )
}

export default function TopStories() {
  return (
    <Suspense>
      <FetchStories />
    </Suspense>
  )
}

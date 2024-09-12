'use client'

import HNItem from '@/lib/types/HNItem'
import RelativeTime from './RelativeTime'
import { BeakerIcon, ChatBubbleBottomCenterIcon } from '@heroicons/react/16/solid'

function ItemMeta({ item }: { item: HNItem }) {
  let domain = { hostname: '' }
  try {
    domain = new URL(item.url ?? '')
  } catch (error) {
    null
  }
  const cleanDomain = domain.hostname
  return (
    <div className="grid grid-cols-1 items-center gap-1 text-slate-500 dark:text-slate-300 text-sm w-full max-w-xl">
      <div className="flex justify-between items-center">
        <RelativeTime unixTimestamp={item.time} />

        <div className="flex gap-1 items-center">
          <BeakerIcon className="h-5 w-5" />
          <span>{item.score}</span>
        </div>

        <div className="flex gap-1 items-center">
          <ChatBubbleBottomCenterIcon className="h-5 w-5" />
          {item.descendants}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h4 className="">{cleanDomain}</h4>

        <a
          href={`https://news.ycombinator.com/user?id=${item.by}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-500"
        >
          {item.by}
        </a>
      </div>
    </div>
  )
}

export default ItemMeta

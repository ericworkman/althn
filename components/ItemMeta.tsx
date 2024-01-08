'use client'

import HNItem from '@/lib/types/HNItem'
import RelativeTime from './RelativeTime'
import { BeakerIcon, ChatBubbleBottomCenterIcon } from '@heroicons/react/16/solid'

function ItemMeta({ item }: { item: HNItem }) {
  return (
    <>
      <RelativeTime unixTimestamp={item.time} />
      <div className="flex gap-1 items-center">
        <BeakerIcon className="h-4 w-4" />
        {item.score}
      </div>
      <div className="flex gap-1 items-center">
        <ChatBubbleBottomCenterIcon className="h-4 w-4" />
        {item.descendants}
      </div>
      <a
        href={`https://news.ycombinator.com/user?id=${item.by}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.by}
      </a>
    </>
  )
}

export default ItemMeta

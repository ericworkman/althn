'use client'

import HNItem from '@/lib/types/HNItem'
import RelativeTime from './RelativeTime'

function ItemMeta({ item }: { item: HNItem }) {
  let domain = { hostname: '' }
  try {
    domain = new URL(item.url ?? '')
  } catch (error) {
    null
  }
  const cleanDomain = domain.hostname

  return (
    <div className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300 w-full">
      {/* Line 1: Key metrics */}
      <div className="flex items-center gap-2">
        <span className="font-light">{item.score} pts</span>
        <span>·</span>
        <a
          href={`https://news.ycombinator.com/item?id=${item.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          {item.descendants || 0} comments
        </a>
        <span>·</span>
        <RelativeTime unixTimestamp={item.time} />
      </div>

      {/* Line 2: Secondary info with truncation */}
      <div className="flex items-center gap-2 min-w-0">
        <a
          href={`https://news.ycombinator.com/user?id=${item.by}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-indigo-600 dark:hover:text-indigo-400 truncate shrink-0"
        >
          {item.by}
        </a>
        {cleanDomain && (
          <>
            <span className="shrink-0">·</span>
            <a
              href={`https://news.ycombinator.com/from?site=${cleanDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-400 truncate hover:text-slate-800 dark:hover:text-slate-200"
            >
              {cleanDomain}
            </a>
          </>
        )}
      </div>
    </div>
  )
}

export default ItemMeta

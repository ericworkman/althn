'use client'

import useSWR from 'swr'

function PreviewImage({ url }: { url: string }) {
  // @ts-ignore
  const fetcher = (...args) => fetch(...args).then((res) => res.json())
  const { data, error, isLoading } = useSWR(`/api/preview?url=${encodeURIComponent(url)}`, fetcher)

  let result
  if (error) {
    result = <div>failed to load</div>
  } else if (isLoading) {
    result = <div>loading...</div>
  } else {
    result = <img src={data.image} alt="preview" className="h-20 w-20 rounded-lg object-cover" />
  }

  return (
    <div className="aspect-[1/1] shrink-0 h-20 w-20" aria-hidden="true">
      {result}
    </div>
  )
}

export default PreviewImage

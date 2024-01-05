'use client'

import useSWR from 'swr'

function PreviewImage({ url }: { url: string }) {
  // @ts-ignore
  const fetcher = (...args) => fetch(...args).then((res) => res.json())
  const { data, error, isLoading } = useSWR(`/api/preview?url=${url}`, fetcher)

  let result
  if (error) {
    result = <div>failed to load</div>
  } else if (isLoading) {
    result = <div>loading...</div>
  } else {
    result = (
      <img
        src={data.image}
        alt=""
        className="absolute inset-0 h-full w-full rounded bg-gray-50 object-cover"
      />
    )
  }

  return (
    <div className="relative aspect-[2/1] aspect-[16/9] md:w-64 md:shrink-0">
      {result}
    </div>
  )
}

export default PreviewImage

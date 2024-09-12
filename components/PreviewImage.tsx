'use client'

import { TailSpin } from 'react-loader-spinner'
import useSWR from 'swr'

function PreviewImage({ url }: { url: string }) {
  // @ts-ignore
  const fetcher = (...args) => fetch(...args).then((res) => res.json())
  const { data, error, isLoading } = useSWR(`/api/preview?url=${encodeURIComponent(url)}`, fetcher)

  let result
  if (error) {
    result = <div className="h-20 w-20 flex items-center text-center">failed to load</div>
  } else if (isLoading) {
    result = (
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="#fd790f"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass="h-20 w-20"
      />
    )
  } else {
    result = (
      <object
        data={data.image || '/missing'}
        type="image/jpg"
        className="h-24 w-24 rounded-lg object-cover"
      >
        <object data={data.icon} type="image/jpg" className="h-24 w-24 rounded-lg object-cover">
          <img src={data.fallback} />
        </object>
      </object>
    )
  }

  return (
    <div className="aspect-[1/1] shrink-0" aria-hidden="true">
      {result}
    </div>
  )
}

export default PreviewImage

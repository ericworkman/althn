'use client'

import { TailSpin } from 'react-loader-spinner'
import useSWR from 'swr'
import { useEffect, useRef, useState } from 'react'

function PreviewImage({ url }: { url: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' } // Start loading 100px before entering viewport
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // @ts-ignore
  const fetcher = (...args) => fetch(...args).then((res) => res.json())
  const { data, isLoading } = useSWR(
    isVisible ? `/api/preview?url=${encodeURIComponent(url)}` : null,
    fetcher
  )
  const imgClass = 'h-24 w-24 rounded-lg object-cover'

  let result
  if (!isVisible || isLoading || !data) {
    result = (
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="#fd790f"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass="h-24 w-24"
      />
    )
  } else {
    result = (
      <img
        src={data.image || data.icon || data.fallback}
        alt=""
        className={imgClass}
        onError={(e) => {
          const target = e.target as HTMLImageElement
          if (target.src !== data.fallback) {
            target.src = data.fallback
          }
        }}
      />
    )
  }

  return (
    <div ref={imgRef} className="aspect-[1/1] shrink-0" aria-hidden="true">
      {result}
    </div>
  )
}

export default PreviewImage

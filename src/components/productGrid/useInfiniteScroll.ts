import { useState, useEffect, useLayoutEffect, useRef } from "react"

// import type Post from "Types/Post"

interface UseInfiniteScrollProps {
  products: any[]
  scrollEdgeRef: React.RefObject<HTMLDivElement>
  maxPostNum: number
  offsetY: number
}

const useInfiniteScroll = ({
  products,
  scrollEdgeRef,
  maxPostNum = 10,
  offsetY = 400,
}: UseInfiniteScrollProps) => {
  const [hasMore, setHasMore] = useState(false)
  const [currentList, setCurrentList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [observerLoading, setObserverLoading] = useState(false)

  const observer = useRef<IntersectionObserver>()

  useLayoutEffect(() => {
    if (!products.length || isLoading) return
    setHasMore(products.length > maxPostNum)
    setCurrentList([...products.slice(0, maxPostNum)])
    setIsLoading(true)
  }, [isLoading, products, maxPostNum])

  useEffect(() => {
    const loadEdges = () => {
      const currentLength = currentList.length
      const more = currentLength < products.length
      const nextEdges = more
        ? products.slice(currentLength, currentLength + maxPostNum)
        : []
      setHasMore(more)
      setCurrentList([...currentList, ...nextEdges])
    }

    const scrollEdgeElem = scrollEdgeRef.current

    const option = {
      rootMargin: `0px 0px ${offsetY}px 0px`,
      threshold: [0],
    }

    observer.current = new IntersectionObserver(entries => {
      if (!hasMore) return
      entries.forEach(entry => {
        if (!observerLoading) {
          setObserverLoading(true)
          return
        }
        if (entry.isIntersecting) loadEdges()
      })
    }, option)

    observer.current.observe(scrollEdgeElem!)

    return () => observer.current && observer.current.disconnect()
  })

  return currentList
}

export default useInfiniteScroll

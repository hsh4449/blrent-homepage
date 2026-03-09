import { useEffect, useRef } from 'react'

export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      const children = ref.current.querySelectorAll('.scroll-animate')
      children.forEach((child) => observer.observe(child))
    }

    return () => observer.disconnect()
  }, [])

  return ref
}

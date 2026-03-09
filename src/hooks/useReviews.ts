import { useMemo } from 'react'
import { reviews as allReviews } from '../data/reviews'

interface ReviewFilters {
  rentType?: 'new' | 'used' | 'monthly'
}

export function useReviews(filters: ReviewFilters = {}) {
  const filtered = useMemo(() => {
    return allReviews.filter((review) => {
      if (filters.rentType && review.rentType !== filters.rentType) {
        return false
      }
      return true
    })
  }, [filters.rentType])

  const averageRating = useMemo(() => {
    if (filtered.length === 0) return 0
    const sum = filtered.reduce((acc, review) => acc + review.rating, 0)
    return Math.round((sum / filtered.length) * 10) / 10
  }, [filtered])

  return {
    reviews: filtered,
    totalCount: filtered.length,
    averageRating,
    loading: false,
  }
}

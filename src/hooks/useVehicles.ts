import { useMemo } from 'react'
import { vehicles as allVehicles } from '../data/vehicles'
import type { Vehicle } from '../types/vehicle'

interface VehicleFilters {
  rentType?: 'new' | 'used' | 'monthly'
  brand?: string
  category?: string
  fuel?: string
  minPayment?: number
  maxPayment?: number
  search?: string
}

export function useVehicles(filters: VehicleFilters = {}) {
  const filtered = useMemo(() => {
    return allVehicles.filter((vehicle) => {
      if (filters.rentType && vehicle.rentType !== filters.rentType) {
        return false
      }

      if (filters.brand && vehicle.brand !== filters.brand) {
        return false
      }

      if (filters.category && vehicle.category !== filters.category) {
        return false
      }

      if (filters.fuel && vehicle.fuel !== filters.fuel) {
        return false
      }

      if (filters.minPayment && vehicle.monthlyPayment < filters.minPayment) {
        return false
      }

      if (filters.maxPayment && vehicle.monthlyPayment > filters.maxPayment) {
        return false
      }

      if (filters.search) {
        const query = filters.search.toLowerCase()
        const searchTarget = `${vehicle.brand} ${vehicle.model} ${vehicle.description}`.toLowerCase()
        if (!searchTarget.includes(query)) {
          return false
        }
      }

      return true
    })
  }, [
    filters.rentType,
    filters.brand,
    filters.category,
    filters.fuel,
    filters.minPayment,
    filters.maxPayment,
    filters.search,
  ])

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(allVehicles.map((v) => v.brand))]
    return uniqueBrands.sort()
  }, [])

  const categories = useMemo(() => {
    return [...new Set(allVehicles.map((v) => v.category))]
  }, [])

  return {
    vehicles: filtered,
    brands,
    categories,
    loading: false,
  }
}

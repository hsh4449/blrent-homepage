import type { Vehicle } from '../types/vehicle'
import { vehicles as defaultVehicles } from '../data/vehicles'

const STORAGE_KEY = 'blrent_vehicles'
const DATA_VERSION = 'v18_kia_gt_ev_consult'
const VERSION_KEY = 'blrent_data_version'
const PROMO_KEY = 'blrent_promos'

export interface PromoVehicle {
  vehicleId: string
  tag: string
}

const DEFAULT_PROMOS: PromoVehicle[] = [
  { vehicleId: 'kia-ray', tag: '경차 인기 1위' },
  { vehicleId: 'kia-k5', tag: '중형 세단 추천' },
]

// Convert static data format (camelCase) to storage format (snake_case) for initial seed
function seedFromDefaults(): StorageVehicle[] {
  return defaultVehicles.map((v) => ({
    id: v.id,
    brand: v.brand,
    model: v.model,
    year: v.year,
    fuel: v.fuel,
    category: v.category,
    rent_type: v.rentType,
    monthly_payment: v.monthlyPayment,
    deposit: v.deposit,
    contract_months: v.contractMonths,
    mileage: v.mileage ?? null,
    image: v.image,
    specs: v.specs,
    options: v.options,
    description: v.description,
    is_popular: v.isPopular,
    created_at: new Date().toISOString(),
  }))
}

export interface StorageVehicle {
  id: string
  brand: string
  model: string
  year: number
  fuel: string
  category: string
  rent_type: string
  monthly_payment: number
  deposit: number
  contract_months: number
  mileage: number | null
  image: string
  specs: {
    engine: string
    transmission: string
    seats: number
    fuelEfficiency: string
  }
  options: string[]
  description: string
  is_popular: boolean
  created_at: string
}

function getAll(): StorageVehicle[] {
  const currentVersion = localStorage.getItem(VERSION_KEY)
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw || currentVersion !== DATA_VERSION) {
    const seeded = seedFromDefaults()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    localStorage.setItem(VERSION_KEY, DATA_VERSION)
    return seeded
  }
  return JSON.parse(raw)
}

function saveAll(vehicles: StorageVehicle[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles))
}

export const vehicleStorage = {
  getAll,

  getById(id: string): StorageVehicle | undefined {
    return getAll().find((v) => v.id === id)
  },

  create(vehicle: Omit<StorageVehicle, 'id' | 'created_at'>): StorageVehicle {
    const all = getAll()
    const newVehicle: StorageVehicle = {
      ...vehicle,
      id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      created_at: new Date().toISOString(),
    }
    all.unshift(newVehicle)
    saveAll(all)
    return newVehicle
  },

  update(id: string, data: Partial<StorageVehicle>): boolean {
    const all = getAll()
    const idx = all.findIndex((v) => v.id === id)
    if (idx === -1) return false
    all[idx] = { ...all[idx], ...data }
    saveAll(all)
    return true
  },

  delete(id: string): boolean {
    const all = getAll()
    const filtered = all.filter((v) => v.id !== id)
    if (filtered.length === all.length) return false
    saveAll(filtered)
    return true
  },

  // Convert to homepage Vehicle format (camelCase)
  toHomepageFormat(v: StorageVehicle): Vehicle {
    return {
      id: v.id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      fuel: v.fuel as Vehicle['fuel'],
      category: v.category as Vehicle['category'],
      rentType: v.rent_type as Vehicle['rentType'],
      monthlyPayment: v.monthly_payment,
      deposit: v.deposit,
      contractMonths: v.contract_months,
      mileage: v.mileage ?? undefined,
      image: v.image,
      specs: v.specs,
      options: v.options,
      description: v.description,
      isPopular: v.is_popular,
    }
  },

  getAllForHomepage(): Vehicle[] {
    return getAll().map((v) => this.toHomepageFormat(v))
  },

  // === 프로모션 관리 ===
  getPromos(): PromoVehicle[] {
    const raw = localStorage.getItem(PROMO_KEY)
    if (!raw) return DEFAULT_PROMOS
    return JSON.parse(raw)
  },

  savePromos(promos: PromoVehicle[]) {
    localStorage.setItem(PROMO_KEY, JSON.stringify(promos))
  },

  getPromosWithVehicles() {
    const promos = this.getPromos()
    const all = getAll()
    return promos
      .map((p) => {
        const v = all.find((vehicle) => vehicle.id === p.vehicleId)
        if (!v) return null
        return { ...p, vehicle: v }
      })
      .filter(Boolean) as (PromoVehicle & { vehicle: StorageVehicle })[]
  },
}

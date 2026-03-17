export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  fuel: string
  category: 'compact' | 'sedan' | 'suv' | 'electric'
  rentType: 'new' | 'used' | 'monthly'
  monthlyPayment: number
  deposit: number
  contractMonths: number
  mileage?: number // 중고차 주행거리
  image: string
  specs: {
    engine: string
    transmission: string
    seats: number
    fuelEfficiency: string
  }
  options: string[]
  description: string
  isPopular: boolean
}

export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  fuel: '가솔린' | '디젤' | '하이브리드' | '전기'
  category: 'sedan' | 'suv' | 'truck' | 'van' | 'sports'
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

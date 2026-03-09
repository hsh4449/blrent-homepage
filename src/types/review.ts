export interface Review {
  id: string
  customerName: string
  vehicleBrand: string
  vehicleModel: string
  rating: number
  content: string
  deliveryDate: string
  image: string
  rentType: 'new' | 'used' | 'monthly'
}

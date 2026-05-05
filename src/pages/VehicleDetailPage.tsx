import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Gauge, Settings, Zap } from 'lucide-react'
import { vehicles } from '../data/vehicles'
import VehicleCard from '../components/vehicle/VehicleCard'

const rentTypeLabel: Record<string, string> = {
  new: '신차 장기렌트',
  used: '중고 장기렌트',
  monthly: '월렌트',
}

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const vehicle = vehicles.find((v) => v.id === id)

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">차량을 찾을 수 없습니다</h1>
          <p className="text-text-secondary mb-6">요청하신 차량 정보가 존재하지 않습니다.</p>
          <Link to="/" className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors">홈으로 돌아가기</Link>
        </div>
      </div>
    )
  }

  // Similar vehicles: 같은 카테고리 + 월 렌트료 ±5만원 이내, 가까운 순 최대 4대
  const PRICE_RANGE = 50000
  const sameCategory = vehicles.filter((v) => v.id !== vehicle.id && v.category === vehicle.category)
  const similarVehicles = vehicle.monthlyPayment > 0
    ? sameCategory
        .filter((v) => v.monthlyPayment > 0 && Math.abs(v.monthlyPayment - vehicle.monthlyPayment) <= PRICE_RANGE)
        .sort((a, b) => Math.abs(a.monthlyPayment - vehicle.monthlyPayment) - Math.abs(b.monthlyPayment - vehicle.monthlyPayment))
        .slice(0, 4)
    : sameCategory.slice(0, 4)

  const specItems = [
    { icon: <Settings size={16} />, label: '엔진', value: vehicle.specs.engine },
    { icon: <Zap size={16} />, label: '변속기', value: vehicle.specs.transmission },
    { icon: <Gauge size={16} />, label: '연비', value: vehicle.specs.fuelEfficiency },
    { icon: <Users size={16} />, label: '승차인원', value: `${vehicle.specs.seats}명` },
  ]

  return (
    <div className="pt-20 md:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Vehicle Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative rounded-2xl overflow-hidden glass">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6">
                <img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-full object-contain" />
              </div>
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-accent/90 backdrop-blur-sm text-white text-sm font-semibold rounded-xl">
                {rentTypeLabel[vehicle.rentType]}
              </span>
              {vehicle.isPopular && (
                <span className="absolute top-4 right-4 px-3 py-1.5 bg-black/30 backdrop-blur-sm text-white text-sm font-medium rounded-xl">인기</span>
              )}
            </div>
          </motion.div>

          {/* Vehicle Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-text-muted text-sm mb-1">{vehicle.brand}</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-6">{vehicle.model}</h1>

            {/* Price card */}
            <div className="glass rounded-2xl p-5 mb-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-text-muted text-xs">월 납입금</span>
                  {vehicle.monthlyPayment > 0 ? (
                    <p className="text-accent font-bold text-2xl md:text-3xl">
                      {(vehicle.monthlyPayment / 10000).toFixed(0)}만원
                      <span className="text-sm font-normal text-text-muted ml-1">/ 월</span>
                    </p>
                  ) : (
                    <p className="text-accent font-bold text-2xl md:text-3xl">상담문의</p>
                  )}
                </div>
                <div className="text-right text-xs text-text-muted">
                  <p>선납금 30%</p>
                  <p>계약기간 {vehicle.contractMonths}개월</p>
                </div>
              </div>
            </div>

            {/* Specs table */}
            <div className="glass rounded-2xl p-5 mb-6">
              <h3 className="font-semibold text-sm mb-4">차량 제원</h3>
              <div className="grid grid-cols-2 gap-4">
                {specItems.map((spec) => (
                  <div key={spec.label} className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">{spec.icon}</span>
                    <div>
                      <span className="text-text-muted text-xs block">{spec.label}</span>
                      <span className="text-sm">{spec.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Similar Vehicles */}
      {similarVehicles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl md:text-2xl font-bold mb-6">이런 차량은 <span className="text-accent">어떠신가요?</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarVehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  )
}

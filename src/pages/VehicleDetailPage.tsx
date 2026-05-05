import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, Calendar, Fuel, Users, Gauge, Settings, Zap } from 'lucide-react'
import { vehicles } from '../data/vehicles'
import VehicleCard from '../components/vehicle/VehicleCard'

const KAKAO_URL = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/'
const PHONE = import.meta.env.VITE_PHONE_NUMBER || '1234-5678'

const rentTypeLabel: Record<string, string> = {
  new: '신차 장기렌트',
  used: '중고 장기렌트',
  monthly: '월렌트',
}

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const vehicle = vehicles.find((v) => v.id === id)

  const [contractMonths, setContractMonths] = useState(48)
  const [depositRate, setDepositRate] = useState(0)
  const [prepayRate, setPrepayRate] = useState(0)

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

  // Price simulator
  const basePayment = vehicle.monthlyPayment
  const monthsMultiplier = contractMonths === 24 ? 1.3 : contractMonths === 36 ? 1.1 : contractMonths === 48 ? 1.0 : 0.95
  const depositDiscount = 1 - (depositRate * 0.08)
  const prepayDiscount = 1 - (prepayRate * 0.06)
  const calculatedPayment = Math.round(basePayment * monthsMultiplier * depositDiscount * prepayDiscount / 1000) * 1000

  // Similar vehicles
  const similarVehicles = vehicles.filter((v) => v.id !== vehicle.id && v.category === vehicle.category).slice(0, 4)

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

            {/* Quick info badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-xs"><Calendar size={12} className="text-accent" /> {vehicle.year}년</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-xs"><Fuel size={12} className="text-accent" /> {vehicle.fuel}</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-xs"><Users size={12} className="text-accent" /> {vehicle.specs.seats}인승</span>
              {vehicle.mileage && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-lg text-xs"><Gauge size={12} className="text-accent" /> {(vehicle.mileage / 10000).toFixed(1)}만km</span>
              )}
            </div>

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
                  <p>보증금 {vehicle.deposit.toLocaleString()}원</p>
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

            {/* Options */}
            <div className="mb-6">
              <h3 className="font-semibold text-sm mb-3">주요 옵션</h3>
              <div className="flex flex-wrap gap-2">
                {vehicle.options.map((option) => (
                  <span key={option} className="px-3 py-1.5 glass rounded-lg text-xs text-text-secondary">{option}</span>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#FEE500] text-[#191919] font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm">
                <MessageCircle size={18} /> 카카오톡 상담
              </a>
              <a href={`tel:${PHONE}`} className="flex-1 flex items-center justify-center gap-2 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors glow-accent text-sm">
                <Phone size={18} /> 전화 상담
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Price Simulator */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-8">월 납입금 <span className="text-gradient">시뮬레이션</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="glass rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-xs text-text-muted mb-3">계약 기간: <span className="text-accent font-semibold">{contractMonths}개월</span></label>
                <div className="flex gap-2">
                  {[24, 36, 48, 60].map((months) => (
                    <button key={months} onClick={() => setContractMonths(months)} className={`flex-1 py-2.5 text-sm rounded-xl transition-all ${contractMonths === months ? 'bg-accent text-white' : 'glass text-text-muted hover:text-gray-900'}`}>
                      {months}개월
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-3">보증금: <span className="text-accent font-semibold">{depositRate * 10}%</span></label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((rate) => (
                    <button key={rate} onClick={() => setDepositRate(rate)} className={`flex-1 py-2.5 text-sm rounded-xl transition-all ${depositRate === rate ? 'bg-accent text-white' : 'glass text-text-muted hover:text-gray-900'}`}>
                      {rate * 10}%
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-3">선납금: <span className="text-accent font-semibold">{prepayRate * 10}%</span></label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((rate) => (
                    <button key={rate} onClick={() => setPrepayRate(rate)} className={`flex-1 py-2.5 text-sm rounded-xl transition-all ${prepayRate === rate ? 'bg-accent text-white' : 'glass text-text-muted hover:text-gray-900'}`}>
                      {rate * 10}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="glass rounded-2xl p-6 flex flex-col justify-center items-center">
              <p className="text-text-muted text-sm mb-2">예상 월 납입금</p>
              {basePayment > 0 ? (
                <p className="text-accent font-bold text-4xl mb-1">
                  {(calculatedPayment / 10000).toFixed(0)}<span className="text-lg font-normal text-text-muted">만원</span>
                </p>
              ) : (
                <p className="text-accent font-bold text-3xl mb-1">상담문의</p>
              )}
              <p className="text-text-muted text-xs mb-6">* 실제 납입금은 심사 결과에 따라 달라질 수 있습니다</p>
              <div className="flex flex-col gap-3 w-full">
                <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-[#FEE500] text-[#191919] font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm">
                  <MessageCircle size={16} /> 카카오톡 상담
                </a>
                <a href={`tel:${PHONE}`} className="flex items-center justify-center gap-2 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors text-sm">
                  <Phone size={16} /> 전화 상담 ({PHONE})
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Similar Vehicles */}
      {similarVehicles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl md:text-2xl font-bold mb-6">유사 <span className="text-gradient">차량 추천</span></h2>
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

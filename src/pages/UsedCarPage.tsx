import { useState } from 'react'
import { motion } from 'framer-motion'
import VehicleCard from '../components/vehicle/VehicleCard'
import VehicleFilter from '../components/vehicle/VehicleFilter'
import { useVehicles } from '../hooks/useVehicles'

export default function UsedCarPage() {
  const [filters, setFilters] = useState({ brand: '', category: '', fuel: '', minPayment: '', maxPayment: '' })
  const { vehicles, brands } = useVehicles({ rentType: 'used', brand: filters.brand || undefined, category: filters.category || undefined, fuel: filters.fuel || undefined })

  return (
    <div className="pt-20 md:pt-24 pb-20">
      {/* Hero */}
      <section className="px-4 sm:px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-accent font-medium mb-4">중고 장기렌트</div>
            <h1 className="text-2xl md:text-4xl font-bold mb-3">검증된 중고차를, <span className="text-gradient">신차 대비 20~40% 절감</span></h1>
            <p className="text-text-secondary text-sm md:text-base max-w-lg">엄선된 우량 중고차를 합리적인 조건으로 장기렌트하세요</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-6">
          <VehicleFilter
            rentType="used"
            filters={filters}
            brands={brands}
            onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
            onReset={() => setFilters({ brand: '', category: '', fuel: '', minPayment: '', maxPayment: '' })}
          />
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((v, i) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                  <VehicleCard vehicle={v} />
                </motion.div>
              ))}
            </div>
            {vehicles.length === 0 && (
              <div className="text-center py-20 text-text-muted">
                <p className="text-lg mb-2">검색 결과가 없습니다</p>
                <p className="text-sm">필터 조건을 변경해보세요</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

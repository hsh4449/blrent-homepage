import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { vehicleStorage } from '../../lib/vehicleStorage'
import type { Vehicle } from '../../types/vehicle'
import VehicleCard from '../vehicle/VehicleCard'
const BRAND_TABS = [
  { key: 'hyundai', label: '현대', brands: ['현대'] },
  { key: 'kia', label: '기아', brands: ['기아'] },
  { key: 'domestic', label: '그외국산', brands: ['제네시스', '쉐보레', '르노', '쌍용', 'KGM'] },
  { key: 'import', label: '수입차', brands: ['BMW', '벤츠', '아우디', '폭스바겐', '볼보', '렉서스', '토요타', '혼다'] },
] as const

type BrandTabKey = typeof BRAND_TABS[number]['key']

export default function PopularVehicles() {
  const [activeTab, setActiveTab] = useState<BrandTabKey>('hyundai')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    setVehicles(vehicleStorage.getAllForHomepage())
  }, [])

  const activeBrands = BRAND_TABS.find((t) => t.key === activeTab)!.brands
  const filtered = vehicles.filter((v) => (activeBrands as readonly string[]).includes(v.brand))

  const CATEGORIES = [
    { key: 'compact', label: '경차' },
    { key: 'sedan', label: '승용' },
    { key: 'suv', label: 'SUV' },
    { key: 'electric', label: '친환경' },
  ] as const

  const groupedByCategory = CATEGORIES.map((cat) => ({
    ...cat,
    vehicles: filtered.filter((v) => v.category === cat.key),
  })).filter((group) => group.vehicles.length > 0)

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-6 md:p-8"
        >
          {/* 차량리스트 헤더 */}
          <h2 className="text-2xl md:text-3xl font-bold mb-6">차량리스트</h2>

          {/* 브랜드 버튼 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {/* 현대 */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('hyundai')}
              className={`flex flex-col items-center gap-3 py-5 px-4 rounded-2xl border transition-all duration-200 ${
                activeTab === 'hyundai'
                  ? 'bg-white/[0.08] border-accent/40'
                  : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
              }`}
            >
              <div className="h-8 flex items-center justify-center">
                <img src="/logos/hyundai.png" alt="현대" className="h-5 object-contain opacity-90" />
              </div>
              <span className={`text-xs font-medium ${activeTab === 'hyundai' ? 'text-white' : 'text-text-muted'}`}>현대자동차</span>
            </motion.button>

            {/* 기아 */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('kia')}
              className={`flex flex-col items-center gap-3 py-5 px-4 rounded-2xl border transition-all duration-200 ${
                activeTab === 'kia'
                  ? 'bg-white/[0.08] border-accent/40'
                  : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
              }`}
            >
              <div className="h-8 flex items-center justify-center">
                <img src="/logos/kia.png" alt="기아" className="h-6 object-contain opacity-90" />
              </div>
              <span className={`text-xs font-medium ${activeTab === 'kia' ? 'text-white' : 'text-text-muted'}`}>기아자동차</span>
            </motion.button>

            {/* 그외국산 (르노 + KGM) */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('domestic')}
              className={`flex flex-col items-center gap-3 py-5 px-4 rounded-2xl border transition-all duration-200 ${
                activeTab === 'domestic'
                  ? 'bg-white/[0.08] border-accent/40'
                  : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
              }`}
            >
              <div className="h-8 flex items-center justify-center gap-3">
                <img src="/logos/renault.png" alt="르노" className="h-7 object-contain opacity-90" />
                <img src="/logos/kgm.png" alt="KGM" className="h-4 object-contain opacity-90" />
              </div>
              <span className={`text-xs font-medium ${activeTab === 'domestic' ? 'text-white' : 'text-text-muted'}`}>르노 & KGM</span>
            </motion.button>

            {/* 수입차 (벤츠 + BMW) */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('import')}
              className={`flex flex-col items-center gap-3 py-5 px-4 rounded-2xl border transition-all duration-200 ${
                activeTab === 'import'
                  ? 'bg-white/[0.08] border-accent/40'
                  : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
              }`}
            >
              <div className="h-10 flex items-center justify-center gap-4">
                <img src="/logos/mercedes.png" alt="벤츠" className="h-10 object-contain" />
                <img src="/logos/bmw.png" alt="BMW" className="h-10 object-contain" />
              </div>
              <span className={`text-xs font-medium ${activeTab === 'import' ? 'text-white' : 'text-text-muted'}`}>수입자동차</span>
            </motion.button>
          </div>

          {/* 카테고리별 차량 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {groupedByCategory.length === 0 && (
                <p className="text-center text-text-muted py-12">등록된 차량이 없습니다.</p>
              )}
              {groupedByCategory.map((group) => (
                <div key={group.key}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-accent rounded-full" />
                    {group.label}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {group.vehicles.map((vehicle, i) => (
                      <motion.div
                        key={vehicle.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <VehicleCard vehicle={vehicle} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

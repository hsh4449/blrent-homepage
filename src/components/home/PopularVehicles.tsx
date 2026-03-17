import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { vehicleStorage } from '../../lib/vehicleStorage'
import type { Vehicle } from '../../types/vehicle'
import VehicleCard from '../vehicle/VehicleCard'
const BRAND_TABS = [
  { key: 'hyundai', label: '현대', brands: ['현대'] },
  { key: 'kia', label: '기아', brands: ['기아'] },
  { key: 'domestic', label: '그외국산', brands: ['쉐보레', '르노', '쌍용', 'KGM'] },
  { key: 'import', label: '수입차 & 제네시스', brands: ['제네시스', 'BMW', '벤츠', '아우디', '폭스바겐', '볼보', '렉서스', '토요타', '혼다'] },
] as const

type BrandTabKey = typeof BRAND_TABS[number]['key']

const CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'compact', label: '경차' },
  { key: 'sedan', label: '승용' },
  { key: 'suv', label: 'SUV' },
  { key: 'electric', label: '친환경' },
] as const

type CategoryKey = typeof CATEGORIES[number]['key']

export default function PopularVehicles() {
  const [activeTab, setActiveTab] = useState<BrandTabKey>('hyundai')
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    setVehicles(vehicleStorage.getAllForHomepage())
  }, [])

  const activeBrands = BRAND_TABS.find((t) => t.key === activeTab)!.brands
  const filtered = vehicles.filter((v) => (activeBrands as readonly string[]).includes(v.brand))
  const displayVehicles = activeCategory === 'all'
    ? filtered
    : filtered.filter((v) => v.category === activeCategory)

  // 브랜드 변경 시 카테고리 초기화
  const handleBrandChange = (tab: BrandTabKey) => {
    setActiveTab(tab)
    setActiveCategory('all')
  }

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm"
        >
          {/* 차량리스트 헤더 */}
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-text-primary">차량리스트</h2>

          {/* 브랜드 버튼 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {/* 현대 */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBrandChange('hyundai')}
              className={`flex flex-col items-center gap-2 pt-3 pb-2 sm:py-5 px-3 sm:px-4 h-24 sm:h-auto rounded-2xl border-2 transition-all duration-200 ${
                activeTab === 'hyundai'
                  ? 'bg-accent/5 border-accent'
                  : 'bg-gray-50 border-amber-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex-1 flex items-center justify-center">
                <img src="/logos/hyundai.png" alt="현대" className="h-6 sm:h-8 object-contain" />
              </div>
              <span className={`text-xs sm:text-sm font-bold ${activeTab === 'hyundai' ? 'text-accent' : 'text-gray-700'}`}>현대자동차</span>
            </motion.button>

            {/* 기아 */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBrandChange('kia')}
              className={`flex flex-col items-center gap-2 pt-3 pb-2 sm:py-5 px-3 sm:px-4 h-24 sm:h-auto rounded-2xl border-2 transition-all duration-200 ${
                activeTab === 'kia'
                  ? 'bg-accent/5 border-accent'
                  : 'bg-gray-50 border-amber-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex-1 flex items-center justify-center">
                <img src="/logos/kia.png" alt="기아" className="h-7 sm:h-9 object-contain" />
              </div>
              <span className={`text-xs sm:text-sm font-bold ${activeTab === 'kia' ? 'text-accent' : 'text-gray-700'}`}>기아자동차</span>
            </motion.button>

            {/* 그외국산 (르노 + KGM) */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBrandChange('domestic')}
              className={`flex flex-col items-center gap-2 pt-3 pb-2 sm:py-5 px-3 sm:px-4 h-24 sm:h-auto rounded-2xl border-2 transition-all duration-200 ${
                activeTab === 'domestic'
                  ? 'bg-accent/5 border-accent'
                  : 'bg-gray-50 border-amber-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2">
                <img src="/logos/renault.png" alt="르노" className="h-6 sm:h-9 object-contain" />
                <img src="/logos/kgm.png" alt="KGM" className="h-4 sm:h-7 object-contain" />
              </div>
              <span className={`text-xs sm:text-sm font-bold ${activeTab === 'domestic' ? 'text-accent' : 'text-gray-700'}`}>르노 & KGM</span>
            </motion.button>

            {/* 수입차 & 제네시스 */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBrandChange('import')}
              className={`flex flex-col items-center gap-2 pt-3 pb-2 sm:py-5 px-3 sm:px-4 h-24 sm:h-auto rounded-2xl border-2 transition-all duration-200 ${
                activeTab === 'import'
                  ? 'bg-accent/5 border-accent'
                  : 'bg-gray-50 border-amber-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex-1 flex items-center justify-center">
                <img src="/logos/import.png" alt="수입차 & 제네시스" className="h-9 sm:h-20 object-contain" />
              </div>
              <span className={`text-xs sm:text-sm font-bold ${activeTab === 'import' ? 'text-accent' : 'text-gray-700'}`}>수입차 & 제네시스</span>
            </motion.button>
          </div>

          {/* 카테고리 탭 */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.key
                    ? 'bg-gradient-to-r from-accent to-amber-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 차량 그리드 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activeCategory}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {displayVehicles.length === 0 ? (
                <p className="text-center text-text-muted py-12">등록된 차량이 없습니다.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {displayVehicles.map((vehicle, i) => (
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
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

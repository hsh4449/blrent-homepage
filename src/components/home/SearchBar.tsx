import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    rentType: '',
    brand: '',
    category: '',
    priceRange: '',
  })

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.brand) params.set('brand', filters.brand)
    if (filters.category) params.set('category', filters.category)
    if (filters.priceRange) params.set('price', filters.priceRange)

    const path = filters.rentType === 'used' ? '/used-car' : filters.rentType === 'monthly' ? '/monthly' : '/new-car'
    navigate(`${path}?${params.toString()}`)
  }

  const selectClass = "w-full bg-white/5 border border-white/[0.08] text-sm rounded-xl px-4 py-3.5 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all appearance-none cursor-pointer text-text-primary"

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20"
    >
      <div className="glass rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-5">차량 검색</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs text-text-muted mb-2 font-medium">렌트 유형</label>
            <select className={selectClass} value={filters.rentType} onChange={(e) => handleChange('rentType', e.target.value)}>
              <option value="">전체</option>
              <option value="new">신차 장기렌트</option>
              <option value="used">중고 장기렌트</option>
              <option value="monthly">월렌트</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-2 font-medium">브랜드</label>
            <select className={selectClass} value={filters.brand} onChange={(e) => handleChange('brand', e.target.value)}>
              <option value="">전체 브랜드</option>
              <option value="현대">현대</option>
              <option value="기아">기아</option>
              <option value="제네시스">제네시스</option>
              <option value="BMW">BMW</option>
              <option value="벤츠">벤츠</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-2 font-medium">차종</label>
            <select className={selectClass} value={filters.category} onChange={(e) => handleChange('category', e.target.value)}>
              <option value="">전체 차종</option>
              <option value="sedan">세단</option>
              <option value="suv">SUV</option>
              <option value="van">승합</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-2 font-medium">월 납입금</label>
            <select className={selectClass} value={filters.priceRange} onChange={(e) => handleChange('priceRange', e.target.value)}>
              <option value="">전체 가격</option>
              <option value="0-300000">30만원 이하</option>
              <option value="300000-500000">30~50만원</option>
              <option value="500000-800000">50~80만원</option>
              <option value="800000-">80만원 이상</option>
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all text-sm"
          >
            <Search size={18} />
            검색하기
          </motion.button>
        </div>
      </div>
    </motion.section>
  )
}

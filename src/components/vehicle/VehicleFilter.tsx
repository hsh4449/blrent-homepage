import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'

interface FilterProps {
  rentType: 'new' | 'used' | 'monthly'
  filters: {
    brand: string
    category: string
    fuel: string
    minPayment: string
    maxPayment: string
  }
  brands: string[]
  onChange: (key: string, value: string) => void
  onReset: () => void
}

export default function VehicleFilter({ rentType, filters, brands, onChange, onReset }: FilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const selectClass = "w-full bg-white border border-gray-200 text-sm rounded-xl px-4 py-3 outline-none focus:border-accent/50 transition-all"

  const FilterContent = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-xs text-text-muted mb-2 font-medium">브랜드</label>
        <select className={selectClass} value={filters.brand} onChange={(e) => onChange('brand', e.target.value)}>
          <option value="">전체</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-text-muted mb-2 font-medium">차종</label>
        <select className={selectClass} value={filters.category} onChange={(e) => onChange('category', e.target.value)}>
          <option value="">전체</option>
          <option value="compact">경차</option>
          <option value="sedan">세단</option>
          <option value="suv">SUV</option>
          <option value="electric">전기차</option>
          <option value="sports">스포츠카</option>
          <option value="luxury">럭셔리</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-text-muted mb-2 font-medium">연료</label>
        <select className={selectClass} value={filters.fuel} onChange={(e) => onChange('fuel', e.target.value)}>
          <option value="">전체</option>
          <option value="가솔린">가솔린</option>
          <option value="디젤">디젤</option>
          <option value="하이브리드">하이브리드</option>
          <option value="전기">전기</option>
          <option value="수소전기">수소전기</option>
        </select>
      </div>
      {rentType === 'used' && (
        <div>
          <label className="block text-xs text-text-muted mb-2 font-medium">연식</label>
          <select className={selectClass}><option>전체</option><option>2024</option><option>2023</option><option>2022</option></select>
        </div>
      )}
      <button onClick={onReset} className="w-full py-2.5 text-sm text-text-muted hover:text-gray-900 glass rounded-xl transition-all">필터 초기화</button>
    </div>
  )

  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-sm font-medium mb-4"
      >
        <SlidersHorizontal size={16} /> 필터
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-60 flex-shrink-0">
        <div className="glass rounded-2xl p-5 sticky top-24">
          <h3 className="font-semibold text-sm mb-5">필터</h3>
          <FilterContent />
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto border-t border-gray-200"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold">필터</h3>
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>
            <FilterContent />
            <button onClick={() => setMobileOpen(false)} className="w-full mt-4 py-3 bg-accent text-white rounded-xl font-semibold text-sm">적용하기</button>
          </motion.div>
        </div>
      )}
    </>
  )
}

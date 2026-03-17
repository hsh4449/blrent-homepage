import { useState } from 'react'
import { motion } from 'framer-motion'
import ReviewCard from '../components/review/ReviewCard'
import { useReviews } from '../hooks/useReviews'

export default function ReviewsPage() {
  const [filter, setFilter] = useState<'all' | 'new' | 'used' | 'monthly'>('all')
  const { reviews } = useReviews(filter === 'all' ? {} : { rentType: filter })
  const tabs = [
    { key: 'all', label: '전체' },
    { key: 'new', label: '신차' },
    { key: 'used', label: '중고' },
    { key: 'monthly', label: '월렌트' },
  ] as const

  return (
    <div className="pt-20 md:pt-24 pb-20">
      <section className="px-4 sm:px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl md:text-4xl font-bold mb-3">출고 후기</h1>
            <p className="text-text-secondary text-sm md:text-base">BL렌트카를 통해 차량을 출고하신 고객님들의 생생한 후기입니다</p>
          </motion.div>
          <div className="flex gap-1 mt-8 p-1 rounded-xl bg-gray-50 w-fit">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setFilter(tab.key)} className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${filter === tab.key ? 'bg-accent text-white' : 'text-text-muted hover:text-gray-900'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ReviewCard review={r} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

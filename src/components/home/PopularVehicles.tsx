import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { vehicles } from '../../data/vehicles'
import VehicleCard from '../vehicle/VehicleCard'

const TABS = [
  { key: 'new', label: '신차장기' },
  { key: 'used', label: '중고장기' },
  { key: 'monthly', label: '월렌트' },
] as const

export default function PopularVehicles() {
  const [activeTab, setActiveTab] = useState<'new' | 'used' | 'monthly'>('new')
  const filtered = vehicles.filter((v) => v.rentType === activeTab).slice(0, 8)

  return (
    <section className="py-20 md:py-28 bg-bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold">인기 차량</h2>
          <div className="flex gap-1 p-1 rounded-xl bg-white/5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.key ? 'text-white' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-accent rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {filtered.map((vehicle, i) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <VehicleCard vehicle={vehicle} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

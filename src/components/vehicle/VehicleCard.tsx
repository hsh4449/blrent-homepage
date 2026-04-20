import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import type { Vehicle } from '../../types/vehicle'

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const isConsultOnly = vehicle.monthlyPayment <= 0
  const priceLabel = isConsultOnly ? '상담문의' : `월 ${vehicle.monthlyPayment.toLocaleString()}원~`

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/vehicle/${vehicle.id}`}
        className="block bg-white rounded-2xl overflow-hidden group border-2 border-gray-200 shadow-sm hover:border-accent hover:shadow-lg hover:shadow-accent/10 transition-all duration-300"
      >
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-white p-3">
            <img
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="px-2 py-2 bg-gradient-to-r from-accent to-amber-500 text-center">
            <p className="text-white font-bold text-sm truncate">{vehicle.model}</p>
            <p className="text-white font-bold text-xs">{priceLabel}</p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-amber-50/30">
            <img
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              loading="lazy"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-5 py-2.5 bg-accent rounded-xl text-white text-sm font-semibold">
                <MessageCircle size={16} />
                상담하기
              </span>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-b from-accent to-amber-600">
            <h3 className="font-extrabold text-lg mb-3 text-white">{vehicle.model}</h3>
            <div>
              <span className="text-white font-bold text-lg">{priceLabel}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

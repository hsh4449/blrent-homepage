import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Fuel, Calendar, Gauge } from 'lucide-react'
import type { Vehicle } from '../../types/vehicle'

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/vehicle/${vehicle.id}`}
        className="block glass rounded-2xl overflow-hidden group hover:border-accent/20 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-bg-sub">
          <img
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-5 py-2.5 bg-accent rounded-xl text-white text-sm font-semibold">
              <MessageCircle size={16} />
              상담하기
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1">{vehicle.model}</h3>
          <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
            <span className="flex items-center gap-1"><Calendar size={12} /> {vehicle.year}년</span>
            <span className="flex items-center gap-1"><Fuel size={12} /> {vehicle.fuel}</span>
            {vehicle.mileage && <span className="flex items-center gap-1"><Gauge size={12} /> {(vehicle.mileage / 10000).toFixed(1)}만km</span>}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-accent font-bold text-lg">{(vehicle.monthlyPayment / 10000).toFixed(0)}만원</span>
              <span className="text-text-muted text-xs ml-1">/ 월</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

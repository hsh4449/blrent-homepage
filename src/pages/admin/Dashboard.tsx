import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { vehicleStorage, type StorageVehicle } from '../../lib/vehicleStorage'

interface Stats {
  totalVehicles: number
  newRent: number
  usedRent: number
  monthlyRent: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalVehicles: 0,
    newRent: 0,
    usedRent: 0,
    monthlyRent: 0,
  })
  const [recentVehicles, setRecentVehicles] = useState<StorageVehicle[]>([])

  useEffect(() => {
    const vehicles = vehicleStorage.getAll()

    setStats({
      totalVehicles: vehicles.length,
      newRent: vehicles.filter((v) => v.rent_type === 'new').length,
      usedRent: vehicles.filter((v) => v.rent_type === 'used').length,
      monthlyRent: vehicles.filter((v) => v.rent_type === 'monthly').length,
    })

    setRecentVehicles(vehicles.slice(0, 5))
  }, [])

  const statCards = [
    { label: '총 등록 차량', value: stats.totalVehicles, icon: Car, color: '#FF9D42' },
    { label: '신차 장기렌트', value: stats.newRent, icon: TrendingUp, color: '#38BDF8' },
    { label: '중고 장기렌트', value: stats.usedRent, icon: Car, color: '#A78BFA' },
    { label: '월렌트', value: stats.monthlyRent, icon: Clock, color: '#34D399' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-500 mt-1">비엘모빌리티 홈페이지 현황을 한눈에 확인하세요.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <motion.div
              key={card.label}
              variants={itemVariants}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <card.icon size={20} style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{card.value}</p>
              <p className="text-gray-500 text-sm mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Vehicles */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-gray-200 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">최근 등록 차량</h2>
            <Link
              to="/admin/vehicles"
              className="flex items-center gap-1 text-[#FF9D42] text-sm hover:underline"
            >
              전체보기 <ArrowRight size={14} />
            </Link>
          </div>

          {recentVehicles.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">등록된 차량이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {recentVehicles.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  {v.image ? (
                    <img
                      src={v.image}
                      alt={`${v.brand} ${v.model}`}
                      className="w-14 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Car size={16} className="text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-900 text-sm font-medium truncate">
                      {v.brand} {v.model}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {v.year}년 &middot; 월 {v.monthly_payment?.toLocaleString()}원
                    </p>
                  </div>
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    {v.rent_type === 'new'
                      ? '신차'
                      : v.rent_type === 'used'
                        ? '중고'
                        : '월렌트'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/vehicles"
            className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-sm transition-shadow group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF9D42]/10 flex items-center justify-center">
                <Car size={20} className="text-[#FF9D42]" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">차량 관리</p>
                <p className="text-gray-400 text-sm">차량 등록, 수정, 삭제</p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-gray-400 group-hover:text-[#FF9D42] transition-colors"
            />
          </Link>

          <Link
            to="/admin/consultations"
            className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-sm transition-shadow group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF9D42]/10 flex items-center justify-center">
                <Users size={20} className="text-[#FF9D42]" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">상담 관리</p>
                <p className="text-gray-400 text-sm">상담 요청 확인, 상태 변경</p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-gray-400 group-hover:text-[#FF9D42] transition-colors"
            />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

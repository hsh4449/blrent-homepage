import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Link } from 'react-router-dom'
import { Car, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  fuel: string
  category: string
  rent_type: string
  monthly_payment: number
  deposit: number
  contract_months: number
  mileage: number
  image: string
  is_popular: boolean
  created_at: string
}

interface Consultation {
  id: string
  name: string
  phone: string
  car: string
  message: string
  status: 'pending' | 'contacted' | 'completed' | 'cancelled'
  memo: string
  created_at: string
}

interface Stats {
  totalVehicles: number
  newRent: number
  usedRent: number
  monthlyRent: number
  totalConsultations: number
  pendingConsultations: number
}

const statusLabels: Record<string, string> = {
  pending: '대기중',
  contacted: '연락완료',
  completed: '완료',
  cancelled: '취소',
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  contacted: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
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
    totalConsultations: 0,
    pendingConsultations: 0,
  })
  const [recentConsultations, setRecentConsultations] = useState<Consultation[]>([])
  const [recentVehicles, setRecentVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      setError(null)

      const [
        { data: vehicles, error: vehiclesError },
        { data: consultations, error: consultationsError },
        { data: recentVehiclesData, error: recentVehiclesError },
        { data: recentConsultationsData, error: recentConsultationsError },
      ] = await Promise.all([
        supabase.from('homepage_vehicles').select('rent_type'),
        supabase.from('consultations').select('status'),
        supabase
          .from('homepage_vehicles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('consultations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      if (vehiclesError) throw vehiclesError
      if (consultationsError) throw consultationsError
      if (recentVehiclesError) throw recentVehiclesError
      if (recentConsultationsError) throw recentConsultationsError

      const vehiclesList = vehicles || []
      const consultationsList = consultations || []

      setStats({
        totalVehicles: vehiclesList.length,
        newRent: vehiclesList.filter((v) => v.rent_type === 'new').length,
        usedRent: vehiclesList.filter((v) => v.rent_type === 'used').length,
        monthlyRent: vehiclesList.filter((v) => v.rent_type === 'monthly').length,
        totalConsultations: consultationsList.length,
        pendingConsultations: consultationsList.filter((c) => c.status === 'pending').length,
      })

      setRecentVehicles((recentVehiclesData as Vehicle[]) || [])
      setRecentConsultations((recentConsultationsData as Consultation[]) || [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.'
      setError(message)
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: '총 등록 차량', value: stats.totalVehicles, icon: Car, color: '#FF9D42' },
    { label: '신차 장기렌트', value: stats.newRent, icon: TrendingUp, color: '#38BDF8' },
    { label: '중고 장기렌트', value: stats.usedRent, icon: Car, color: '#A78BFA' },
    { label: '월렌트', value: stats.monthlyRent, icon: Clock, color: '#34D399' },
    { label: '전체 상담', value: stats.totalConsultations, icon: Users, color: '#FB7185' },
    { label: '대기중 상담', value: stats.pendingConsultations, icon: Clock, color: '#FBBF24' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#FF9D42] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#94A3B8] text-sm">대시보드를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-4">
        <div className="backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-[#FF9D42] text-black font-medium rounded-lg hover:bg-[#FF9D42]/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] p-6 md:p-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl md:text-3xl font-bold text-white">관리자 대시보드</h1>
          <p className="text-[#94A3B8] mt-1">BL렌트 홈페이지 현황을 한눈에 확인하세요.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <motion.div
              key={card.label}
              variants={itemVariants}
              className="backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.08] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  <card.icon size={20} style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{card.value}</p>
              <p className="text-[#94A3B8] text-sm mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Consultations */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">최근 상담 요청</h2>
              <Link
                to="/admin/consultations"
                className="flex items-center gap-1 text-[#FF9D42] text-sm hover:underline"
              >
                전체보기 <ArrowRight size={14} />
              </Link>
            </div>

            {recentConsultations.length === 0 ? (
              <p className="text-[#475569] text-sm text-center py-8">등록된 상담이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {recentConsultations.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">{c.name}</p>
                      <p className="text-[#475569] text-xs mt-0.5 truncate">
                        {c.car || '차종 미지정'} &middot;{' '}
                        {new Date(c.created_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ml-3 ${statusColors[c.status] || 'bg-gray-500/20 text-gray-400'}`}
                    >
                      {statusLabels[c.status] || c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Vehicles */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">최근 등록 차량</h2>
              <Link
                to="/admin/vehicles"
                className="flex items-center gap-1 text-[#FF9D42] text-sm hover:underline"
              >
                전체보기 <ArrowRight size={14} />
              </Link>
            </div>

            {recentVehicles.length === 0 ? (
              <p className="text-[#475569] text-sm text-center py-8">등록된 차량이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {recentVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                  >
                    {v.image ? (
                      <img
                        src={v.image}
                        alt={`${v.brand} ${v.model}`}
                        className="w-14 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                        <Car size={16} className="text-[#475569]" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">
                        {v.brand} {v.model}
                      </p>
                      <p className="text-[#475569] text-xs mt-0.5">
                        {v.year}년 &middot; 월 {v.monthly_payment?.toLocaleString()}원
                      </p>
                    </div>
                    <span className="text-[#94A3B8] text-xs whitespace-nowrap">
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
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/vehicles"
            className="flex items-center justify-between p-5 backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl hover:bg-white/[0.08] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF9D42]/20 flex items-center justify-center">
                <Car size={20} className="text-[#FF9D42]" />
              </div>
              <div>
                <p className="text-white font-medium">차량 관리</p>
                <p className="text-[#475569] text-sm">차량 등록, 수정, 삭제</p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-[#475569] group-hover:text-[#FF9D42] transition-colors"
            />
          </Link>

          <Link
            to="/admin/consultations"
            className="flex items-center justify-between p-5 backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl hover:bg-white/[0.08] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF9D42]/20 flex items-center justify-center">
                <Users size={20} className="text-[#FF9D42]" />
              </div>
              <div>
                <p className="text-white font-medium">상담 관리</p>
                <p className="text-[#475569] text-sm">상담 요청 확인, 상태 변경</p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-[#475569] group-hover:text-[#FF9D42] transition-colors"
            />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageSquare, Clock, CheckCircle, XCircle, StickyNote, ChevronDown, RefreshCw, Loader2, Search, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

type ConsultationStatus = 'pending' | 'contacted' | 'completed' | 'cancelled'

interface Consultation {
  id: string
  name: string
  phone: string
  car: string | null
  message: string | null
  status: ConsultationStatus
  memo: string | null
  created_at: string
}

const STATUS_CONFIG: Record<ConsultationStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  pending: {
    label: '대기중',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10 border-yellow-400/20',
    icon: <Clock size={14} />,
  },
  contacted: {
    label: '연락완료',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10 border-blue-400/20',
    icon: <Phone size={14} />,
  },
  completed: {
    label: '완료',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10 border-green-400/20',
    icon: <CheckCircle size={14} />,
  },
  cancelled: {
    label: '취소',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10 border-red-400/20',
    icon: <XCircle size={14} />,
  },
}

const STATUS_OPTIONS: (ConsultationStatus | 'all')[] = ['all', 'pending', 'contacted', 'completed', 'cancelled']
const STATUS_LABELS: Record<string, string> = {
  all: '전체',
  pending: '대기중',
  contacted: '연락완료',
  completed: '완료',
  cancelled: '취소',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}.${month}.${day} ${hours}:${minutes}`
}

function formatPhone(phone: string) {
  const cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export default function ConsultationManagement() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ConsultationStatus | 'all'>('all')
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({ all: 0, pending: 0, contacted: 0, completed: 0, cancelled: 0 })
  const [editingMemo, setEditingMemo] = useState<string | null>(null)
  const [memoValue, setMemoValue] = useState('')
  const [savingMemo, setSavingMemo] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchConsultations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      const items = (data || []) as Consultation[]
      setConsultations(items)

      const counts: Record<string, number> = { all: items.length, pending: 0, contacted: 0, completed: 0, cancelled: 0 }
      items.forEach((item) => {
        if (counts[item.status] !== undefined) counts[item.status]++
      })
      setStatusCounts(counts)
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConsultations()
  }, [fetchConsultations])

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('consultations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'consultations' }, () => {
        fetchConsultations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchConsultations])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = () => setOpenDropdown(null)
    if (openDropdown) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [openDropdown])

  const handleStatusChange = async (id: string, newStatus: ConsultationStatus) => {
    setUpdatingStatus(id)
    setOpenDropdown(null)
    try {
      const { error: updateError } = await supabase
        .from('consultations')
        .update({ status: newStatus })
        .eq('id', id)

      if (updateError) throw updateError

      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      )
      setStatusCounts((prev) => {
        const old = consultations.find((c) => c.id === id)
        if (!old) return prev
        return {
          ...prev,
          [old.status]: prev[old.status] - 1,
          [newStatus]: prev[newStatus] + 1,
        }
      })
    } catch {
      setError('상태 변경 중 오류가 발생했습니다.')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleMemoSave = async (id: string) => {
    setSavingMemo(true)
    try {
      const { error: updateError } = await supabase
        .from('consultations')
        .update({ memo: memoValue || null })
        .eq('id', id)

      if (updateError) throw updateError

      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, memo: memoValue || null } : c))
      )
      setEditingMemo(null)
    } catch {
      setError('메모 저장 중 오류가 발생했습니다.')
    } finally {
      setSavingMemo(false)
    }
  }

  const startMemoEdit = (consultation: Consultation) => {
    setEditingMemo(consultation.id)
    setMemoValue(consultation.memo || '')
  }

  const filtered = consultations.filter((c) => {
    const matchesTab = activeTab === 'all' || c.status === activeTab
    const matchesSearch = !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.car && c.car.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTab && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">상담 <span className="text-[#FF9D42]">관리</span></h1>
            <p className="text-[#94A3B8] text-sm mt-1">고객 상담 요청을 관리합니다.</p>
          </div>
          <button
            onClick={fetchConsultations}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/[0.08] hover:bg-white/10 transition-colors text-sm disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            새로고침
          </button>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
            <input
              type="text"
              placeholder="이름, 전화번호, 차량으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-white transition-colors">
                <X size={16} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Status Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === status
                  ? 'bg-[#FF9D42]/10 text-[#FF9D42] border border-[#FF9D42]/30'
                  : 'bg-white/5 border border-white/[0.08] text-[#94A3B8] hover:bg-white/10 hover:text-white'
              }`}
            >
              {STATUS_LABELS[status]}
              <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                activeTab === status ? 'bg-[#FF9D42]/20 text-[#FF9D42]' : 'bg-white/10 text-[#94A3B8]'
              }`}>
                {statusCounts[status] || 0}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between"
            >
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-4 hover:text-red-300 transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#FF9D42]" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <MessageSquare size={48} className="mx-auto mb-4 text-[#475569]" />
            <p className="text-[#94A3B8] text-lg font-medium mb-2">
              {searchQuery ? '검색 결과가 없습니다.' : '상담 요청이 없습니다.'}
            </p>
            <p className="text-[#475569] text-sm">
              {searchQuery ? '다른 검색어를 입력해보세요.' : '새로운 상담 요청이 들어오면 여기에 표시됩니다.'}
            </p>
          </motion.div>
        )}

        {/* Desktop Table */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="hidden lg:block">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/[0.08] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">고객정보</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">차량</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">메시지</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">상태</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">메모</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">접수일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filtered.map((item, idx) => {
                        const statusConf = STATUS_CONFIG[item.status]
                        return (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                          >
                            {/* Customer Info */}
                            <td className="px-6 py-4">
                              <div className="font-medium text-sm">{item.name}</div>
                              <a
                                href={`tel:${item.phone}`}
                                className="flex items-center gap-1 text-[#FF9D42] text-xs hover:text-[#FFB370] transition-colors mt-1"
                              >
                                <Phone size={12} />
                                {formatPhone(item.phone)}
                              </a>
                            </td>
                            {/* Car */}
                            <td className="px-6 py-4 text-sm text-[#94A3B8]">
                              {item.car || <span className="text-[#475569]">-</span>}
                            </td>
                            {/* Message */}
                            <td className="px-6 py-4">
                              <div className="text-sm text-[#94A3B8] max-w-[200px] truncate" title={item.message || ''}>
                                {item.message || <span className="text-[#475569]">-</span>}
                              </div>
                            </td>
                            {/* Status */}
                            <td className="px-6 py-4">
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setOpenDropdown(openDropdown === item.id ? null : item.id)
                                  }}
                                  disabled={updatingStatus === item.id}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${statusConf.bgColor} ${statusConf.color}`}
                                >
                                  {updatingStatus === item.id ? (
                                    <Loader2 size={12} className="animate-spin" />
                                  ) : (
                                    statusConf.icon
                                  )}
                                  {statusConf.label}
                                  <ChevronDown size={12} />
                                </button>
                                {openDropdown === item.id && (
                                  <div className="absolute z-50 top-full left-0 mt-1 w-36 rounded-xl bg-[#1a1a1b] border border-white/[0.08] shadow-xl overflow-hidden">
                                    {(['pending', 'contacted', 'completed', 'cancelled'] as ConsultationStatus[]).map((s) => {
                                      const conf = STATUS_CONFIG[s]
                                      return (
                                        <button
                                          key={s}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleStatusChange(item.id, s)
                                          }}
                                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-white/5 transition-colors ${
                                            item.status === s ? conf.color + ' font-semibold' : 'text-[#94A3B8]'
                                          }`}
                                        >
                                          {conf.icon}
                                          {conf.label}
                                        </button>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            </td>
                            {/* Memo */}
                            <td className="px-6 py-4">
                              {editingMemo === item.id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={memoValue}
                                    onChange={(e) => setMemoValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleMemoSave(item.id)}
                                    placeholder="메모 입력..."
                                    autoFocus
                                    className="w-40 px-3 py-1.5 rounded-lg bg-white/5 border border-white/[0.08] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50"
                                  />
                                  <button
                                    onClick={() => handleMemoSave(item.id)}
                                    disabled={savingMemo}
                                    className="text-[#FF9D42] hover:text-[#FFB370] transition-colors"
                                  >
                                    {savingMemo ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                  </button>
                                  <button
                                    onClick={() => setEditingMemo(null)}
                                    className="text-[#475569] hover:text-white transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startMemoEdit(item)}
                                  className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors group"
                                >
                                  <StickyNote size={12} className="text-[#475569] group-hover:text-[#FF9D42] transition-colors" />
                                  <span className="max-w-[150px] truncate">{item.memo || '메모 추가...'}</span>
                                </button>
                              )}
                            </td>
                            {/* Date */}
                            <td className="px-6 py-4 text-xs text-[#475569] whitespace-nowrap">
                              {formatDate(item.created_at)}
                            </td>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              <AnimatePresence>
                {filtered.map((item, idx) => {
                  const statusConf = STATUS_CONFIG[item.status]
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: idx * 0.03 }}
                      className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/[0.08] p-4 space-y-3"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <a
                            href={`tel:${item.phone}`}
                            className="flex items-center gap-1 text-[#FF9D42] text-xs hover:text-[#FFB370] transition-colors mt-1"
                          >
                            <Phone size={12} />
                            {formatPhone(item.phone)}
                          </a>
                        </div>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenDropdown(openDropdown === item.id ? null : item.id)
                            }}
                            disabled={updatingStatus === item.id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${statusConf.bgColor} ${statusConf.color}`}
                          >
                            {updatingStatus === item.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              statusConf.icon
                            )}
                            {statusConf.label}
                            <ChevronDown size={12} />
                          </button>
                          {openDropdown === item.id && (
                            <div className="absolute z-50 top-full right-0 mt-1 w-36 rounded-xl bg-[#1a1a1b] border border-white/[0.08] shadow-xl overflow-hidden">
                              {(['pending', 'contacted', 'completed', 'cancelled'] as ConsultationStatus[]).map((s) => {
                                const conf = STATUS_CONFIG[s]
                                return (
                                  <button
                                    key={s}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleStatusChange(item.id, s)
                                    }}
                                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-white/5 transition-colors ${
                                      item.status === s ? conf.color + ' font-semibold' : 'text-[#94A3B8]'
                                    }`}
                                  >
                                    {conf.icon}
                                    {conf.label}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Car */}
                      {item.car && (
                        <div className="text-xs text-[#94A3B8]">
                          <span className="text-[#475569]">차량:</span> {item.car}
                        </div>
                      )}

                      {/* Message */}
                      {item.message && (
                        <div className="flex items-start gap-2">
                          <MessageSquare size={14} className="text-[#475569] mt-0.5 shrink-0" />
                          <p className="text-xs text-[#94A3B8] line-clamp-3">{item.message}</p>
                        </div>
                      )}

                      {/* Memo */}
                      <div className="pt-2 border-t border-white/[0.04]">
                        {editingMemo === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={memoValue}
                              onChange={(e) => setMemoValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleMemoSave(item.id)}
                              placeholder="메모 입력..."
                              autoFocus
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/[0.08] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50"
                            />
                            <button
                              onClick={() => handleMemoSave(item.id)}
                              disabled={savingMemo}
                              className="text-[#FF9D42] hover:text-[#FFB370] transition-colors"
                            >
                              {savingMemo ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                            </button>
                            <button
                              onClick={() => setEditingMemo(null)}
                              className="text-[#475569] hover:text-white transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startMemoEdit(item)}
                            className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors group"
                          >
                            <StickyNote size={12} className="text-[#475569] group-hover:text-[#FF9D42] transition-colors" />
                            <span>{item.memo || '메모 추가...'}</span>
                          </button>
                        )}
                      </div>

                      {/* Date */}
                      <div className="text-[10px] text-[#475569]">
                        {formatDate(item.created_at)}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Result count */}
            <div className="mt-4 text-xs text-[#475569] text-center">
              총 {filtered.length}건
            </div>
          </>
        )}
      </div>
    </div>
  )
}

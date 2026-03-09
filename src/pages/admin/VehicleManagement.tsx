import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Search,
  Upload,
  X,
  Save,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

/* ─── Types ──────────────────────────────────────────── */

type Fuel = '가솔린' | '디젤' | '하이브리드' | '전기'
type Category = 'sedan' | 'suv' | 'truck' | 'van' | 'sports'
type RentType = 'new' | 'used' | 'monthly'

interface Specs {
  engine: string
  transmission: string
  seats: number
  fuelEfficiency: string
}

interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  fuel: Fuel
  category: Category
  rent_type: RentType
  monthly_payment: number
  deposit: number
  contract_months: number
  mileage: number | null
  image: string
  specs: Specs
  options: string[]
  description: string
  is_popular: boolean
  created_at: string
}

type VehicleInsert = Omit<Vehicle, 'id' | 'created_at'>

const emptyForm: VehicleInsert = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  fuel: '가솔린',
  category: 'sedan',
  rent_type: 'new',
  monthly_payment: 0,
  deposit: 0,
  contract_months: 48,
  mileage: null,
  image: '',
  specs: { engine: '', transmission: '', seats: 5, fuelEfficiency: '' },
  options: [],
  description: '',
  is_popular: false,
}

const FUEL_OPTIONS: Fuel[] = ['가솔린', '디젤', '하이브리드', '전기']
const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'sedan', label: '세단' },
  { value: 'suv', label: 'SUV' },
  { value: 'truck', label: '트럭' },
  { value: 'van', label: '밴' },
  { value: 'sports', label: '스포츠' },
]
const RENT_TYPE_OPTIONS: { value: RentType; label: string }[] = [
  { value: 'new', label: '신차' },
  { value: 'used', label: '중고' },
  { value: 'monthly', label: '월렌트' },
]

const rentTypeLabel: Record<RentType, string> = {
  new: '신차',
  used: '중고',
  monthly: '월렌트',
}

/* ─── Helpers ────────────────────────────────────────── */

function formatNumber(n: number) {
  return n.toLocaleString('ko-KR')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/* ─── Component ──────────────────────────────────────── */

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<VehicleInsert>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // image upload
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // delete
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null)
  const [deleting, setDeleting] = useState(false)

  // search / filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRentType, setFilterRentType] = useState<RentType | ''>('')

  /* ─── Fetch ───────────────────────────────────────── */

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('homepage_vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (err) {
      setError('차량 목록을 불러오는데 실패했습니다.')
      console.error(err)
    } else {
      setVehicles(data as Vehicle[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  /* ─── Filtered list ───────────────────────────────── */

  const filtered = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q || v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
    const matchesRent = !filterRentType || v.rent_type === filterRentType
    return matchesSearch && matchesRent
  })

  /* ─── Toggle popular ──────────────────────────────── */

  const togglePopular = async (vehicle: Vehicle) => {
    const newVal = !vehicle.is_popular
    // optimistic
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicle.id ? { ...v, is_popular: newVal } : v)),
    )

    const { error: err } = await supabase
      .from('homepage_vehicles')
      .update({ is_popular: newVal })
      .eq('id', vehicle.id)

    if (err) {
      // revert
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicle.id ? { ...v, is_popular: !newVal } : v,
        ),
      )
      setError('인기 상태 변경에 실패했습니다.')
    }
  }

  /* ─── Image upload ────────────────────────────────── */

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('이미지 파일만 업로드 가능합니다.')
      return
    }

    setUploading(true)
    setFormError(null)

    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filePath = `vehicles/${fileName}`

    const { error: uploadErr } = await supabase.storage
      .from('vehicle-images')
      .upload(filePath, file)

    if (uploadErr) {
      setFormError('이미지 업로드에 실패했습니다.')
      console.error(uploadErr)
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('vehicle-images').getPublicUrl(filePath)

    setForm((prev) => ({ ...prev, image: publicUrl }))
    setImagePreview(publicUrl)
    setUploading(false)
  }

  /* ─── Modal open helpers ──────────────────────────── */

  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setImagePreview(null)
    setFormError(null)
    setModalOpen(true)
  }

  const openEditModal = (vehicle: Vehicle) => {
    setEditingId(vehicle.id)
    const { id, created_at, ...rest } = vehicle
    setForm(rest)
    setImagePreview(vehicle.image || null)
    setFormError(null)
    setModalOpen(true)
  }

  /* ─── Validation ──────────────────────────────────── */

  const validate = (): string | null => {
    if (!form.brand.trim()) return '브랜드를 입력하세요.'
    if (!form.model.trim()) return '모델명을 입력하세요.'
    if (form.year < 1990 || form.year > 2030) return '연식이 올바르지 않습니다.'
    if (form.monthly_payment <= 0) return '월 납입금을 입력하세요.'
    if (form.deposit < 0) return '보증금을 확인하세요.'
    if (form.contract_months <= 0) return '계약 개월수를 입력하세요.'
    if (!form.image) return '이미지를 업로드하세요.'
    if (!form.specs.engine.trim()) return '엔진 정보를 입력하세요.'
    if (!form.specs.transmission.trim()) return '변속기 정보를 입력하세요.'
    if (form.specs.seats <= 0) return '좌석 수를 입력하세요.'
    if (!form.specs.fuelEfficiency.trim()) return '연비 정보를 입력하세요.'
    return null
  }

  /* ─── Save (Create / Update) ──────────────────────── */

  const handleSave = async () => {
    const validationMsg = validate()
    if (validationMsg) {
      setFormError(validationMsg)
      return
    }

    setSaving(true)
    setFormError(null)

    if (editingId) {
      const { error: err } = await supabase
        .from('homepage_vehicles')
        .update(form)
        .eq('id', editingId)

      if (err) {
        setFormError('수정에 실패했습니다.')
        console.error(err)
        setSaving(false)
        return
      }
    } else {
      const { error: err } = await supabase
        .from('homepage_vehicles')
        .insert(form)

      if (err) {
        setFormError('등록에 실패했습니다.')
        console.error(err)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setModalOpen(false)
    fetchVehicles()
  }

  /* ─── Delete ──────────────────────────────────────── */

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    const { error: err } = await supabase
      .from('homepage_vehicles')
      .delete()
      .eq('id', deleteTarget.id)

    if (err) {
      setError('삭제에 실패했습니다.')
      console.error(err)
    } else {
      setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id))
    }

    setDeleting(false)
    setDeleteTarget(null)
  }

  /* ─── Form field updaters ─────────────────────────── */

  const updateField = <K extends keyof VehicleInsert>(key: K, value: VehicleInsert[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const updateSpec = <K extends keyof Specs>(key: K, value: Specs[K]) =>
    setForm((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } }))

  const [optionInput, setOptionInput] = useState('')
  const addOption = () => {
    const trimmed = optionInput.trim()
    if (trimmed && !form.options.includes(trimmed)) {
      updateField('options', [...form.options, trimmed])
    }
    setOptionInput('')
  }
  const removeOption = (opt: string) =>
    updateField(
      'options',
      form.options.filter((o) => o !== opt),
    )

  /* ─── Render ──────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#0A0A0B] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">차량 관리</h1>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF9D42] text-white font-semibold hover:bg-[#e88d35] transition-colors"
          >
            <Plus size={18} />
            차량 등록
          </button>
        </div>

        {/* Error toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-between"
            >
              <span>{error}</span>
              <button onClick={() => setError(null)}>
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]"
            />
            <input
              type="text"
              placeholder="브랜드 또는 모델 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50 transition-colors"
            />
          </div>
          <select
            value={filterRentType}
            onChange={(e) => setFilterRentType(e.target.value as RentType | '')}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white focus:outline-none focus:border-[#FF9D42]/50 transition-colors"
          >
            <option value="">전체 렌트 유형</option>
            {RENT_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/[0.08] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left px-4 py-3 text-[#94A3B8] font-medium">브랜드</th>
                  <th className="text-left px-4 py-3 text-[#94A3B8] font-medium">모델</th>
                  <th className="text-left px-4 py-3 text-[#94A3B8] font-medium">연식</th>
                  <th className="text-left px-4 py-3 text-[#94A3B8] font-medium">유형</th>
                  <th className="text-right px-4 py-3 text-[#94A3B8] font-medium">월 납입금</th>
                  <th className="text-center px-4 py-3 text-[#94A3B8] font-medium">인기</th>
                  <th className="text-left px-4 py-3 text-[#94A3B8] font-medium">등록일</th>
                  <th className="text-right px-4 py-3 text-[#94A3B8] font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-[#94A3B8]">
                      <div className="inline-block w-6 h-6 border-2 border-[#FF9D42] border-t-transparent rounded-full animate-spin" />
                      <p className="mt-2">불러오는 중...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-[#475569]">
                      {searchQuery || filterRentType
                        ? '검색 결과가 없습니다.'
                        : '등록된 차량이 없습니다.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((v) => (
                    <tr
                      key={v.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-white font-medium">{v.brand}</td>
                      <td className="px-4 py-3 text-white">{v.model}</td>
                      <td className="px-4 py-3 text-[#94A3B8]">{v.year}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-[#FF9D42]/10 text-[#FF9D42]">
                          {rentTypeLabel[v.rent_type]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-white">
                        {formatNumber(v.monthly_payment)}원
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => togglePopular(v)}
                          className="transition-colors"
                          title={v.is_popular ? '인기 해제' : '인기 설정'}
                        >
                          <Star
                            size={18}
                            className={
                              v.is_popular
                                ? 'fill-[#FF9D42] text-[#FF9D42]'
                                : 'text-[#475569] hover:text-[#94A3B8]'
                            }
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-[#94A3B8]">{formatDate(v.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(v)}
                            className="p-2 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
                            title="수정"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(v)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-[#94A3B8] hover:text-red-400 transition-colors"
                            title="삭제"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-xs text-[#475569]">
          총 {filtered.length}대
          {(searchQuery || filterRentType) && ` (전체 ${vehicles.length}대)`}
        </p>
      </div>

      {/* ─── Add / Edit Modal ──────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-2xl my-8 rounded-2xl backdrop-blur-xl bg-[#0A0A0B]/95 border border-white/[0.08] shadow-2xl"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
                <h2 className="text-lg font-bold text-white">
                  {editingId ? '차량 수정' : '차량 등록'}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {formError}
                  </div>
                )}

                {/* Brand & Model */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5">
                    <span className="text-sm text-[#94A3B8]">브랜드 *</span>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) => updateField('brand', e.target.value)}
                      placeholder="현대"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm text-[#94A3B8]">모델 *</span>
                    <input
                      type="text"
                      value={form.model}
                      onChange={(e) => updateField('model', e.target.value)}
                      placeholder="아반떼"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                </div>

                {/* Year, Fuel, Category */}
                <div className="grid grid-cols-3 gap-4">
                  <label className="space-y-1.5">
                    <span className="text-sm text-[#94A3B8]">연식 *</span>
                    <input
                      type="number"
                      value={form.year}
                      onChange={(e) => updateField('year', Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm text-[#94A3B8]">연료</span>
                    <select
                      value={form.fuel}
                      onChange={(e) => updateField('fuel', e.target.value as Fuel)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white focus:outline-none focus:border-[#FF9D42]/50"
                    >
                      {FUEL_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm text-[#94A3B8]">카테고리</span>
                    <select
                      value={form.category}
                      onChange={(e) => updateField('category', e.target.value as Category)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white focus:outline-none focus:border-[#FF9D42]/50"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Rent type, Monthly payment, Deposit, Contract months */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5">
                    <span className="text-sm text-[#94A3B8]">렌트 유형</span>
                    <select
                      value={form.rent_type}
                      onChange={(e) => updateField('rent_type', e.target.value as RentType)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white focus:outline-none focus:border-[#FF9D42]/50"
                    >
                      {RENT_TYPE_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm text-[#94A3B8]">월 납입금 (원) *</span>
                    <input
                      type="number"
                      value={form.monthly_payment || ''}
                      onChange={(e) => updateField('monthly_payment', Number(e.target.value))}
                      placeholder="350000"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <label className="space-y-1.5">
                    <span className="text-sm text-[#94A3B8]">보증금 (원)</span>
                    <input
                      type="number"
                      value={form.deposit || ''}
                      onChange={(e) => updateField('deposit', Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm text-[#94A3B8]">계약 개월 *</span>
                    <input
                      type="number"
                      value={form.contract_months || ''}
                      onChange={(e) => updateField('contract_months', Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm text-[#94A3B8]">주행거리 (km)</span>
                    <input
                      type="number"
                      value={form.mileage ?? ''}
                      onChange={(e) =>
                        updateField(
                          'mileage',
                          e.target.value === '' ? null : Number(e.target.value),
                        )
                      }
                      placeholder="중고차만"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                </div>

                {/* Specs */}
                <div>
                  <p className="text-sm text-[#94A3B8] mb-2">사양</p>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={form.specs.engine}
                      onChange={(e) => updateSpec('engine', e.target.value)}
                      placeholder="엔진 (예: 2.0 가솔린) *"
                      className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50"
                    />
                    <input
                      type="text"
                      value={form.specs.transmission}
                      onChange={(e) => updateSpec('transmission', e.target.value)}
                      placeholder="변속기 (예: 자동 8단) *"
                      className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50"
                    />
                    <input
                      type="number"
                      value={form.specs.seats || ''}
                      onChange={(e) => updateSpec('seats', Number(e.target.value))}
                      placeholder="좌석 수 *"
                      className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50"
                    />
                    <input
                      type="text"
                      value={form.specs.fuelEfficiency}
                      onChange={(e) => updateSpec('fuelEfficiency', e.target.value)}
                      placeholder="연비 (예: 12.5km/L) *"
                      className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </div>
                </div>

                {/* Image upload */}
                <div className="space-y-1.5">
                  <span className="text-sm text-[#94A3B8]">이미지 *</span>
                  <div
                    className="relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-white/[0.08] hover:border-[#FF9D42]/30 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#FF9D42] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-[#94A3B8]">업로드 중...</p>
                      </div>
                    ) : imagePreview ? (
                      <div className="relative w-full">
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setImagePreview(null)
                            updateField('image', '')
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} className="text-[#475569]" />
                        <p className="text-sm text-[#475569]">클릭하여 이미지 업로드</p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                        e.target.value = ''
                      }}
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-1.5">
                  <span className="text-sm text-[#94A3B8]">옵션</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addOption()
                        }
                      }}
                      placeholder="옵션 입력 후 Enter"
                      className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50"
                    />
                    <button
                      type="button"
                      onClick={addOption}
                      className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  {form.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.options.map((opt) => (
                        <span
                          key={opt}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-sm text-[#94A3B8]"
                        >
                          {opt}
                          <button
                            onClick={() => removeOption(opt)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <label className="block space-y-1.5">
                  <span className="text-sm text-[#94A3B8]">설명</span>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    placeholder="차량에 대한 간단한 설명을 입력하세요."
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white placeholder-[#475569] focus:outline-none focus:border-[#FF9D42]/50 resize-none"
                  />
                </label>

                {/* is_popular toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`w-10 h-6 rounded-full relative transition-colors ${
                      form.is_popular ? 'bg-[#FF9D42]' : 'bg-white/10'
                    }`}
                    onClick={() => updateField('is_popular', !form.is_popular)}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        form.is_popular ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </div>
                  <span className="text-sm text-[#94A3B8]">인기 차량</span>
                </label>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.08]">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF9D42] text-white font-semibold hover:bg-[#e88d35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {editingId ? '수정' : '등록'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation Modal ─────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl backdrop-blur-xl bg-[#0A0A0B]/95 border border-white/[0.08] shadow-2xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-white mb-2">차량 삭제</h3>
              <p className="text-sm text-[#94A3B8] mb-6">
                <span className="text-white font-medium">
                  {deleteTarget.brand} {deleteTarget.model}
                </span>
                을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  삭제
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

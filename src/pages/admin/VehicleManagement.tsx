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
import { vehicleStorage, type StorageVehicle } from '../../lib/vehicleStorage'

/* ─── Types ──────────────────────────────────────────── */

type Fuel = '가솔린' | '디젤' | '하이브리드' | '전기'
type Category = 'compact' | 'sedan' | 'suv' | 'electric'
type RentType = 'new' | 'used' | 'monthly'

interface Specs {
  engine: string
  transmission: string
  seats: number
  fuelEfficiency: string
}

type VehicleForm = {
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
}

const emptyForm: VehicleForm = {
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
  { value: 'compact', label: '경차' },
  { value: 'sedan', label: '승용' },
  { value: 'suv', label: 'SUV' },
  { value: 'electric', label: '친환경' },
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

const BRAND_TABS = [
  { key: 'hyundai', label: '현대', brands: ['현대'] },
  { key: 'kia', label: '기아', brands: ['기아'] },
  { key: 'domestic', label: '그외국산', brands: ['쉐보레', '르노', '쌍용', 'KGM'] },
  { key: 'import', label: '수입차 & 제네시스', brands: ['제네시스', 'BMW', '벤츠', '아우디', '폭스바겐', '볼보', '렉서스', '토요타', '혼다'] },
] as const

type BrandTabKey = typeof BRAND_TABS[number]['key']

const categoryLabel: Record<string, string> = {
  compact: '경차',
  sedan: '승용',
  suv: 'SUV',
  electric: '친환경',
}

const CATEGORY_ORDER = ['compact', 'sedan', 'suv', 'electric'] as const

/* ─── Component ──────────────────────────────────────── */

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<StorageVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<VehicleForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // image upload
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // delete
  const [deleteTarget, setDeleteTarget] = useState<StorageVehicle | null>(null)

  // search / filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRentType, setFilterRentType] = useState<RentType | ''>('')
  const [activeBrandTab, setActiveBrandTab] = useState<BrandTabKey>('hyundai')

  /* ─── Fetch ───────────────────────────────────────── */

  const fetchVehicles = useCallback(() => {
    setLoading(true)
    setError(null)
    try {
      const data = vehicleStorage.getAll()
      setVehicles(data)
    } catch {
      setError('차량 목록을 불러오는데 실패했습니다.')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  /* ─── Filtered list ───────────────────────────────── */

  const activeBrands = BRAND_TABS.find((t) => t.key === activeBrandTab)!.brands

  const filtered = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q || v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
    const matchesRent = !filterRentType || v.rent_type === filterRentType
    const matchesBrand = (activeBrands as readonly string[]).includes(v.brand)
    return matchesSearch && matchesRent && matchesBrand
  })

  const groupedByCategory = CATEGORY_ORDER.map((cat) => ({
    key: cat,
    label: categoryLabel[cat],
    vehicles: filtered.filter((v) => v.category === cat),
  })).filter((group) => group.vehicles.length > 0)

  /* ─── Toggle popular ──────────────────────────────── */

  const togglePopular = (vehicle: StorageVehicle) => {
    const newVal = !vehicle.is_popular
    vehicleStorage.update(vehicle.id, { is_popular: newVal })
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicle.id ? { ...v, is_popular: newVal } : v)),
    )
  }

  /* ─── Image upload (base64 for localStorage) ─────── */

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('이미지 파일만 업로드 가능합니다.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setForm((prev) => ({ ...prev, image: dataUrl }))
      setImagePreview(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  /* ─── Modal open helpers ──────────────────────────── */

  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setImagePreview(null)
    setFormError(null)
    setModalOpen(true)
  }

  const openEditModal = (vehicle: StorageVehicle) => {
    setEditingId(vehicle.id)
    setForm({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      fuel: vehicle.fuel as Fuel,
      category: vehicle.category as Category,
      rent_type: vehicle.rent_type as RentType,
      monthly_payment: vehicle.monthly_payment,
      deposit: vehicle.deposit,
      contract_months: vehicle.contract_months,
      mileage: vehicle.mileage,
      image: vehicle.image,
      specs: vehicle.specs,
      options: vehicle.options,
      description: vehicle.description,
      is_popular: vehicle.is_popular,
    })
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
    return null
  }

  /* ─── Save (Create / Update) ──────────────────────── */

  const handleSave = () => {
    const validationMsg = validate()
    if (validationMsg) {
      setFormError(validationMsg)
      return
    }

    setSaving(true)
    setFormError(null)

    try {
      if (editingId) {
        vehicleStorage.update(editingId, form)
      } else {
        vehicleStorage.create(form)
      }
      setModalOpen(false)
      fetchVehicles()
    } catch {
      setFormError(editingId ? '수정에 실패했습니다.' : '등록에 실패했습니다.')
    }

    setSaving(false)
  }

  /* ─── Delete ──────────────────────────────────────── */

  const handleDelete = () => {
    if (!deleteTarget) return
    vehicleStorage.delete(deleteTarget.id)
    setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  /* ─── Form field updaters ─────────────────────────── */

  const updateField = <K extends keyof VehicleForm>(key: K, value: VehicleForm[K]) =>
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">차량 관리</h1>
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
              className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-between"
            >
              <span>{error}</span>
              <button onClick={() => setError(null)}>
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {BRAND_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveBrandTab(tab.key)}
              className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeBrandTab === tab.key
                  ? 'bg-[#FF9D42]/10 border border-[#FF9D42]/40 text-[#FF9D42]'
                  : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="모델 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9D42]/50 transition-colors"
            />
          </div>
          <select
            value={filterRentType}
            onChange={(e) => setFilterRentType(e.target.value as RentType | '')}
            className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#FF9D42]/50 transition-colors"
          >
            <option value="">전체 렌트 유형</option>
            {RENT_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category-grouped vehicle cards */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="inline-block w-6 h-6 border-2 border-[#FF9D42] border-t-transparent rounded-full animate-spin" />
            <p className="mt-2">불러오는 중...</p>
          </div>
        ) : groupedByCategory.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            {searchQuery || filterRentType
              ? '검색 결과가 없습니다.'
              : '등록된 차량이 없습니다.'}
          </div>
        ) : (
          <div className="space-y-8">
            {groupedByCategory.map((group) => (
              <div key={group.key}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#FF9D42] rounded-full" />
                  {group.label}
                  <span className="text-xs text-gray-400 font-normal ml-1">{group.vehicles.length}대</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {group.vehicles.map((v) => (
                    <div
                      key={v.id}
                      className="rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-accent/30 hover:shadow-sm transition-all"
                    >
                      {/* Image */}
                      <div className="relative h-36 bg-[#f5f5f5] overflow-hidden">
                        {v.image ? (
                          <img src={v.image} alt={v.model} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{v.model}</h4>
                          <button
                            onClick={() => togglePopular(v)}
                            className="shrink-0 ml-1"
                            title={v.is_popular ? '인기 해제' : '인기 설정'}
                          >
                            <Star
                              size={16}
                              className={
                                v.is_popular
                                  ? 'fill-[#FF9D42] text-[#FF9D42]'
                                  : 'text-gray-300 hover:text-gray-400'
                              }
                            />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span>{v.year}년</span>
                          <span>·</span>
                          <span>{v.fuel}</span>
                          <span>·</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#FF9D42]/10 text-[#FF9D42] font-medium">
                            {rentTypeLabel[v.rent_type as RentType]}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#FF9D42] font-bold text-sm">
                            {(v.monthly_payment / 10000).toFixed(0)}만원<span className="text-gray-400 font-normal text-xs"> / 월</span>
                          </span>
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => openEditModal(v)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                              title="수정"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(v)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                              title="삭제"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-gray-400">
          {BRAND_TABS.find((t) => t.key === activeBrandTab)!.label} {filtered.length}대
          {(searchQuery || filterRentType) && ` (전체 ${vehicles.length}대)`}
        </p>
      </div>

      {/* ─── Add / Edit Modal ──────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-2xl my-8 rounded-2xl bg-white border border-gray-200 shadow-2xl"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? '차량 수정' : '차량 등록'}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {formError}
                  </div>
                )}

                {/* Brand & Model */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5">
                    <span className="text-sm text-gray-500">브랜드 *</span>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) => updateField('brand', e.target.value)}
                      placeholder="현대"
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm text-gray-500">모델 *</span>
                    <input
                      type="text"
                      value={form.model}
                      onChange={(e) => updateField('model', e.target.value)}
                      placeholder="아반떼"
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                </div>

                {/* Year, Fuel, Category */}
                <div className="grid grid-cols-3 gap-4">
                  <label className="space-y-1.5">
                    <span className="text-sm text-gray-500">연식 *</span>
                    <input
                      type="number"
                      value={form.year}
                      onChange={(e) => updateField('year', Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm text-gray-500">연료</span>
                    <select
                      value={form.fuel}
                      onChange={(e) => updateField('fuel', e.target.value as Fuel)}
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-[#FF9D42]/50"
                    >
                      {FUEL_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm text-gray-500">카테고리</span>
                    <select
                      value={form.category}
                      onChange={(e) => updateField('category', e.target.value as Category)}
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-[#FF9D42]/50"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Rent type, Monthly payment */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5">
                    <span className="text-sm text-gray-500">렌트 유형</span>
                    <select
                      value={form.rent_type}
                      onChange={(e) => updateField('rent_type', e.target.value as RentType)}
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-[#FF9D42]/50"
                    >
                      {RENT_TYPE_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm text-gray-500">월 납입금 (원) *</span>
                    <input
                      type="number"
                      value={form.monthly_payment || ''}
                      onChange={(e) => updateField('monthly_payment', Number(e.target.value))}
                      placeholder="350000"
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <label className="space-y-1.5">
                    <span className="text-sm text-gray-500">보증금 (원)</span>
                    <input
                      type="number"
                      value={form.deposit || ''}
                      onChange={(e) => updateField('deposit', Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm text-gray-500">계약 개월</span>
                    <input
                      type="number"
                      value={form.contract_months || ''}
                      onChange={(e) => updateField('contract_months', Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm text-gray-500">주행거리 (km)</span>
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
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </label>
                </div>

                {/* Specs */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">사양</p>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={form.specs.engine}
                      onChange={(e) => updateSpec('engine', e.target.value)}
                      placeholder="엔진 (예: 2.0 가솔린)"
                      className="px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9D42]/50"
                    />
                    <input
                      type="text"
                      value={form.specs.transmission}
                      onChange={(e) => updateSpec('transmission', e.target.value)}
                      placeholder="변속기 (예: 자동 8단)"
                      className="px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9D42]/50"
                    />
                    <input
                      type="number"
                      value={form.specs.seats || ''}
                      onChange={(e) => updateSpec('seats', Number(e.target.value))}
                      placeholder="좌석 수"
                      className="px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9D42]/50"
                    />
                    <input
                      type="text"
                      value={form.specs.fuelEfficiency}
                      onChange={(e) => updateSpec('fuelEfficiency', e.target.value)}
                      placeholder="연비 (예: 12.5km/L)"
                      className="px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9D42]/50"
                    />
                  </div>
                </div>

                {/* Image upload */}
                <div className="space-y-1.5">
                  <span className="text-sm text-gray-500">이미지</span>
                  <div
                    className="relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#FF9D42]/30 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
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
                        <Upload size={24} className="text-gray-400" />
                        <p className="text-sm text-gray-400">클릭하여 이미지 업로드</p>
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
                  <span className="text-sm text-gray-500">옵션</span>
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
                      className="flex-1 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9D42]/50"
                    />
                    <button
                      type="button"
                      onClick={addOption}
                      className="px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  {form.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.options.map((opt) => (
                        <span
                          key={opt}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-sm text-gray-600"
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
                  <span className="text-sm text-gray-500">설명</span>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    placeholder="차량에 대한 간단한 설명을 입력하세요."
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9D42]/50 resize-none"
                  />
                </label>

                {/* is_popular toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`w-10 h-6 rounded-full relative transition-colors ${
                      form.is_popular ? 'bg-[#FF9D42]' : 'bg-gray-200'
                    }`}
                    onClick={() => updateField('is_popular', !form.is_popular)}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        form.is_popular ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-500">인기 차량</span>
                </label>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl bg-white border border-gray-200 shadow-2xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">차량 삭제</h3>
              <p className="text-sm text-gray-500 mb-6">
                <span className="text-gray-900 font-medium">
                  {deleteTarget.brand} {deleteTarget.model}
                </span>
                을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
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

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, GripVertical, Search, Sparkles } from 'lucide-react'
import { vehicleStorage, type StorageVehicle, type PromoVehicle } from '../../lib/vehicleStorage'

export default function PromoManagement() {
  const [promos, setPromos] = useState<PromoVehicle[]>([])
  const [vehicles, setVehicles] = useState<StorageVehicle[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [search, setSearch] = useState('')
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [tagValue, setTagValue] = useState('')

  useEffect(() => {
    setPromos(vehicleStorage.getPromos())
    setVehicles(vehicleStorage.getAll())
  }, [])

  const save = (updated: PromoVehicle[]) => {
    setPromos(updated)
    vehicleStorage.savePromos(updated)
  }

  const addPromo = (vehicleId: string) => {
    if (promos.some((p) => p.vehicleId === vehicleId)) return
    const v = vehicles.find((v) => v.id === vehicleId)
    const tag = v ? `${v.brand} ${v.model}` : ''
    save([...promos, { vehicleId, tag }])
    setShowPicker(false)
    setSearch('')
  }

  const removePromo = (vehicleId: string) => {
    save(promos.filter((p) => p.vehicleId !== vehicleId))
  }

  const updateTag = (vehicleId: string, tag: string) => {
    save(promos.map((p) => (p.vehicleId === vehicleId ? { ...p, tag } : p)))
    setEditingTag(null)
  }

  const movePromo = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= promos.length) return
    const updated = [...promos]
    ;[updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]]
    save(updated)
  }

  const getVehicle = (id: string) => vehicles.find((v) => v.id === id)

  const filteredVehicles = vehicles.filter((v) => {
    if (promos.some((p) => p.vehicleId === v.id)) return false
    const q = search.toLowerCase()
    return `${v.brand} ${v.model}`.toLowerCase().includes(q)
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={24} className="text-accent" />
            프로모션 슬라이드 관리
          </h1>
          <p className="text-gray-500 text-sm mt-1">홈페이지 메인 배너 옆 프로모션 슬라이드에 표시될 차량을 관리합니다.</p>
        </div>
        <button
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus size={18} />
          차량 추가
        </button>
      </div>

      {/* 현재 프로모션 목록 */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {promos.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Sparkles size={40} className="mx-auto mb-3 opacity-30" />
            <p>등록된 프로모션이 없습니다.</p>
            <p className="text-sm mt-1">차량을 추가해주세요.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {promos.map((promo, idx) => {
              const v = getVehicle(promo.vehicleId)
              if (!v) return null
              return (
                <motion.div
                  key={promo.vehicleId}
                  layout
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* 순서 변경 */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => movePromo(idx, -1)}
                      disabled={idx === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-20"
                    >
                      <GripVertical size={16} className="rotate-90 scale-x-[-1]" />
                    </button>
                    <button
                      onClick={() => movePromo(idx, 1)}
                      disabled={idx === promos.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-20"
                    >
                      <GripVertical size={16} className="rotate-90" />
                    </button>
                  </div>

                  {/* 순번 */}
                  <span className="w-8 h-8 flex items-center justify-center bg-accent/10 text-accent font-bold text-sm rounded-lg flex-shrink-0">
                    {idx + 1}
                  </span>

                  {/* 차량 이미지 */}
                  <img
                    src={v.image}
                    alt={`${v.brand} ${v.model}`}
                    className="w-24 h-16 object-contain bg-gray-50 rounded-lg flex-shrink-0"
                  />

                  {/* 차량 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{v.brand} {v.model}</p>
                    <p className="text-sm text-gray-500">{v.monthly_payment > 0 ? `월 ${v.monthly_payment.toLocaleString()}원` : '상담문의'}</p>
                  </div>

                  {/* 태그 */}
                  <div className="flex-shrink-0">
                    {editingTag === promo.vehicleId ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          updateTag(promo.vehicleId, tagValue)
                        }}
                        className="flex gap-2"
                      >
                        <input
                          autoFocus
                          value={tagValue}
                          onChange={(e) => setTagValue(e.target.value)}
                          onBlur={() => updateTag(promo.vehicleId, tagValue)}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-36 focus:outline-none focus:border-accent"
                          placeholder="태그 입력"
                        />
                      </form>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingTag(promo.vehicleId)
                          setTagValue(promo.tag)
                        }}
                        className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full hover:bg-accent/20 transition-colors"
                      >
                        {promo.tag || '태그 추가'}
                      </button>
                    )}
                  </div>

                  {/* 삭제 */}
                  <button
                    onClick={() => removePromo(promo.vehicleId)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* 차량 선택 모달 */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setShowPicker(false); setSearch('') }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">프로모션 차량 추가</h3>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="차량명 검색..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {filteredVehicles.length === 0 ? (
                <p className="text-center text-gray-400 py-8">검색 결과가 없습니다.</p>
              ) : (
                <div className="space-y-1">
                  {filteredVehicles.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => addPromo(v.id)}
                      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                      <img
                        src={v.image}
                        alt={`${v.brand} ${v.model}`}
                        className="w-16 h-11 object-contain bg-gray-50 rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{v.brand} {v.model}</p>
                        <p className="text-xs text-gray-500">{v.monthly_payment > 0 ? `월 ${v.monthly_payment.toLocaleString()}원` : '상담문의'}</p>
                      </div>
                      <Plus size={18} className="text-accent flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

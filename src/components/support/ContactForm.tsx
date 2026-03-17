import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', car: '', message: '' })
  const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) return
    setLoading(true)
    setError('')
    try {
      const { error: dbError } = await supabase.from('consultations').insert({
        name: form.name,
        phone: form.phone,
        car: form.car || null,
        message: form.message || null,
        status: 'pending',
      })
      if (dbError) throw dbError
      setSubmitted(true)
    } catch {
      setError('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <CheckCircle size={48} className="text-accent mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">상담 신청 완료!</h3>
        <p className="text-text-secondary text-sm">빠른 시간 내에 연락드리겠습니다.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="이름 *" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={inputClass} />
        <input type="tel" placeholder="연락처 * (010-0000-0000)" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className={inputClass} />
      </div>
      <select value={form.car} onChange={(e) => setForm({...form, car: e.target.value})} className={inputClass}>
        <option value="">관심 차종 (선택)</option>
        <option>현대 그랜저</option><option>기아 K5</option><option>현대 투싼</option><option>기아 쏘렌토</option><option>제네시스 G80</option><option>기타</option>
      </select>
      <textarea placeholder="문의 내용 (선택)" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={4} className={`${inputClass} resize-none`} />
      <label className="flex items-start gap-2 text-xs text-text-muted">
        <input type="checkbox" required className="mt-0.5 accent-accent" />
        개인정보 수집 및 이용에 동의합니다
      </label>
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all glow-accent text-sm disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
        {loading ? '신청 중...' : '상담 신청하기'}
      </motion.button>
    </form>
  )
}

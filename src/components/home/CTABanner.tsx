import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function CTABanner() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', car: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) return
    setLoading(true)
    setError('')
    try {
      const { error: dbError } = await supabase.from('consultations').insert({
        name: form.name,
        phone: form.phone,
        product_type: 'new',
        desired_car: form.car || null,
        memo: '[홈 하단 CTA] 30초 견적 신청',
        source: 'cta_banner',
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

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gray-50">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight text-text-primary">
              지금 바로<br />
              <span className="text-gradient">무료 견적</span>을 받아보세요
            </h2>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6">
              전문 상담원이 고객님의 조건에 맞는 최적의 견적을 안내해 드립니다.<br />
              상담은 100% 무료이며, 부담 없이 문의하세요.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-accent" /> 업계 최저가 보장</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-accent" /> 무료 상담</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-accent" /> 빠른 출고</span>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {submitted ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                <CheckCircle size={48} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-text-primary">상담 신청 완료!</h3>
                <p className="text-text-secondary text-sm">빠른 시간 내에 연락드리겠습니다.</p>
              </div>
            ) : (
              <form data-track-consult onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-2 text-text-primary">30초 만에 견적 신청하기</h3>
                <input
                  type="text"
                  placeholder="이름"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted text-text-primary"
                />
                <input
                  type="tel"
                  placeholder="연락처 (010-0000-0000)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted text-text-primary"
                />
                <input
                  type="text"
                  placeholder="희망 차종 (선택)"
                  value={form.car}
                  onChange={(e) => setForm({ ...form, car: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted text-text-primary"
                />
                <label className="flex items-start gap-2 text-xs text-text-muted">
                  <input type="checkbox" required className="mt-0.5 accent-accent" />
                  개인정보 수집 및 이용에 동의합니다
                </label>
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all glow-accent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
                  {loading ? '신청 중...' : '30초 만에 견적 신청하기'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, CheckCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { vehicles } from '../../data/vehicles'
import type { Vehicle } from '../../types/vehicle'
import { supabase } from '../../lib/supabase'

type RentType = 'short' | 'long' | 'monthly'
type Deposit = 'none' | 'yes' | 'low' | 'mid' | 'high'
type Interest = 'liked' | 'other'
type Priority = 'cheapest' | 'space' | 'sedan' | 'ev' | 'imported'

interface QuizAnswers {
  rentType?: RentType
  period?: number
  deposit?: Deposit
  mileage?: number
  priority?: Priority
  interest?: Interest
}

const STORAGE_KEY = 'blrent_quiz_seen_v1'

const depositLabel: Record<Deposit, string> = {
  none: '무보증',
  yes: '보증',
  low: '100만원 이하',
  mid: '100~300만원',
  high: '300만원 이상',
}

const mileageLabel = (km: number, rentType?: RentType) => {
  if (km >= 99999) return '무제한 / 모름'
  if (rentType === 'monthly') return `월 ${km.toLocaleString()}km`
  return `연 ${km.toLocaleString()}km`
}

const priorityModels: Record<Priority, string[]> = {
  cheapest: ['모닝', '레이'],
  space: ['셀토스', '스포티지', '쏘렌토', '카니발'],
  sedan: ['아반떼', 'K5', '그랜저', 'K8'],
  ev: ['아이오닉5', 'EV6', '아이오닉9'],
  imported: ['5시리즈', 'E-클래스', 'A6'],
}

const priorityLabel: Record<Priority, string> = {
  cheapest: '최저 가격',
  space: '넓은 공간',
  sedan: '세단',
  ev: '전기차',
  imported: '수입차',
}

export default function WelcomeQuiz() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [contact, setContact] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const quizParam = params.get('quiz')

    if (quizParam === 'reset') {
      localStorage.removeItem(STORAGE_KEY)
    }
    if (quizParam === 'open') {
      setOpen(true)
      return
    }

    const seen = localStorage.getItem(STORAGE_KEY)
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const handler = () => {
      setOpen(true)
      reset()
    }
    window.addEventListener('open-welcome-quiz', handler)
    return () => window.removeEventListener('open-welcome-quiz', handler)
  }, [])

  const close = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  const reset = () => {
    setStep(0)
    setAnswers({})
    setContact({ name: '', phone: '' })
    setSubmitted(false)
    setError('')
  }

  const isShort = answers.rentType === 'short'
  const totalSteps = isShort ? 2 : 7

  const next = () => setStep((s) => s + 1)
  const back = () => setStep((s) => Math.max(0, s - 1))

  const recommended = (): Vehicle[] => {
    if (!answers.priority) return []
    const targets = priorityModels[answers.priority]
    return vehicles.filter((v) => targets.includes(v.model))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contact.name || !contact.phone) return
    setLoading(true)
    setError('')

    const rentLabel = answers.rentType === 'long' ? '장기렌트' : answers.rentType === 'monthly' ? '월렌트' : '단기렌트'
    const interestLabel = answers.interest === 'liked' ? '추천 차량 마음에 듦' : answers.interest === 'other' ? '다른 차량 희망' : ''
    const periodLabel = answers.period === 0 ? '기간 상관없음' : `기간 ${answers.period}개월`
    const prioLabel = answers.priority ? `중요요소 ${priorityLabel[answers.priority]}` : ''
    const message = isShort
      ? `[홈 설문] 단기렌트 문의 - 별도 상담 요청`
      : `[홈 설문] ${rentLabel} | ${periodLabel} | 보증금 ${depositLabel[answers.deposit!]} | ${mileageLabel(answers.mileage!, answers.rentType)}${prioLabel ? ` | ${prioLabel}` : ''}${interestLabel ? ` | ${interestLabel}` : ''}`

    try {
      const productType = answers.rentType === 'monthly' ? 'used' : answers.rentType === 'short' ? 'used' : 'new'
      const { error: dbError } = await supabase.from('consultations').insert({
        name: contact.name,
        phone: contact.phone,
        product_type: productType,
        desired_car: null,
        memo: message,
        source: 'welcome_quiz',
        status: 'pending',
      })
      if (dbError) throw dbError
      setSubmitted(true)
      window.location.href = 'tel:01048851862'
    } catch {
      setError('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors z-10"
              aria-label="닫기"
            >
              <X size={20} />
            </button>

            {!submitted && (
              <div className="px-6 pt-6">
                <div className="flex gap-1.5 mb-1">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-accent' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted">
                  {step + 1} / {totalSteps}
                </p>
              </div>
            )}

            <div className="p-6 pt-4">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle size={56} className="text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-text-primary">상담 신청 완료!</h3>
                  <p className="text-text-secondary text-sm mb-6">
                    전담 매니저가 빠른 시간 내에
                    <br />
                    연락드리겠습니다.
                  </p>
                  <button
                    onClick={close}
                    className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all"
                  >
                    확인
                  </button>
                </div>
              ) : step === 0 ? (
                <>
                  <h3 className="text-xl font-bold text-text-primary mb-1">어떤 차량을 찾으세요?</h3>
                  <p className="text-sm text-text-secondary mb-5">맞춤 차량을 빠르게 추천해드립니다</p>
                  <div className="space-y-2.5">
                    {[
                      { val: 'long', title: '장기렌트', desc: '3년 이상 저비용으로 장기간 이용' },
                      { val: 'monthly', title: '월렌트', desc: '1~12개월 단기간 렌트' },
                      { val: 'short', title: '사고대여', desc: '사고 발생 시 차량 렌트' },
                    ].map((o) => (
                      <button
                        key={o.val}
                        onClick={() => {
                          setAnswers({ ...answers, rentType: o.val as RentType })
                          next()
                        }}
                        className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-text-primary">{o.title}</p>
                            <p className="text-xs text-text-muted mt-0.5">{o.desc}</p>
                          </div>
                          <ArrowRight size={18} className="text-text-muted group-hover:text-accent transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : isShort && step === 1 ? (
                <>
                  <h3 className="text-xl font-bold text-text-primary mb-1">사고대여는 별도 상담이 필요해요</h3>
                  <p className="text-sm text-text-secondary mb-5">
                    사고 발생 시 빠르게 차량을 안내드립니다.
                    <br />
                    바로 전화 상담으로 연결해드릴게요.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={back}
                      className="px-4 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-text-secondary hover:bg-gray-50"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <a
                      href="tel:01039925756"
                      onClick={close}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all"
                    >
                      <Phone size={16} />
                      상담 바로하기
                    </a>
                  </div>
                </>
              ) : step === 1 ? (
                <>
                  <h3 className="text-xl font-bold text-text-primary mb-1">얼마나 타실 예정인가요?</h3>
                  <p className="text-sm text-text-secondary mb-5">예상 이용 기간을 선택해주세요</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(answers.rentType === 'monthly'
                      ? [
                          { v: 1, l: '1개월' },
                          { v: 3, l: '3개월' },
                          { v: 6, l: '6개월' },
                          { v: 12, l: '12개월' },
                        ]
                      : [
                          { v: 36, l: '36개월 (3년)' },
                          { v: 48, l: '48개월 (4년)' },
                          { v: 60, l: '60개월 (5년)' },
                          { v: 0, l: '기간 상관없음' },
                        ]
                    ).map((o) => (
                      <button
                        key={o.v}
                        onClick={() => {
                          setAnswers({ ...answers, period: o.v })
                          next()
                        }}
                        className="p-4 border border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all"
                      >
                        <p className="font-semibold text-text-primary">{o.l}</p>
                      </button>
                    ))}
                  </div>
                  <div className="mt-5">
                    <button
                      onClick={back}
                      className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-text-secondary hover:bg-gray-50"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  </div>
                </>
              ) : step === 2 ? (
                <>
                  <h3 className="text-xl font-bold text-text-primary mb-1">보증금은 어떻게 생각하세요?</h3>
                  <p className="text-sm text-text-secondary mb-5">희망하시는 보증금 범위를 선택해주세요</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(answers.rentType === 'monthly'
                      ? ([
                          { v: 'none', l: '무보증' },
                          { v: 'yes', l: '보증' },
                        ] as { v: Deposit; l: string }[])
                      : ([
                          { v: 'none', l: '무보증' },
                          { v: 'low', l: '100만원 이하' },
                          { v: 'mid', l: '100~300만원' },
                          { v: 'high', l: '300만원 이상' },
                        ] as { v: Deposit; l: string }[])
                    ).map((o) => (
                      <button
                        key={o.v}
                        onClick={() => {
                          setAnswers({ ...answers, deposit: o.v })
                          next()
                        }}
                        className="p-4 border border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all"
                      >
                        <p className="font-semibold text-text-primary">{o.l}</p>
                      </button>
                    ))}
                  </div>
                  <div className="mt-5">
                    <button
                      onClick={back}
                      className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-text-secondary hover:bg-gray-50"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  </div>
                </>
              ) : step === 3 ? (
                <>
                  <h3 className="text-xl font-bold text-text-primary mb-1">얼마나 자주 운행하세요?</h3>
                  <p className="text-sm text-text-secondary mb-5">
                    {answers.rentType === 'monthly' ? '예상 월 주행거리를 알려주세요' : '예상 연간 주행거리를 알려주세요'}
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(answers.rentType === 'monthly'
                      ? [
                          { v: 1000, l: '월 1,000km' },
                          { v: 2000, l: '월 2,000km' },
                          { v: 3000, l: '월 3,000km' },
                          { v: 99999, l: '무제한 / 모름' },
                        ]
                      : [
                          { v: 10000, l: '연 1만 km' },
                          { v: 20000, l: '연 2만 km' },
                          { v: 30000, l: '연 3만 km' },
                          { v: 99999, l: '무제한 / 모름' },
                        ]
                    ).map((o) => (
                      <button
                        key={o.v}
                        onClick={() => {
                          setAnswers({ ...answers, mileage: o.v })
                          next()
                        }}
                        className="p-4 border border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all"
                      >
                        <p className="font-semibold text-text-primary">{o.l}</p>
                      </button>
                    ))}
                  </div>
                  <div className="mt-5">
                    <button
                      onClick={back}
                      className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-text-secondary hover:bg-gray-50"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  </div>
                </>
              ) : step === 4 ? (
                <>
                  <h3 className="text-xl font-bold text-text-primary mb-1">가장 중요하게 보시는 건?</h3>
                  <p className="text-sm text-text-secondary mb-5">고객님 우선순위로 차량을 매칭해드려요</p>
                  <div className="space-y-2.5">
                    {(answers.rentType === 'monthly'
                      ? ([
                          { v: 'cheapest', t: '무조건 가격이 제일 중요해요' },
                          { v: 'space', t: '공간이 중요해요' },
                          { v: 'sedan', t: '세단이 좋아요' },
                          { v: 'ev', t: '전기차가 좋아요' },
                          { v: 'imported', t: '수입차가 좋아요' },
                        ] as { v: Priority; t: string }[])
                      : ([
                          { v: 'cheapest', t: '무조건 가격이 제일 중요해요' },
                          { v: 'space', t: '공간이 중요해요' },
                          { v: 'sedan', t: '세단이 좋아요' },
                          { v: 'ev', t: '전기차가 좋아요' },
                        ] as { v: Priority; t: string }[])
                    ).map((o) => (
                      <button
                        key={o.v}
                        onClick={() => {
                          setAnswers({ ...answers, priority: o.v })
                          next()
                        }}
                        className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-text-primary">{o.t}</p>
                          <ArrowRight size={18} className="text-text-muted group-hover:text-accent transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-5">
                    <button
                      onClick={back}
                      className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-text-secondary hover:bg-gray-50"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  </div>
                </>
              ) : step === 5 ? (
                <>
                  <h3 className="text-xl font-bold text-text-primary mb-1">맞춤 차량을 찾았어요!</h3>
                  <p className="text-sm text-text-secondary mb-4">고객님 조건에 가장 잘 맞는 차량입니다</p>

                  {recommended().length > 0 && (
                    <div className="space-y-2 mb-5">
                      {recommended().map((v) => (
                        <Link
                          key={v.id}
                          to={`/vehicle/${v.id}`}
                          onClick={close}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-accent transition-all"
                        >
                          <img
                            src={v.image}
                            alt={`${v.brand} ${v.model}`}
                            className="w-16 h-12 object-cover rounded-md bg-gray-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-text-primary truncate">
                              {v.brand} {v.model}
                            </p>
                            <p className="text-xs text-text-muted">월 대여료는 상담 시 안내</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <p className="text-sm font-semibold text-text-primary mb-3">추천이 어떠신가요?</p>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        setAnswers({ ...answers, interest: 'liked' })
                        next()
                      }}
                      className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-text-primary">맘에 들어요</p>
                          <p className="text-xs text-text-muted mt-0.5">바로 상담을 진행하고 싶어요</p>
                        </div>
                        <ArrowRight size={18} className="text-text-muted group-hover:text-accent transition-colors" />
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setAnswers({ ...answers, interest: 'other' })
                        next()
                      }}
                      className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-text-primary">다른 차량을 보고 싶어요</p>
                          <p className="text-xs text-text-muted mt-0.5">전담 매니저와 함께 더 찾아볼게요</p>
                        </div>
                        <ArrowRight size={18} className="text-text-muted group-hover:text-accent transition-colors" />
                      </div>
                    </button>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={back}
                      className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-text-secondary hover:bg-gray-50"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button onClick={reset} className="flex-1 text-xs text-text-muted hover:text-text-secondary">
                      처음부터 다시
                    </button>
                  </div>
                </>
              ) : step === 6 ? (
                <>
                  <h3 className="text-xl font-bold text-text-primary mb-1">
                    {answers.interest === 'liked' ? '바로 상담드릴게요!' : '함께 찾아드릴게요!'}
                  </h3>
                  <p className="text-sm text-text-secondary mb-5">
                    {answers.interest === 'liked'
                      ? '연락처를 남겨주시면 추천 차량 기준으로 빠르게 연락드립니다.'
                      : '연락처를 남겨주시면 더 다양한 옵션을 안내해드립니다.'}
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="이름"
                      required
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
                    />
                    <input
                      type="tel"
                      placeholder="010-0000-0000"
                      required
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
                    />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={back}
                        className="px-4 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-text-secondary hover:bg-gray-50"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Phone size={16} />
                        )}
                        {loading ? '신청 중...' : '즉시 상담 요청'}
                      </button>
                    </div>
                  </form>
                </>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

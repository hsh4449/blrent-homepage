import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Clock, Users, FileCheck, Rocket, FileText, Phone } from 'lucide-react'

const KAKAO_URL = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/'

const slides = [
  {
    heading: (
      <>
        장기렌트,<br />
        가격 그 이상의<br />
        <span className="text-gradient">가치를 경험하세요</span>
      </>
    ),
    sub: '500개 이상의 렌트사 바로바로 비교견적, 나에게 딱 맞는 장기렌트를 시작하세요',
    bg: '/hero-bg.png',
  },
  {
    heading: (
      <>
        신차보다 낮은 가격, 짧은 기간<br />
        <span className="text-gradient">부담 없이 시작하세요</span>
      </>
    ),
    sub: '신차 대비 최대 40% 저렴한 월 납입금, 검증된 중고차만 엄선',
    bg: '/hero-bg-2.png',
  },
  {
    heading: (
      <>
        기다림 없이,<br />
        <span className="text-gradient">로켓출고</span>
      </>
    ),
    sub: '오늘 상담, 내일 출고. 즉시 출고 가능한 차량을 지금 확인하세요',
    bg: '/hero-bg-3.png',
  },
]

const features = [
  { icon: Shield, title: '500여개 협력사 비교', desc: '다수의 렌트사 견적을 비교해 최저가로 안내드립니다' },
  { icon: Clock, title: '즉시 출고 가능', desc: '무심사 즉시 출고 가능 차량 다수 보유' },
  { icon: Users, title: '전담 매니저 배정', desc: '계약부터 반납까지 1:1 전담 케어' },
  { icon: FileCheck, title: '간편한 심사', desc: '최소 서류로 빠른 심사 진행' },
]

const bgVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
}

const textVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(0)

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % slides.length) + slides.length) % slides.length)
  }, [])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [paused, next])

  return (
    <section
      className="relative min-h-screen flex items-end md:items-center pb-10 md:pb-0 pt-20 overflow-hidden group/hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
      }}
    >
      {/* Background carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {slides[current].bg.includes('placeholder') || !slides[current].bg ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
          ) : (
            <img src={slides[current].bg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-bg-main/30 z-[1]" />

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-accent' : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-end lg:items-center">
          {/* Left content - 3 cols */}
          <div className="lg:col-span-3">
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${current}`}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
                    {slides[current].heading}
                  </h1>
                  <p className="text-text-secondary text-base md:text-lg mb-8 max-w-lg leading-relaxed">
                    {slides[current].sub}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={KAKAO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all glow-accent text-sm"
                >
                  <FileText size={16} />
                  즉시 견적 신청
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`tel:${import.meta.env.VITE_PHONE_NUMBER || '1234-5678'}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 glass rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
                >
                  <Phone size={16} />
                  전화 상담하기
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="/new-car"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25"
                >
                  <Rocket size={16} />
                  로켓출고
                </motion.a>
              </div>
            </div>
          </div>

          {/* Right - Bento grid features - 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="lg:col-span-2 hidden lg:grid grid-cols-2 gap-3"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="glass rounded-2xl p-5 hover:bg-white/[0.08] transition-all duration-300 cursor-default group"
              >
                <f.icon size={22} className="text-accent mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

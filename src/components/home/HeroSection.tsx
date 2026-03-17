import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Clock, Users, FileCheck, Rocket, FileText, Phone } from 'lucide-react'

const KAKAO_URL = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/'

const slides = [
  { img: '/hero-slide-1.png' },
  { img: '/hero-slide-2.png' },
  { img: '/hero-slide-3.png' },
]

const features = [
  { icon: Shield, title: '500여개 협력사 비교', desc: '다수의 렌트사 견적을 비교해 최저가로 안내드립니다' },
  { icon: Clock, title: '즉시 출고 가능', desc: '무심사 즉시 출고 가능 차량 다수 보유' },
  { icon: Users, title: '전담 매니저 배정', desc: '계약부터 반납까지 1:1 전담 케어' },
  { icon: FileCheck, title: '간편한 심사', desc: '최소 서류로 빠른 심사 진행' },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(0)

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % slides.length) + slides.length) % slides.length)
  }, [])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section
      className="relative overflow-hidden bg-gray-50"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
      }}
    >
      {/* 헤더 높이만큼 여백 */}
      <div className="h-16 md:h-20" />

      {/* 슬라이드 + Features 가로 배치 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 슬라이드 이미지 - 왼쪽 2/3 */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={`slide-${current}`}
                src={slides[current].img}
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full h-auto block"
              />
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-accent' : 'w-2 bg-black/20 hover:bg-black/30'
                  }`}
                  aria-label={`슬라이드 ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Features - 오른쪽 1/3, 2x2 그리드 */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-accent/30 hover:shadow-sm transition-all duration-300 cursor-default group flex flex-col items-center justify-center text-center"
              >
                <f.icon size={32} className="text-accent mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xs sm:text-sm font-semibold mb-1 text-text-primary">{f.title}</h3>
                <p className="text-[10px] sm:text-xs text-text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="hidden sm:flex justify-center gap-3 pt-6 [&>a]:min-w-[180px]">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all text-base"
          >
            <FileText size={20} />
            즉시 견적 신청
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:${import.meta.env.VITE_PHONE_NUMBER || '1234-5678'}`}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white border border-gray-200 rounded-xl font-semibold text-base text-text-primary hover:bg-gray-50 transition-all"
          >
            <Phone size={20} />
            전화 상담하기
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/new-car"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 transition-all"
          >
            <Rocket size={20} />
            로켓출고
          </motion.a>
        </div>
      </div>
    </section>
  )
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, FileText, Phone, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const KAKAO_URL = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/'

const slides = [
  { img: '/hero-slide-1.png' },
  { img: '/hero-slide-2.png' },
  { img: '/hero-slide-3.png' },
]

const promoVehicles = [
  {
    id: 'kia-ray',
    model: '레이',
    brand: '기아',
    image: '/vehicles/kia/ray.png',
    price: '250,000',
    tag: '경차 인기 1위',
  },
  {
    id: 'kia-k5',
    model: 'K5',
    brand: '기아',
    image: '/vehicles/kia/k5.png',
    price: '450,000',
    tag: '중형 세단 추천',
  },
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

      {/* 슬라이드 + 프로모션 가로 배치 */}
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

          {/* 3월의 프로모션 - 오른쪽 1/3 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-accent" />
              <h3 className="text-lg font-bold text-text-primary">3월의 프로모션</h3>
            </div>
            {promoVehicles.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              >
                <Link
                  to={`/vehicle/${v.id}`}
                  className="block bg-white rounded-2xl border border-gray-200 p-4 hover:border-accent/50 hover:shadow-md transition-all duration-300 group"
                >
                  <span className="inline-block px-2.5 py-0.5 bg-accent/10 text-accent text-xs font-bold rounded-full mb-2">
                    {v.tag}
                  </span>
                  <div className="h-28 flex items-center justify-center mb-2">
                    <img
                      src={v.image}
                      alt={`${v.brand} ${v.model}`}
                      className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-text-primary">{v.brand} {v.model}</p>
                    <p className="text-accent font-extrabold text-lg">월 {v.price}원~</p>
                  </div>
                </Link>
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

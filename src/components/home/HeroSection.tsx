import { motion } from 'framer-motion'
import { Shield, Clock, Users, FileCheck, Rocket } from 'lucide-react'

const KAKAO_URL = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/'

const features = [
  { icon: Shield, title: '업계 최저가 보장', desc: '복수 견적 비교를 통해 최저가를 보장합니다' },
  { icon: Clock, title: '즉시 출고 가능', desc: '무심사 즉시 출고 가능 차량 다수 보유' },
  { icon: Users, title: '전담 매니저 배정', desc: '계약부터 반납까지 1:1 전담 케어' },
  { icon: FileCheck, title: '간편한 심사', desc: '최소 서류로 빠른 심사 진행' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end md:items-center pb-10 md:pb-0 pt-20 overflow-hidden">
      {/* Background */}
      <img src="/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-bg-main/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-end lg:items-center">
          {/* Left content - 3 cols */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-accent font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                업계 최저가 보장제 운영중
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
                장기렌트,<br />
                가격 그 이상의<br />
                <span className="text-gradient">가치를 경험하세요</span>
              </h1>
              <p className="text-text-secondary text-base md:text-lg mb-8 max-w-lg leading-relaxed">
                신차부터 중고까지, 최저가 견적을 비교하고<br className="hidden sm:block" />
                나에게 딱 맞는 장기렌트를 시작하세요
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={KAKAO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all glow-accent text-sm"
                >
                  즉시 견적 신청
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`tel:${import.meta.env.VITE_PHONE_NUMBER || '1234-5678'}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 glass rounded-xl font-semibold text-sm hover:bg-white/10 transition-all"
                >
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
            </motion.div>
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

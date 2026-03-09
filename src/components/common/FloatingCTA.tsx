import { MessageCircle, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '1234-5678'
const KAKAO_URL = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/'

export default function FloatingCTA() {
  return (
    <>
      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-bg-card/95 backdrop-blur-xl border-t border-white/5 safe-bottom">
        <div className="flex">
          <a
            href={`tel:${PHONE}`}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold text-white transition-all active:bg-white/5"
          >
            <Phone size={18} />
            전화상담
          </a>
          <div className="w-px bg-white/10" />
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold text-kakao bg-kakao/10 transition-all active:bg-kakao/20"
          >
            <MessageCircle size={18} />
            카톡문의
          </a>
        </div>
      </div>

      {/* Desktop floating buttons */}
      <div className="hidden lg:flex fixed bottom-8 right-8 z-40 flex-col gap-3">
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={KAKAO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center"
        >
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-bg-card text-xs font-medium text-text-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/5">
            실시간 상담
          </span>
          <div className="w-14 h-14 rounded-full bg-kakao text-kakao-text flex items-center justify-center shadow-lg shadow-kakao/20">
            <MessageCircle size={24} />
          </div>
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={`tel:${PHONE}`}
          className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20"
        >
          <Phone size={24} />
        </motion.a>
      </div>
    </>
  )
}

import { MessageCircle, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '1234-5678'
const KAKAO_URL = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://open.kakao.com/o/sM1Ctzti'

export default function FloatingCTA() {
  return (
    <div className="fixed right-3 bottom-20 sm:right-4 sm:bottom-8 z-40 flex flex-col gap-2 sm:gap-3">
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={KAKAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center"
        aria-label="카카오톡 상담"
      >
        <span className="hidden lg:block absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-white text-xs font-medium text-text-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200">
          카카오톡 상담
        </span>
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-kakao text-kakao-text flex items-center justify-center shadow-lg shadow-kakao/20">
          <MessageCircle size={22} />
        </div>
      </motion.a>
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={`tel:${PHONE}`}
        className="group relative flex items-center"
        aria-label="전화 상담"
      >
        <span className="hidden lg:block absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-white text-xs font-medium text-text-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200">
          전화 상담
        </span>
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20">
          <Phone size={22} />
        </div>
      </motion.a>
    </div>
  )
}

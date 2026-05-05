import { MessageCircle, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '1234-5678'
const KAKAO_URL = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://open.kakao.com/o/sM1Ctzti'

export default function FloatingCTA() {
  return (
    <div className="fixed right-3 bottom-20 sm:right-4 sm:bottom-8 z-40 flex flex-col gap-2 sm:gap-3">
      <motion.a
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        href={KAKAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오톡 상담"
        className="flex items-center gap-2 pl-3 pr-4 py-2.5 sm:pl-4 sm:pr-5 sm:py-3 rounded-full bg-kakao text-kakao-text font-bold text-xs sm:text-sm shadow-lg shadow-kakao/30"
      >
        <MessageCircle size={18} strokeWidth={2.5} />
        <span className="whitespace-nowrap">카톡 상담</span>
      </motion.a>
      <motion.a
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        href={`tel:${PHONE}`}
        aria-label="전화 상담"
        className="flex items-center gap-2 pl-3 pr-4 py-2.5 sm:pl-4 sm:pr-5 sm:py-3 rounded-full bg-accent text-white font-bold text-xs sm:text-sm shadow-lg shadow-accent/30"
      >
        <Phone size={18} strokeWidth={2.5} />
        <span className="whitespace-nowrap">전화 상담</span>
      </motion.a>
    </div>
  )
}

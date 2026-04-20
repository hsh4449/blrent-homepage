import { motion } from 'framer-motion'
import { Phone, Clock, MapPin, MessageCircle } from 'lucide-react'
import FAQ from '../components/support/FAQ'
import ContactForm from '../components/support/ContactForm'
import { faqs } from '../data/faq'

const PHONE = import.meta.env.VITE_PHONE_NUMBER || '1234-5678'
const KAKAO_URL = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/'

export default function SupportPage() {
  return (
    <div className="pt-20 md:pt-24 pb-20">
      {/* Hero */}
      <section className="px-4 sm:px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl md:text-4xl font-bold mb-3">고객센터</h1>
            <p className="text-text-secondary text-sm md:text-base">궁금한 점이 있으신가요? 자주 묻는 질문을 확인하시거나 상담 신청을 남겨주세요.</p>
          </motion.div>
        </div>
      </section>

      {/* Operating Hours Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 text-center">
            <Clock size={28} className="text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-sm mb-2">운영 시간</h3>
            <div className="text-text-secondary text-xs space-y-1">
              <p>평일 09:00 ~ 18:00</p>
              <p>토요일 09:00 ~ 13:00</p>
              <p className="text-text-muted">일요일/공휴일 휴무</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6 text-center">
            <Phone size={28} className="text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-sm mb-2">전화 상담</h3>
            <a href={`tel:${PHONE}`} className="text-accent font-bold text-xl hover:text-accent-hover transition-colors">{PHONE}</a>
            <p className="text-text-muted text-xs mt-2">운영 시간 내 상담 가능</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 text-center">
            <MessageCircle size={28} className="text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-sm mb-2">카카오톡 상담</h3>
            <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-2 bg-[#FEE500] text-[#191919] font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity">채팅 시작하기</a>
            <p className="text-text-muted text-xs mt-2">24시간 문의 가능</p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-xl md:text-2xl font-bold mb-6">자주 묻는 <span className="text-gradient">질문</span></h2>
          <FAQ items={faqs} />
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl md:text-2xl font-bold mb-6">상담 <span className="text-gradient">신청</span></h2>
          <ContactForm />
        </motion.div>
      </section>

      {/* Map Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="text-xl md:text-2xl font-bold mb-6">오시는 <span className="text-gradient">길</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl aspect-[4/3] flex items-center justify-center">
              <div className="text-center text-text-muted">
                <MapPin size={40} className="mx-auto mb-3 text-text-muted" />
                <p className="text-sm">지도 영역</p>
                <p className="text-xs mt-1">(추후 카카오맵/네이버맵 연동 예정)</p>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-sm mb-2">주소</h3>
                <p className="text-text-secondary text-sm">서울특별시 강남구 테헤란로 123<br />비엘모빌리티 사무실</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">교통 안내</h3>
                <ul className="text-text-secondary text-sm space-y-1">
                  <li>지하철 2호선 강남역 3번 출구 도보 5분</li>
                  <li>주차장 이용 가능 (건물 내 지하주차장)</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

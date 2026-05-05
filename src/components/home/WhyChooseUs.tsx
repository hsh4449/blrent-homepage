import { motion } from 'framer-motion'
import { TrendingDown, Zap, HeadphonesIcon, Wrench, BadgeCheck, CarFront } from 'lucide-react'

const items = [
  { icon: TrendingDown, title: '500여개 협력사 비교견적', desc: '다수의 렌트사 견적을 한 번에 비교해, 가장 유리한 조건으로 안내해드립니다.', span: 'md:col-span-2' },
  { icon: Zap, title: '무심사 즉시 출고', desc: '심사 없이 바로 출고 가능한 차량을 다수 보유하고 있습니다.', span: '' },
  { icon: HeadphonesIcon, title: '전담 매니저 1:1 케어', desc: '상담부터 출고, 반납까지 전 과정을 전담 매니저가 책임집니다.', span: '' },
  { icon: Wrench, title: '보험 올인원·직접 정비', desc: '보험 가입과 사고 처리는 원스톱으로 지원해드리고, 정비는 원하시는 정비소에서 직접 받으실 수 있습니다.', span: '' },
  { icon: BadgeCheck, title: '간편 심사', desc: '최소 서류, 빠른 심사. 탈락 시 재도전도 가능합니다.', span: '' },
  { icon: CarFront, title: '전 브랜드 취급', desc: '국산·수입 전 브랜드, 원하시는 차종을 찾아드립니다.', span: 'md:col-span-2' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-text-primary">
            왜 <span className="text-gradient">비엘모빌리티</span>인가요?
          </h2>
          <p className="text-text-secondary text-sm md:text-base">고객만족을 위한 차별화된 서비스를 제공합니다</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`bg-white rounded-2xl border border-gray-200 p-6 hover:border-accent/30 hover:shadow-sm transition-all duration-300 group cursor-default ${item.span}`}
            >
              <item.icon size={24} className="text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-base font-semibold mb-2 text-text-primary">{item.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import { reviews } from '../../data/reviews'

export default function ReviewPreview() {
  const latestReviews = reviews.slice(0, 4)

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold">출고 후기</h2>
          <Link to="/reviews" className="flex items-center gap-1 text-sm text-accent font-medium hover:underline">
            전체보기 <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-2xl p-5 hover:bg-white/[0.08] transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} size={14} className={si < review.rating ? 'text-accent fill-accent' : 'text-text-muted'} />
                ))}
              </div>
              <p className="text-sm text-text-secondary line-clamp-3 mb-4 leading-relaxed">
                "{review.content}"
              </p>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="font-medium text-text-primary">{review.customerName}</span>
                <span>{review.vehicleBrand} {review.vehicleModel}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

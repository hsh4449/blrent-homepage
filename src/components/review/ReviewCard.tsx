import { Star } from 'lucide-react'
import type { Review } from '../../types/review'

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="glass rounded-2xl overflow-hidden hover:bg-white/[0.08] transition-all duration-300">
      {review.image && (
        <div className="h-48 bg-bg-sub">
          <img src={review.image} alt={`${review.vehicleModel} 출고`} loading="lazy" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} className={i < review.rating ? 'text-accent fill-accent' : 'text-text-muted'} />
          ))}
          <span className="text-xs text-text-muted ml-1">{review.rating}.0</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent font-medium">
            {review.rentType === 'new' ? '신차' : review.rentType === 'used' ? '중고' : '월렌트'}
          </span>
          <span className="text-sm font-medium">{review.vehicleBrand} {review.vehicleModel}</span>
        </div>
        <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed mb-3">"{review.content}"</p>
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>{review.customerName}</span>
          <span>{review.deliveryDate}</span>
        </div>
      </div>
    </div>
  )
}

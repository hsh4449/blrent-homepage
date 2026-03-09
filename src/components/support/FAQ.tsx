import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import type { FAQItem } from '../../data/faq'

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="glass rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.03] transition-all"
          >
            <span className="text-sm font-medium pr-4">{item.question}</span>
            {openId === item.id ? <Minus size={18} className="text-accent flex-shrink-0" /> : <Plus size={18} className="text-text-muted flex-shrink-0" />}
          </button>
          <AnimatePresence>
            {openId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{item.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

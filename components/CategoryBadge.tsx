import { Category } from '@/lib/types'
import { CATEGORY_BG } from '@/lib/constants'

export default function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_BG[category]}`}>
      {category}
    </span>
  )
}

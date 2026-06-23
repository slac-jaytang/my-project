import { Category } from './types'

export const CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
]

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#22c55e',
  Transportation: '#3b82f6',
  Entertainment: '#a855f7',
  Shopping: '#ec4899',
  Bills: '#f97316',
  Other: '#6b7280',
}

export const CATEGORY_BG: Record<Category, string> = {
  Food: 'bg-green-100 text-green-800',
  Transportation: 'bg-blue-100 text-blue-800',
  Entertainment: 'bg-purple-100 text-purple-800',
  Shopping: 'bg-pink-100 text-pink-800',
  Bills: 'bg-orange-100 text-orange-800',
  Other: 'bg-gray-100 text-gray-800',
}

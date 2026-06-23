import { Expense } from '@/lib/types'
import { formatCurrency, getTotalSpend, getMonthlySpend, getTopCategory } from '@/lib/utils'
import { Card, CardContent } from './ui/Card'
import CategoryBadge from './CategoryBadge'
import { format } from 'date-fns'

interface SummaryCardsProps {
  expenses: Expense[]
}

export default function SummaryCards({ expenses }: SummaryCardsProps) {
  const totalSpend = getTotalSpend(expenses)
  const monthlySpend = getMonthlySpend(expenses)
  const topCategory = getTopCategory(expenses)
  const thisMonthCount = expenses.filter(e => {
    const d = new Date(e.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const cards = [
    {
      label: 'Total Spending',
      value: formatCurrency(totalSpend),
      sub: `${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`,
      icon: (
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
    },
    {
      label: `${format(new Date(), 'MMMM')} Spending`,
      value: formatCurrency(monthlySpend),
      sub: `${thisMonthCount} expense${thisMonthCount !== 1 ? 's' : ''} this month`,
      icon: (
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ),
    },
    {
      label: 'Top Category',
      value: topCategory ? <CategoryBadge category={topCategory} /> : '—',
      sub: topCategory ? 'Highest spending area' : 'No expenses yet',
      icon: (
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(card => (
        <Card key={card.label}>
          <CardContent className="flex items-start gap-4">
            {card.icon}
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.label}</p>
              <div className="text-xl font-bold text-gray-900 mt-0.5">{card.value}</div>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

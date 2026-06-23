'use client'

import Link from 'next/link'
import { useExpenses } from '@/lib/storage'
import SummaryCards from '@/components/SummaryCards'
import SpendingChart from '@/components/SpendingChart'
import CategoryBadge from '@/components/CategoryBadge'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const { expenses, loaded } = useExpenses()

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  const recent = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Your spending overview</p>
      </div>

      <SummaryCards expenses={expenses} />
      <SpendingChart expenses={expenses} />

      {/* Recent expenses */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Expenses</h3>
          <Link href="/expenses" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-400 text-sm">No expenses yet</p>
            <Link
              href="/expenses/new"
              className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Add your first expense →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recent.map(expense => (
              <li key={expense.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <CategoryBadge category={expense.category} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{expense.description}</p>
                    <p className="text-xs text-gray-400">{formatDate(expense.date)}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

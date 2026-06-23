import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { Expense, Category } from './types'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy')
}

export function formatMonth(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM yyyy')
}

export function getTotalSpend(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0)
}

export function getMonthlySpend(expenses: Expense[], date = new Date()): number {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return expenses
    .filter(e => isWithinInterval(parseISO(e.date), { start, end }))
    .reduce((sum, e) => sum + e.amount, 0)
}

export function getTopCategory(expenses: Expense[]): Category | null {
  if (!expenses.length) return null
  const totals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<Category, number>)
  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0] as Category
}

export function getMonthlyBreakdown(expenses: Expense[], months = 6): { month: string; total: number }[] {
  const result: { month: string; total: number }[] = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const start = startOfMonth(d)
    const end = endOfMonth(d)
    const total = expenses
      .filter(e => isWithinInterval(parseISO(e.date), { start, end }))
      .reduce((sum, e) => sum + e.amount, 0)
    result.push({ month: format(d, 'MMM yy'), total })
  }
  return result
}

export function getCategoryBreakdown(expenses: Expense[]): { category: Category; total: number }[] {
  const totals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<Category, number>)
  return Object.entries(totals)
    .map(([category, total]) => ({ category: category as Category, total }))
    .sort((a, b) => b.total - a.total)
}

export function exportToCSV(expenses: Expense[]): void {
  const header = 'Date,Amount,Category,Description'
  const rows = expenses.map(e =>
    `${e.date},${e.amount},${e.category},"${e.description.replace(/"/g, '""')}"`
  )
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

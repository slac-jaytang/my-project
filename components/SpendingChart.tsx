'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Expense } from '@/lib/types'
import { getMonthlyBreakdown, getCategoryBreakdown, formatCurrency } from '@/lib/utils'
import { CATEGORY_COLORS } from '@/lib/constants'
import { Card, CardHeader, CardContent } from './ui/Card'

interface SpendingChartProps {
  expenses: Expense[]
}

export default function SpendingChart({ expenses }: SpendingChartProps) {
  const monthly = getMonthlyBreakdown(expenses)
  const byCategory = getCategoryBreakdown(expenses)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Monthly Spending</h3>
          <p className="text-sm text-gray-500">Last 6 months</p>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">By Category</h3>
          <p className="text-sm text-gray-500">All time</p>
        </CardHeader>
        <CardContent>
          {byCategory.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {byCategory.map(entry => (
                    <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

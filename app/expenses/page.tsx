'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'
import { useExpenses } from '@/lib/storage'
import ExpenseList from '@/components/ExpenseList'
import ExportButton from '@/components/ExportButton'
import Toast from '@/components/Toast'
import Button from '@/components/ui/Button'

export default function ExpensesPage() {
  const { expenses, loaded, deleteExpense } = useExpenses()
  const [toast, setToast] = useState<string | null>(null)

  const handleDelete = useCallback((id: string) => {
    deleteExpense(id)
    setToast('Expense deleted')
  }, [deleteExpense])

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500 mt-1">{expenses.length} total expense{expenses.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton expenses={expenses} />
          <Link href="/expenses/new">
            <Button size="sm">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </Button>
          </Link>
        </div>
      </div>
      <ExpenseList expenses={expenses} onDelete={handleDelete} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

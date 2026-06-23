'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useExpenses } from '@/lib/storage'
import ExpenseForm from '@/components/ExpenseForm'
import Toast from '@/components/Toast'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export default function NewExpensePage() {
  const router = useRouter()
  const { addExpense } = useExpenses()
  const [toast, setToast] = useState(false)

  function handleSubmit(data: Parameters<typeof addExpense>[0]) {
    addExpense(data)
    setToast(true)
    setTimeout(() => router.push('/expenses'), 1000)
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
        <p className="text-sm text-gray-500 mt-1">Record a new expense</p>
      </div>
      <Card>
        <CardHeader>
          <h2 className="font-medium text-gray-900">Expense Details</h2>
        </CardHeader>
        <CardContent>
          <ExpenseForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
      {toast && <Toast message="Expense added!" onClose={() => setToast(false)} />}
    </div>
  )
}

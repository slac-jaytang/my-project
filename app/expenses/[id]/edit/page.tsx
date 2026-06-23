'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { useExpenses, ExpenseInput } from '@/lib/storage'
import ExpenseForm from '@/components/ExpenseForm'
import Toast from '@/components/Toast'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export default function EditExpensePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { getExpenseById, updateExpense, loaded } = useExpenses()
  const [toast, setToast] = useState(false)

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  const expense = getExpenseById(id)

  if (!expense) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Expense not found.</p>
        <button onClick={() => router.back()} className="mt-2 text-sm text-indigo-600 hover:underline">
          Go back
        </button>
      </div>
    )
  }

  function handleSubmit(data: ExpenseInput) {
    updateExpense(id, data)
    setToast(true)
    setTimeout(() => router.push('/expenses'), 1000)
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Expense</h1>
        <p className="text-sm text-gray-500 mt-1">Update expense details</p>
      </div>
      <Card>
        <CardHeader>
          <h2 className="font-medium text-gray-900">Expense Details</h2>
        </CardHeader>
        <CardContent>
          <ExpenseForm initialValues={expense} onSubmit={handleSubmit} isEdit />
        </CardContent>
      </Card>
      {toast && <Toast message="Expense updated!" onClose={() => setToast(false)} />}
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Expense, Category } from './types'

const STORAGE_KEY = 'expense-tracker-data'

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function loadExpenses(): Expense[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function persist(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}

export interface ExpenseInput {
  date: string
  amount: number
  category: Category
  description: string
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setExpenses(loadExpenses())
    setLoaded(true)
  }, [])

  const addExpense = useCallback((input: ExpenseInput): Expense => {
    const expense: Expense = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setExpenses(prev => {
      const next = [expense, ...prev]
      persist(next)
      return next
    })
    return expense
  }, [])

  const updateExpense = useCallback((id: string, data: Partial<ExpenseInput>): void => {
    setExpenses(prev => {
      const next = prev.map(e => (e.id === id ? { ...e, ...data } : e))
      persist(next)
      return next
    })
  }, [])

  const deleteExpense = useCallback((id: string): void => {
    setExpenses(prev => {
      const next = prev.filter(e => e.id !== id)
      persist(next)
      return next
    })
  }, [])

  const getExpenseById = useCallback(
    (id: string): Expense | undefined => expenses.find(e => e.id === id),
    [expenses]
  )

  return { expenses, loaded, addExpense, updateExpense, deleteExpense, getExpenseById }
}

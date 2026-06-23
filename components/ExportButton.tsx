'use client'

import { Expense } from '@/lib/types'
import { exportToCSV } from '@/lib/utils'
import Button from './ui/Button'

export default function ExportButton({ expenses }: { expenses: Expense[] }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => exportToCSV(expenses)}
      disabled={expenses.length === 0}
    >
      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export CSV
    </Button>
  )
}

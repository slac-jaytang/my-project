'use client'

import { useState, useMemo } from 'react'
import { Expense, Category } from '@/lib/types'
import { CATEGORIES, CATEGORY_BG } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type ExportFormat = 'csv' | 'json' | 'pdf'

interface ExportModalProps {
  expenses: Expense[]
  onClose: () => void
}

export default function ExportModal({ expenses, onClose }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set(CATEGORIES))
  const [filename, setFilename] = useState('expenses')
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    return expenses
      .filter(e => {
        if (!selectedCategories.has(e.category)) return false
        if (startDate && e.date < startDate) return false
        if (endDate && e.date > endDate) return false
        return true
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [expenses, selectedCategories, startDate, endDate])

  const totalAmount = useMemo(() => filtered.reduce((sum, e) => sum + e.amount, 0), [filtered])

  function toggleCategory(cat: Category) {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  function toggleAllCategories() {
    setSelectedCategories(
      selectedCategories.size === CATEGORIES.length ? new Set() : new Set(CATEGORIES)
    )
  }

  async function handleExport() {
    if (filtered.length === 0) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))

    const fname = filename.trim() || 'expenses'

    if (exportFormat === 'csv') {
      const header = 'Date,Category,Amount,Description'
      const rows = filtered.map(e =>
        [e.date, e.category, e.amount, `"${e.description.replace(/"/g, '""')}"`].join(',')
      )
      downloadBlob([header, ...rows].join('\n'), 'text/csv', `${fname}.csv`)
    } else if (exportFormat === 'json') {
      const data = filtered.map(({ id, date, amount, category, description, createdAt }) => ({
        id, date, amount, category, description, createdAt,
      }))
      downloadBlob(JSON.stringify(data, null, 2), 'application/json', `${fname}.json`)
    } else {
      exportPDF(filtered, fname)
    }

    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
            <p className="text-sm text-gray-500">Configure and download your expense data</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-lg p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* Format selector */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Export Format</p>
            <div className="grid grid-cols-3 gap-3">
              {(['csv', 'json', 'pdf'] as ExportFormat[]).map(f => (
                <button
                  key={f}
                  onClick={() => setExportFormat(f)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors ${
                    exportFormat === f
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <FormatIcon format={f} />
                  <span className="text-sm font-semibold uppercase">{f}</span>
                  <span className="text-xs text-gray-400 text-center leading-tight">
                    {f === 'csv' ? 'Spreadsheet' : f === 'json' ? 'Developer' : 'Print-ready'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Date Range</p>
            <div className="grid grid-cols-2 gap-3">
              <Input label="From" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              <Input label="To" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Category filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Categories</p>
              <button onClick={toggleAllCategories} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                {selectedCategories.size === CATEGORIES.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-opacity ${CATEGORY_BG[cat]} ${
                    selectedCategories.has(cat) ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Filename */}
          <Input
            label="File Name"
            value={filename}
            onChange={e => setFilename(e.target.value)}
            placeholder="expenses"
          />

          {/* Summary */}
          <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl">
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-gray-900">{filtered.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Records</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total Amount</p>
            </div>
          </div>

          {/* Preview table */}
          {filtered.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Preview{filtered.length > 5 ? ` — showing 5 of ${filtered.length}` : ''}
              </p>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Date', 'Category', 'Amount', 'Description'].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.slice(0, 5).map(e => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{formatDate(e.date)}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_BG[e.category]}`}>
                            {e.category}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                          {formatCurrency(e.amount)}
                        </td>
                        <td className="px-3 py-2 text-gray-600 truncate max-w-[140px]">{e.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400 py-2">No expenses match your filters.</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={loading || filtered.length === 0}>
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Exporting…
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export {filtered.length} record{filtered.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function FormatIcon({ format }: { format: ExportFormat }) {
  if (format === 'csv') {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18M10 3v18M14 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" />
      </svg>
    )
  }
  if (format === 'json') {
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  }
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function downloadBlob(content: string, type: string, filename: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function exportPDF(expenses: Expense[], filename: string) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const rows = expenses
    .map(
      e => `<tr>
        <td>${e.date}</td>
        <td>${e.category}</td>
        <td>$${e.amount.toFixed(2)}</td>
        <td>${e.description.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
      </tr>`
    )
    .join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>${filename}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; color: #111827; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    p { font-size: 13px; color: #6b7280; margin: 0 0 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #f3f4f6; text-align: left; padding: 9px 12px; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
    td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; }
    tfoot td { font-weight: 700; background: #f9fafb; border-top: 2px solid #e5e7eb; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>Expense Report</h1>
  <p>${expenses.length} record${expenses.length !== 1 ? 's' : ''} &nbsp;·&nbsp; Total: $${total.toFixed(2)}</p>
  <table>
    <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Description</th></tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr><td colspan="2">Total</td><td>$${total.toFixed(2)}</td><td></td></tr></tfoot>
  </table>
</body>
</html>`

  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.focus()
  w.print()
}

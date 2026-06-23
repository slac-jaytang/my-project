'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Expense, Category } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import CategoryBadge from './CategoryBadge'
import Button from './ui/Button'
import Input from './ui/Input'

const PAGE_SIZE = 10

type SortKey = 'date' | 'amount' | 'category'
type SortDir = 'asc' | 'desc'

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const [search, setSearch] = useState('')
  const [filterCategories, setFilterCategories] = useState<Category[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function toggleCategory(cat: Category) {
    setFilterCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
    setPage(1)
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = useMemo(() => {
    return expenses
      .filter(e => {
        if (search && !e.description.toLowerCase().includes(search.toLowerCase())) return false
        if (filterCategories.length && !filterCategories.includes(e.category)) return false
        if (dateFrom && e.date < dateFrom) return false
        if (dateTo && e.date > dateTo) return false
        return true
      })
      .sort((a, b) => {
        let cmp = 0
        if (sortKey === 'date') cmp = a.date.localeCompare(b.date)
        else if (sortKey === 'amount') cmp = a.amount - b.amount
        else if (sortKey === 'category') cmp = a.category.localeCompare(b.category)
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [expenses, search, filterCategories, dateFrom, dateTo, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="text-indigo-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <Input
          placeholder="Search descriptions..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                filterCategories.includes(cat)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
              }`}
            >
              {cat}
            </button>
          ))}
          {filterCategories.length > 0 && (
            <button
              onClick={() => setFilterCategories([])}
              className="px-3 py-1 rounded-full text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex gap-3 flex-wrap">
          <Input
            type="date"
            label="From"
            value={dateFrom}
            onChange={e => { setDateFrom(e.target.value); setPage(1) }}
            className="w-auto"
          />
          <Input
            type="date"
            label="To"
            value={dateTo}
            onChange={e => { setDateTo(e.target.value); setPage(1) }}
            className="w-auto"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo('') }}
              className="self-end mb-0.5 text-xs text-gray-500 hover:text-gray-700"
            >
              Clear dates
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-medium">No expenses found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <button onClick={() => handleSort('date')} className="flex items-center hover:text-gray-700">
                        Date <SortIcon col="date" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <button onClick={() => handleSort('category')} className="flex items-center hover:text-gray-700">
                        Category <SortIcon col="category" />
                      </button>
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <button onClick={() => handleSort('amount')} className="flex items-center ml-auto hover:text-gray-700">
                        Amount <SortIcon col="amount" />
                      </button>
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map(expense => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {expense.description}
                      </td>
                      <td className="px-4 py-3">
                        <CategoryBadge category={expense.category} />
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <Link href={`/expenses/${expense.id}/edit`}>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </Link>
                          {deleteId === expense.id ? (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => { onDelete(expense.id); setDeleteId(null) }}
                              >
                                Confirm
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => setDeleteId(expense.id)}>
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

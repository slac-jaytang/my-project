'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Expense } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'
import Input from './ui/Input'
import Select from './ui/Select'
import Button from './ui/Button'

const schema = z.object({
  date: z.string().min(1, 'Date is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  category: z.enum(['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other']),
  description: z.string().min(1, 'Description is required').max(200, 'Max 200 characters'),
})

type FormValues = z.infer<typeof schema>

interface ExpenseFormProps {
  initialValues?: Partial<Expense>
  onSubmit: (data: FormValues) => void
  isEdit?: boolean
}

export default function ExpenseForm({ initialValues, onSubmit, isEdit }: ExpenseFormProps) {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: initialValues?.date ?? today,
      amount: initialValues?.amount,
      category: initialValues?.category ?? 'Food',
      description: initialValues?.description ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Date"
          type="date"
          id="date"
          max={today}
          error={errors.date?.message}
          {...register('date')}
        />
        <Input
          label="Amount ($)"
          type="number"
          id="amount"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
        />
      </div>
      <Select
        label="Category"
        id="category"
        options={CATEGORIES.map(c => ({ value: c, label: c }))}
        error={errors.category?.message}
        {...register('category')}
      />
      <Input
        label="Description"
        type="text"
        id="description"
        placeholder="What did you spend on?"
        error={errors.description?.message}
        {...register('description')}
      />
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none">
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Expense' : 'Add Expense'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

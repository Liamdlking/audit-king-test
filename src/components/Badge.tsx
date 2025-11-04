import React from 'react'

type Variant = 'gray' | 'green' | 'blue' | 'amber' | 'red'
const classes: Record<Variant, string> = {
  gray: 'bg-gray-100 text-gray-700',
  green: 'bg-emerald-100 text-emerald-700',
  blue:  'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  red:   'bg-rose-100 text-rose-700',
}

export default function Badge({ children, variant = 'gray' }:{ children: React.ReactNode; variant?: Variant }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${classes[variant]}`}>{children}</span>
}

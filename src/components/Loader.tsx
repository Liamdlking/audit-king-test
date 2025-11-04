import React from 'react'

export default function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <div className="h-2 w-2 rounded-full bg-royal-600 animate-pulse" />
      {label}
    </div>
  )
}

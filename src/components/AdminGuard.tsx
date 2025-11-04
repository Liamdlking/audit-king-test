import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import { getMyProfile } from '@/utils/db'

export default function AdminGuard({ children }:{ children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const p = await getMyProfile()
        if (!p) { setIsAdmin(false); setReady(true); setLoading(false); return }
        setIsAdmin(!!p.is_admin && !p.is_banned)
        setReady(true)
      } catch {
        // Profiles table may not yet exist — allow non-admin by default until SQL is run
        setIsAdmin(false)
        setReady(true)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="p-4"><Loader label="Checking admin…" /></div>
  if (!ready) return null
  if (!isAdmin) return <div className="p-4 text-rose-600">Not authorised. Admins only.</div>
  return <>{children}</>
}

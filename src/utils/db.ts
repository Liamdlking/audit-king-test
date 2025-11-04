import { supabase } from './supabaseClient'
import type { Profile, Site, Template, Inspection, ActionItem } from './types'

function must() {
  if (!supabase) throw new Error('Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

/** Profiles */
export async function getMyProfile(): Promise<Profile | null> {
  must()
  const { data: sess } = await supabase!.auth.getUser()
  const uid = sess.user?.id
  if (!uid) return null
  const { data, error } = await supabase!.from('profiles')
    .select('user_id,email,name,role,is_admin,is_banned,site_access')
    .eq('user_id', uid).maybeSingle()
  if (error) throw error
  return (data ?? null) as Profile | null
}

export async function listUsers(): Promise<Profile[]> {
  must()
  const { data, error } = await supabase!.from('profiles')
    .select('user_id,email,name,role,is_admin,is_banned,site_access')
    .order('email', { ascending: true })
  if (error) throw error
  return (data ?? []) as Profile[]
}

export async function updateUserProfile(user_id: string, patch: Partial<Profile>): Promise<void> {
  must()
  const { error } = await supabase!.from('profiles').update(patch).eq('user_id', user_id)
  if (error) throw error
}

/** Sites */
export async function listSites(): Promise<Site[]> {
  must()
  const { data, error } = await supabase!.from('sites').select('*').order('name')
  if (error) throw error
  return (data ?? []) as Site[]
}

export async function createSite(payload: Pick<Site, 'name' | 'location'>): Promise<Site> {
  must()
  const { data, error } = await supabase!.from('sites').insert(payload).select('*').single()
  if (error) throw error
  return data as Site
}

export async function updateSite(id: string, patch: Partial<Site>): Promise<void> {
  must()
  const { error } = await supabase!.from('sites').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteSite(id: string): Promise<void> {
  must()
  const { error } = await supabase!.from('sites').delete().eq('id', id)
  if (error) throw error
}

/** Templates */
export async function listTemplates(siteId?: string): Promise<Template[]> {
  must()
  let q = supabase!.from('templates').select('*').order('updated_at', { ascending: false })
  if (siteId) q = q.contains('site_ids', [siteId])
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as Template[]
}

export async function createTemplate(payload: Omit<Template, 'id' | 'updated_at'>): Promise<Template> {
  must()
  const { data, error } = await supabase!.from('templates').insert(payload).select('*').single()
  if (error) throw error
  return data as Template
}

export async function updateTemplate(id: string, patch: Partial<Template>): Promise<void> {
  must()
  const { error } = await supabase!.from('templates').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteTemplate(id: string): Promise<void> {
  must()
  const { error } = await supabase!.from('templates').delete().eq('id', id)
  if (error) throw error
}

/** Inspections */
export async function listInspections(params?: { siteId?: string; ownerId?: string }): Promise<Inspection[]> {
  must()
  let q = supabase!.from('inspections').select('*').order('submitted_at', { ascending: false }).order('started_at', { ascending: false })
  if (params?.siteId) q = q.eq('site_id', params.siteId)
  if (params?.ownerId) q = q.eq('owner_id', params.ownerId)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as Inspection[]
}

export async function createInspection(payload: Omit<Inspection, 'id'>): Promise<Inspection> {
  must()
  const { data, error } = await supabase!.from('inspections').insert(payload).select('*').single()
  if (error) throw error
  return data as Inspection
}

export async function updateInspection(id: string, patch: Partial<Inspection>): Promise<void> {
  must()
  const { error } = await supabase!.from('inspections').update(patch).eq('id', id)
  if (error) throw error
}

/** Actions */
export async function listActions(): Promise<ActionItem[]> {
  must()
  const { data, error } = await supabase!.from('actions').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as ActionItem[]
}

export async function createAction(payload: Omit<ActionItem, 'id'>): Promise<ActionItem> {
  must()
  const { data, error } = await supabase!.from('actions').insert(payload).select('*').single()
  if (error) throw error
  return data as ActionItem
}

export async function updateAction(id: string, patch: Partial<ActionItem>): Promise<void> {
  must()
  const { error } = await supabase!.from('actions').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteAction(id: string): Promise<void> {
  must()
  const { error } = await supabase!.from('actions').delete().eq('id', id)
  if (error) throw error
}

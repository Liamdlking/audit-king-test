import { supabase } from './supabaseClient'

const BUCKET = 'auditking-files'

/** Uploads a File (image/signature/logo) to Supabase Storage and returns the public URL. */
export async function uploadPublicFile(path: string, file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured')
  // Ensure bucket exists (idempotent: if policy blocks, you’ll set it in SQL in Block 6)
  try { await supabase.storage.createBucket(BUCKET, { public: true }) } catch {}
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true })
  if (error) throw error
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
  return pub.publicUrl
}

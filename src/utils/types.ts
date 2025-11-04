export type Role = 'admin' | 'manager' | 'inspector'

export interface Profile {
  user_id: string
  email: string | null
  name: string | null
  role: Role
  is_admin: boolean
  is_banned: boolean
  site_access: string[] | null
}

export interface Site {
  id: string
  name: string
  location?: string | null
  created_at?: string
}

export type QType = 'yesno' | 'na' | 'gfp' | 'multichoice' | 'text' | 'number' | 'date' | 'photo' | 'signature'

export interface TemplateItem {
  id: string
  type: QType
  label: string
  required?: boolean
  options?: string[] // for multichoice (comma-separated in UI)
  instructions?: string | null
  image_url?: string | null
}

export interface Template {
  id: string
  name: string
  description?: string | null
  site_ids: string[] // assign to one or many sites
  items: TemplateItem[]
  logo_url?: string | null
  published: boolean
  updated_at?: string
  created_by?: string | null
}

export interface InspectionItemAnswer {
  item_id: string
  value?: string | number | boolean | null
  pass?: boolean | null
  note?: string | null
  photo_urls?: string[] | null
}

export interface Inspection {
  id: string
  template_id: string
  template_name: string
  site_id: string
  status: 'in_progress' | 'submitted'
  score?: number | null
  answers: InspectionItemAnswer[]
  started_at: string
  submitted_at?: string | null
  owner_id: string
  owner_name?: string | null
}

export interface ActionItem {
  id: string
  title: string
  inspection_id: string
  item_id?: string | null
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'verified'
  due_date?: string | null
  assignee?: string | null
  created_at?: string
  owner_id?: string | null
}

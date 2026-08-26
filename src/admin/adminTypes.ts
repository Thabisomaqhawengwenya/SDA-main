// ── Shared status types ───────────────────────────────────────────────────────

export type PublishStatus = 'draft' | 'scheduled' | 'published' | 'archived'
export type PrayerStatus = 'new' | 'praying' | 'answered' | 'archived'
export type MessageStatus = 'new' | 'read' | 'replied' | 'archived'
export type EventStatus = 'draft' | 'published' | 'cancelled'
export type MemberStatus = 'active' | 'inactive' | 'visitor'
export type UserRole = 'super_admin' | 'pastor' | 'media' | 'events' | 'editor' | 'finance'

// ── Data models ───────────────────────────────────────────────────────────────

export interface AdminEvent {
  id: string
  title: string
  date: string
  time: string
  endTime?: string
  location: string
  category: string
  categoryColor: string
  description: string
  image?: string
  status: EventStatus
  recurring?: boolean
  speaker?: string
  registrationLink?: string
  createdAt: string
}

export interface Announcement {
  id: string
  title: string
  description: string
  category: 'general' | 'news' | 'urgent' | 'ministry'
  author: string
  status: PublishStatus
  featured: boolean
  publishDate: string
  createdAt: string
}

export interface Sermon {
  id: string
  title: string
  speaker: string
  date: string
  scripture: string
  description: string
  category: string
  videoUrl?: string
  audioUrl?: string
  thumbnail?: string
  views: number
  status: PublishStatus
  duration?: string
}

export interface Livestream {
  id: string
  title: string
  date: string
  time: string
  youtubeUrl?: string
  facebookUrl?: string
  tiktokUrl?: string
  thumbnail?: string
  description: string
  status: 'upcoming' | 'live' | 'past'
}

export interface Ministry {
  id: string
  name: string
  description: string
  leader: string
  contact: string
  schedule: string
  image?: string
  memberCount: number
  status: 'active' | 'inactive'
}

export interface ChurchService {
  id: string
  name: string
  day: string
  time: string
  description: string
  speaker?: string
  livestreamLink?: string
  recurring: boolean
}

export interface PrayerRequest {
  id: string
  name: string
  request: string
  category: string
  status: PrayerStatus
  assignedTo?: string
  isPrivate: boolean
  submittedAt: string
}

export interface ContactMessage {
  id: string
  sender: string
  email: string
  subject: string
  message: string
  status: MessageStatus
  receivedAt: string
  isImportant: boolean
}

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  status: MemberStatus
  ministries: string[]
  joinDate: string
  smallGroup?: string
}

export interface Donation {
  id: string
  donor: string
  amount: number
  category: string
  date: string
  method: string
  isAnonymous: boolean
}

export interface Leader {
  id: string
  name: string
  position: string
  bio: string
  email: string
  photo?: string
  socialLinks?: { platform: string; url: string }[]
}

export interface ActivityLog {
  id: string
  user: string
  action: string
  resource: string
  timestamp: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  lastActive: string
  status: 'active' | 'inactive'
}

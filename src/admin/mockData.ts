import type {
  AdminEvent, Announcement, Sermon, Livestream, Ministry,
  ChurchService, PrayerRequest, ContactMessage, Member,
  Donation, Leader, ActivityLog, AdminUser,
} from './adminTypes'

// ── Events ────────────────────────────────────────────────────────────────────
export const mockEvents: AdminEvent[] = [
  { id: 'e1', title: 'Virtual Bible Studies on Zoom', date: '2026-07-21', time: '7:00 PM', location: 'Zoom', category: 'Bible Study', categoryColor: '#3b82f6', description: 'Weekly Tuesday night Bible study via Zoom.', status: 'published', recurring: true, createdAt: '2026-07-01' },
  { id: 'e2', title: 'Prayer and Fasting Series', date: '2026-07-23', time: '8:00 PM', endTime: '6:00 PM', location: 'Main Sanctuary', category: 'Prayer & Fasting', categoryColor: '#8b5cf6', description: 'Corporate prayer and fasting series.', status: 'published', recurring: true, createdAt: '2026-07-01' },
  { id: 'e3', title: 'Youth Sabbath Program', date: '2026-08-22', time: '11:30 AM', location: 'Main Sanctuary', category: 'Youth', categoryColor: '#f59e0b', description: 'Youth-led worship service.', status: 'published', speaker: 'Youth Leaders', createdAt: '2026-07-15' },
  { id: 'e4', title: 'Community Health Fair', date: '2026-08-29', time: '9:00 AM', endTime: '2:00 PM', location: 'Church Grounds', category: 'Community', categoryColor: '#ef4444', description: 'Free health screenings for the community.', status: 'draft', createdAt: '2026-07-20' },
  { id: 'e5', title: 'Boundaries Book Group Discussion', date: '2026-08-08', time: '10:00 AM', location: 'Fellowship Hall', category: 'Book Group', categoryColor: '#10b981', description: 'Healthy boundaries book discussion.', status: 'published', createdAt: '2026-07-18' },
  { id: 'e6', title: 'Pathfinder Investiture Ceremony', date: '2026-09-05', time: '3:00 PM', location: 'Main Sanctuary', category: 'Youth', categoryColor: '#f59e0b', description: 'Annual Pathfinder investiture ceremony.', status: 'draft', createdAt: '2026-07-22' },
]

// ── Announcements ─────────────────────────────────────────────────────────────
export const mockAnnouncements: Announcement[] = [
  { id: 'a1', title: 'Welcome to Our New Website', description: 'We are excited to launch our new church website. Explore our ministries and events.', category: 'general', author: 'Admin', status: 'published', featured: true, publishDate: '2026-07-01', createdAt: '2026-06-28' },
  { id: 'a2', title: 'Baptism Service This Sabbath', description: 'Join us this Saturday for a special baptism service at 11:30 AM in the main sanctuary.', category: 'news', author: 'Pastor Ngwenya', status: 'published', featured: true, publishDate: '2026-07-18', createdAt: '2026-07-15' },
  { id: 'a3', title: 'Church Roofing Project Update', description: 'Phase 1 of the roofing project is now complete. Thank you to all who contributed.', category: 'news', author: 'Church Board', status: 'published', featured: false, publishDate: '2026-07-10', createdAt: '2026-07-08' },
  { id: 'a4', title: 'Urgent: Prayer Chain Activated', description: 'Please join our prayer chain for a member in need. Contact the church office for details.', category: 'urgent', author: 'Admin', status: 'published', featured: false, publishDate: '2026-07-20', createdAt: '2026-07-20' },
  { id: 'a5', title: 'Youth Ministry Camp Registration', description: 'Registration for the annual youth camp is now open. Spaces are limited.', category: 'ministry', author: 'Youth Ministry', status: 'draft', featured: false, publishDate: '2026-08-01', createdAt: '2026-07-21' },
]

// ── Sermons ───────────────────────────────────────────────────────────────────
export const mockSermons: Sermon[] = [
  { id: 's1', title: 'The God Who Sees You', speaker: 'Pastor Ngwenya', date: '2026-07-19', scripture: 'Genesis 16:13', description: 'A message of hope for those who feel unseen and forgotten.', category: 'Hope', views: 342, status: 'published', duration: '45 min', thumbnail: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&q=80' },
  { id: 's2', title: 'Walking by Faith', speaker: 'Pastor Ngwenya', date: '2026-07-12', scripture: '2 Corinthians 5:7', description: 'Understanding what it means to trust God in uncertain times.', category: 'Faith', views: 289, status: 'published', duration: '52 min', thumbnail: 'https://images.unsplash.com/photo-1476725994324-6f756b28af53?w=400&q=80' },
  { id: 's3', title: 'The Power of Prayer', speaker: 'Elder Moyo', date: '2026-07-05', scripture: 'James 5:16', description: 'Discovering the transformative power of a consistent prayer life.', category: 'Prayer', views: 198, status: 'published', duration: '38 min' },
  { id: 's4', title: 'Sabbath: A Gift Not a Burden', speaker: 'Pastor Ngwenya', date: '2026-06-28', scripture: 'Mark 2:27', description: 'Understanding the Sabbath as a blessing and a sign of our relationship with God.', category: 'Doctrine', views: 415, status: 'published', duration: '49 min' },
  { id: 's5', title: 'Our Hope in the Second Coming', speaker: 'Guest Speaker', date: '2026-06-21', scripture: 'John 14:1-3', description: 'A powerful exploration of the blessed hope of Christ\'s return.', category: 'Prophecy', views: 521, status: 'published', duration: '55 min' },
  { id: 's6', title: 'Stewardship and Giving', speaker: 'Pastor Ngwenya', date: '2026-07-26', scripture: 'Malachi 3:10', description: 'Understanding biblical principles of financial stewardship.', category: 'Stewardship', views: 0, status: 'draft', duration: '41 min' },
]

// ── Livestreams ───────────────────────────────────────────────────────────────
export const mockLivestreams: Livestream[] = [
  { id: 'l1', title: 'Sabbath Morning Worship', date: '2026-08-01', time: '11:30 AM', youtubeUrl: 'https://youtube.com/emganwinisda', facebookUrl: 'https://facebook.com/emganwinisda', description: 'Weekly Sabbath morning worship service.', status: 'upcoming' },
  { id: 'l2', title: 'Youth Sabbath Program', date: '2026-08-22', time: '11:30 AM', youtubeUrl: 'https://youtube.com/emganwinisda', description: 'Youth-led worship and program.', status: 'upcoming' },
  { id: 'l3', title: 'Sabbath Morning Worship - Jul 19', date: '2026-07-19', time: '11:30 AM', youtubeUrl: 'https://youtube.com/watch?v=example1', description: 'Weekly Sabbath morning worship service.', status: 'past' },
  { id: 'l4', title: 'Special Prayer Service', date: '2026-07-12', time: '7:00 PM', youtubeUrl: 'https://youtube.com/watch?v=example2', description: 'Special midweek prayer service.', status: 'past' },
]

// ── Ministries ────────────────────────────────────────────────────────────────
export const mockMinistries: Ministry[] = [
  { id: 'm1', name: 'Youth Ministry', description: 'Empowering young people to grow in faith and leadership.', leader: 'Bro. Dube', contact: 'youth@emganwinisda.org', schedule: 'Every Sabbath, AYS 1st & 3rd Sabbath', memberCount: 45, status: 'active' },
  { id: 'm2', name: "Women's Ministry", description: 'Supporting and empowering women in their spiritual journey.', leader: 'Sis. Ncube', contact: 'women@emganwinisda.org', schedule: 'Second Sabbath after service', memberCount: 62, status: 'active' },
  { id: 'm3', name: "AMO – Men's Organisation", description: 'Building godly men for the church and community.', leader: 'Bro. Moyo', contact: 'amo@emganwinisda.org', schedule: 'First Sabbath after service', memberCount: 38, status: 'active' },
  { id: 'm4', name: "Children's Ministry", description: 'Nurturing children in the love and knowledge of God.', leader: 'Sis. Sibanda', contact: 'children@emganwinisda.org', schedule: 'Every Sabbath from 9:00 AM', memberCount: 54, status: 'active' },
  { id: 'm5', name: 'Community Services', description: 'Serving our community through outreach and assistance.', leader: 'Bro. Ndlovu', contact: 'outreach@emganwinisda.org', schedule: 'Every second Saturday', memberCount: 28, status: 'active' },
  { id: 'm6', name: 'Health Ministry', description: 'Promoting wholistic health and wellness in our community.', leader: 'Dr. Mpofu', contact: 'health@emganwinisda.org', schedule: 'First Sabbath health fair', memberCount: 22, status: 'active' },
]

// ── Services ──────────────────────────────────────────────────────────────────
export const mockServices: ChurchService[] = [
  { id: 'sv1', name: 'Sabbath School', day: 'Saturday', time: '09:00 AM', description: 'Bible study and discussion for all ages.', speaker: 'Various Teachers', recurring: true },
  { id: 'sv2', name: 'Divine Worship Service', day: 'Saturday', time: '11:30 AM', description: 'Main worship service with sermon, music, and prayer.', speaker: 'Pastor Ngwenya', recurring: true, livestreamLink: 'https://youtube.com/emganwinisda' },
  { id: 'sv3', name: 'Afternoon Service', day: 'Saturday', time: '3:00 PM', description: 'Afternoon devotional and fellowship.', recurring: true },
  { id: 'sv4', name: 'Prayer Meeting', day: 'Wednesday', time: '7:00 PM', description: 'Midweek prayer and Bible study.', recurring: true },
]

// ── Prayer Requests ───────────────────────────────────────────────────────────
export const mockPrayerRequests: PrayerRequest[] = [
  { id: 'pr1', name: 'Anonymous', request: 'Please pray for healing for my family member who is ill in hospital.', category: 'Health', status: 'new', isPrivate: true, submittedAt: '2026-07-24T08:30:00' },
  { id: 'pr2', name: 'T. Moyo', request: 'Praying for guidance in my career change. Seeking God\'s direction.', category: 'Guidance', status: 'praying', assignedTo: 'Prayer Team', isPrivate: false, submittedAt: '2026-07-22T14:15:00' },
  { id: 'pr3', name: 'Anonymous', request: 'Please pray for my marriage. We are going through a difficult time.', category: 'Family', status: 'praying', assignedTo: 'Elder Moyo', isPrivate: true, submittedAt: '2026-07-20T09:00:00' },
  { id: 'pr4', name: 'S. Dube', request: 'Praise God! My sister has recovered fully. Thank you for your prayers.', category: 'Health', status: 'answered', isPrivate: false, submittedAt: '2026-07-10T11:00:00' },
  { id: 'pr5', name: 'Anonymous', request: 'Pray for my job situation. I have been unemployed for 6 months.', category: 'Financial', status: 'new', isPrivate: true, submittedAt: '2026-07-25T16:45:00' },
]

// ── Contact Messages ──────────────────────────────────────────────────────────
export const mockMessages: ContactMessage[] = [
  { id: 'msg1', sender: 'John Doe', email: 'john@example.com', subject: 'Visiting this Saturday', message: 'Hi, I would like to visit your church this Saturday. What should I expect? Is there parking available?', status: 'new', receivedAt: '2026-07-25T09:12:00', isImportant: false },
  { id: 'msg2', sender: 'Mary Smith', email: 'mary@example.com', subject: 'Baptism enquiry', message: 'I am interested in being baptised. Could you please let me know the process and who to speak to?', status: 'new', receivedAt: '2026-07-24T14:30:00', isImportant: true },
  { id: 'msg3', sender: 'David Banda', email: 'david@example.com', subject: 'Youth program question', message: 'My son is 16 years old. Can he join the youth ministry? What activities do you have?', status: 'read', receivedAt: '2026-07-23T11:00:00', isImportant: false },
  { id: 'msg4', sender: 'Grace Moyo', email: 'grace@example.com', subject: 'Prayer request follow-up', message: 'Thank you for praying for my family. I wanted to share that things have improved greatly.', status: 'replied', receivedAt: '2026-07-20T08:45:00', isImportant: false },
  { id: 'msg5', sender: 'Pastor Kamau', email: 'kamau@church.org', subject: 'Pulpit exchange opportunity', message: 'Greetings from Harare Central SDA Church. We would like to propose a pulpit exchange program.', status: 'new', receivedAt: '2026-07-22T15:00:00', isImportant: true },
]

// ── Members ───────────────────────────────────────────────────────────────────
export const mockMembers: Member[] = [
  { id: 'mb1', name: 'Pastor Ngwenya', email: 'pastor@emganwinisda.org', phone: '+263 77 123 4567', status: 'active', ministries: ['Leadership'], joinDate: '2015-01-01' },
  { id: 'mb2', name: 'Sister Ncube', email: 'ncube@example.com', phone: '+263 71 234 5678', status: 'active', ministries: ["Women's Ministry"], joinDate: '2018-03-15', smallGroup: 'Group A' },
  { id: 'mb3', name: 'Brother Dube', email: 'dube@example.com', phone: '+263 73 345 6789', status: 'active', ministries: ['Youth Ministry', 'Pathfinder'], joinDate: '2019-06-01', smallGroup: 'Group B' },
  { id: 'mb4', name: 'Dr. Mpofu', email: 'mpofu@example.com', phone: '+263 77 456 7890', status: 'active', ministries: ['Health Ministry'], joinDate: '2017-09-10' },
  { id: 'mb5', name: 'Jane Visitor', email: 'jane@example.com', phone: '+263 78 567 8901', status: 'visitor', ministries: [], joinDate: '2026-07-01' },
]

// ── Donations ─────────────────────────────────────────────────────────────────
export const mockDonations: Donation[] = [
  { id: 'd1', donor: 'Anonymous', amount: 50, category: 'Tithe', date: '2026-07-19', method: 'Online', isAnonymous: true },
  { id: 'd2', donor: 'T. Moyo', amount: 25, category: 'Building Fund', date: '2026-07-19', method: 'Online', isAnonymous: false },
  { id: 'd3', donor: 'Anonymous', amount: 100, category: 'Tithe', date: '2026-07-12', method: 'Online', isAnonymous: true },
  { id: 'd4', donor: 'S. Ncube', amount: 15, category: 'Community Outreach', date: '2026-07-12', method: 'Online', isAnonymous: false },
  { id: 'd5', donor: 'Anonymous', amount: 200, category: 'Building Fund', date: '2026-07-05', method: 'Online', isAnonymous: true },
  { id: 'd6', donor: 'D. Banda', amount: 30, category: 'Tithe', date: '2026-07-05', method: 'Online', isAnonymous: false },
]

// ── Leaders ───────────────────────────────────────────────────────────────────
export const mockLeaders: Leader[] = [
  { id: 'ld1', name: 'Pastor Ngwenya', position: 'Senior Pastor', bio: 'Pastor Ngwenya has been serving the Emganwini Main SDA Church for over 10 years, bringing a passion for evangelism and community development.', email: 'pastor@emganwinisda.org' },
  { id: 'ld2', name: 'Elder Moyo', position: 'Head Elder', bio: 'Elder Moyo has been a faithful member and leader of the church for 20 years, overseeing spiritual care and church governance.', email: 'elder@emganwinisda.org' },
  { id: 'ld3', name: 'Deacon Dube', position: 'Head Deacon', bio: 'Deacon Dube coordinates the church\'s hospitality and practical ministry, ensuring every visitor feels welcomed and valued.', email: 'deacon@emganwinisda.org' },
  { id: 'ld4', name: 'Sister Ncube', position: "Women's Ministry Leader", bio: 'Sister Ncube leads the Women\'s Ministry with a heart for mentorship and community service.', email: 'women@emganwinisda.org' },
]

// ── Activity Log ──────────────────────────────────────────────────────────────
export const mockActivityLog: ActivityLog[] = [
  { id: 'al1', user: 'Admin', action: 'Published', resource: 'Event: Youth Sabbath Program', timestamp: '2026-07-25T10:42:00' },
  { id: 'al2', user: 'Pastor Ngwenya', action: 'Uploaded', resource: 'Sermon: The God Who Sees You', timestamp: '2026-07-25T09:31:00' },
  { id: 'al3', user: 'Admin', action: 'Created', resource: 'Announcement: Baptism Service This Sabbath', timestamp: '2026-07-24T16:15:00' },
  { id: 'al4', user: 'Media Team', action: 'Scheduled', resource: 'Livestream: Sabbath Morning Worship', timestamp: '2026-07-24T14:00:00' },
  { id: 'al5', user: 'Admin', action: 'Updated', resource: 'Ministry: Youth Ministry', timestamp: '2026-07-23T11:30:00' },
  { id: 'al6', user: 'Content Editor', action: 'Drafted', resource: 'Announcement: Youth Ministry Camp Registration', timestamp: '2026-07-23T09:00:00' },
  { id: 'al7', user: 'Pastor Ngwenya', action: 'Replied', resource: 'Message from Mary Smith', timestamp: '2026-07-22T15:45:00' },
  { id: 'al8', user: 'Admin', action: 'Archived', resource: 'Prayer Request #pr4', timestamp: '2026-07-21T08:00:00' },
]

// ── Admin Users ───────────────────────────────────────────────────────────────
export const mockAdminUsers: AdminUser[] = [
  { id: 'u1', name: 'Thabiso Maqhawe Ngwenya', email: 'thabisomaqhawengwenya@gmail.com', role: 'super_admin', lastActive: '2026-09-21T10:45:00', status: 'active' },
  { id: 'u2', name: 'Pastor Ngwenya', email: 'pastor@emganwinisda.org', role: 'pastor', lastActive: '2026-07-25T09:31:00', status: 'active' },
  { id: 'u3', name: 'Media Team', email: 'media@emganwinisda.org', role: 'media', lastActive: '2026-07-24T14:00:00', status: 'active' },
  { id: 'u4', name: 'Content Editor', email: 'editor@emganwinisda.org', role: 'editor', lastActive: '2026-07-23T09:00:00', status: 'active' },
  { id: 'u5', name: 'Finance Officer', email: 'finance@emganwinisda.org', role: 'finance', lastActive: '2026-07-20T11:00:00', status: 'active' },
]

// ── Dashboard stats ───────────────────────────────────────────────────────────
export const dashboardStats = {
  totalMembers: 218,
  upcomingEvents: 6,
  prayerRequests: 5,
  contactMessages: 5,
  publishedSermons: 5,
  upcomingLivestreams: 2,
  totalDonationsMonth: 420,
  newMessages: 3,
}

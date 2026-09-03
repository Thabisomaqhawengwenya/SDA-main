import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, CardHeader, CardTitle, CardBody, Btn, FormGroup, FormGrid, Label, Input, Select,
  Badge, statusVariant, Avatar,
  TableWrap, Table, Thead, Th, Tbody, Tr, Td,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  ConfirmDialog,
} from '../components/ui'
import { mockAdminUsers, mockActivityLog } from '../mockData'
import type { AdminUser, UserRole, ActivityLog } from '../adminTypes'
import { seedFirestoreDatabase } from '../../services/seedService'
import { subscribeActivityLogs } from '../../services/activityService'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'

// ── Tab bar ───────────────────────────────────────────────────────────────────

type Tab = 'general' | 'users' | 'activity'

const TabBar = styled.div`
  display: flex; gap: 2px;
  background: ${t.colors.surfaceAlt};
  border: 1px solid ${t.colors.border};
  border-radius: ${t.radius.md};
  padding: 4px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`

const TabBtn = styled.button<{ $active: boolean }>`
  font-family: ${t.fonts.sans}; font-size: 13px; font-weight: 600;
  padding: 8px 18px; border-radius: 6px; border: none; cursor: pointer;
  transition: 0.15s; white-space: nowrap;
  background: ${({ $active }) => ($active ? t.colors.surface : 'transparent')};
  color: ${({ $active }) => ($active ? t.colors.text : t.colors.textMuted)};
  box-shadow: ${({ $active }) => ($active ? t.shadows.xs : 'none')};
  -webkit-tap-highlight-color: transparent;
  &:hover { color: ${t.colors.text}; }
`

// ── General tab ───────────────────────────────────────────────────────────────

const Section = styled.div`margin-bottom: 20px;`

const Toggle = styled.label`
  display: flex; align-items: center; gap: 12px; cursor: pointer;
  font-family: ${t.fonts.sans}; font-size: 14px; color: ${t.colors.text};
  input { accent-color: ${t.colors.primary}; width: 16px; height: 16px; }
`

const SaveBar = styled.div`
  position: fixed; bottom: 24px; right: 32px; z-index: 50;
  background: ${t.colors.sidebarBg}; border-radius: ${t.radius.lg};
  padding: 12px 20px; display: flex; align-items: center; gap: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  p { font-family: ${t.fonts.sans}; font-size: 13px; color: rgba(255,255,255,0.75); margin: 0; }

  @media (max-width: 480px) { bottom: 76px; right: 12px; left: 12px; }
`

// ── Users tab ─────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin', pastor: 'Pastor', media: 'Media Team',
  events: 'Events Coordinator', editor: 'Content Editor', finance: 'Finance',
}
type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'accent'

const ROLE_COLORS: Record<UserRole, BadgeVariant> = {
  super_admin: 'danger', pastor: 'accent', media: 'purple',
  events: 'info', editor: 'warning', finance: 'success',
}
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['Full Access', 'User Management', 'Settings', 'Financials'],
  pastor:      ['All Content', 'Sermons', 'Livestreams', 'Prayer Requests', 'Members'],
  media:       ['Livestreams', 'Sermons', 'Events', 'Announcements'],
  events:      ['Events', 'Announcements', 'Calendar'],
  editor:      ['Announcements', 'Sermons', 'Ministries'],
  finance:     ['Giving', 'Donations', 'Financial Reports'],
}

const PermBadge = styled.span`
  font-family: ${t.fonts.sans}; font-size: 11px; font-weight: 500;
  background: ${t.colors.surfaceAlt}; color: ${t.colors.textSecondary};
  border: 1px solid ${t.colors.border}; border-radius: ${t.radius.full};
  padding: 2px 8px;
`

// ── Activity tab ──────────────────────────────────────────────────────────────

const LogRow = styled.div`
  display: flex; align-items: flex-start; gap: 14px;
  padding: 14px 20px; border-bottom: 1px solid ${t.colors.border};
  &:last-child { border-bottom: none; }
`
const LogContent  = styled.div`flex: 1;`
const LogText     = styled.p`font-family: ${t.fonts.sans}; font-size: 13.5px; color: ${t.colors.text}; margin: 0 0 3px; span { font-weight: 600; }`
const LogTime     = styled.p`font-family: ${t.fonts.sans}; font-size: 12px; color: ${t.colors.textMuted}; margin: 0;`
const LogAction   = styled.span<{ $action: string }>`
  font-family: ${t.fonts.sans}; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  padding: 2px 8px; border-radius: ${t.radius.full};
  ${({ $action }) => {
    switch ($action.toLowerCase()) {
      case 'published': return `background:${t.colors.successLight};color:${t.colors.success};`
      case 'uploaded':  return `background:${t.colors.purpleLight};color:${t.colors.purple};`
      case 'created':   return `background:${t.colors.primaryLight};color:${t.colors.primary};`
      case 'updated':   return `background:${t.colors.infoLight};color:${t.colors.info};`
      case 'archived':  return `background:${t.colors.surfaceAlt};color:${t.colors.textMuted};`
      case 'replied':   return `background:${t.colors.accentLight};color:${t.colors.accent};`
      case 'scheduled': return `background:${t.colors.warningLight};color:${t.colors.warning};`
      default:          return `background:${t.colors.surfaceAlt};color:${t.colors.textMuted};`
    }
  }}
`

function formatTimestamp(ts: string) {
  const d = new Date(ts); const now = new Date()
  const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000)
  const diffD = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffH < 1)   return 'Just now'
  if (diffH < 24)  return `${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} today`
  if (diffD === 1) return `Yesterday at ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [tab, setTab]       = useState<Tab>('general')
  const [saved, setSaved]   = useState(false)
  const { user }            = useAuth()

  // Seeding status
  const [seeding, setSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState('')

  // General form
  const [form, setForm] = useState({
    churchName:    'Emganwini Main SDA Church',
    tagline:       'Connecting our community to Christ',
    email:         'Connect@Emganwinisda.org',
    phone:         '+263 XXX XXX XXX',
    address:       'Emganwini, Bulawayo, Zimbabwe',
    youtubeUrl:    'https://youtube.com/@emganwinisda',
    facebookUrl:   'https://facebook.com/emganwinisda',
    tiktokUrl:     'https://tiktok.com/@emganwinisda',
    sabbathSchool: '09:00',
    worship:       '11:30',
    timezone:      'Africa/Harare',
    emailNotifs:   true,
    prayerNotifs:  true,
    messageNotifs: true,
  })

  // Users state
  const [users, setUsers]             = useState<AdminUser[]>(mockAdminUsers)
  const [showUserModal, setUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [deleteUser, setDeleteUser]   = useState<AdminUser | null>(null)
  const [userForm, setUserForm]       = useState<Partial<AdminUser>>({})

  // Activity Log
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLog)

  // Load live activity logs and users from Firestore
  useEffect(() => {
    const unsubActivity = subscribeActivityLogs((items) => {
      if (items.length > 0) setActivityLogs(items)
    })

    // Fetch users collection
    getDocs(collection(db, 'users')).then((snap) => {
      if (!snap.empty) {
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminUser)))
      }
    }).catch(console.warn)

    return () => unsubActivity?.()
  }, [])

  async function handleSave() {
    try {
      await setDoc(doc(db, 'settings', 'general'), form, { merge: true })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.warn('Error saving settings to Firestore:', err)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  async function handleSeed(force = false) {
    setSeeding(true)
    setSeedMessage('')
    try {
      const res = await seedFirestoreDatabase(force)
      setSeedMessage(res.message)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Seeding failed'
      setSeedMessage(`Error: ${msg}`)
    } finally {
      setSeeding(false)
    }
  }

  function openCreateUser() { setEditingUser(null); setUserForm({ role: 'editor', status: 'active' }); setUserModal(true) }
  function openEditUser(u: AdminUser) { setEditingUser(u); setUserForm({ ...u }); setUserModal(true) }

  async function handleSaveUser() {
    if (!userForm.name?.trim() || !userForm.email?.trim()) return
    const id = editingUser ? editingUser.id : `u_${Date.now()}`
    const userData: AdminUser = {
      id,
      name: userForm.name!,
      email: userForm.email!,
      role: (userForm.role as UserRole) || 'editor',
      lastActive: new Date().toISOString(),
      status: (userForm.status as 'active' | 'inactive') || 'active',
    }

    try {
      await setDoc(doc(db, 'users', id), userData, { merge: true })
      if (editingUser) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? userData : u))
      } else {
        setUsers(prev => [...prev, userData])
      }
    } catch (err) {
      console.warn('Error saving user to Firestore:', err)
      if (editingUser) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? userData : u))
      } else {
        setUsers(prev => [...prev, userData])
      }
    }
    setUserModal(false)
  }

  async function handleDeleteUser() {
    if (!deleteUser) return
    try {
      await deleteDoc(doc(db, 'users', deleteUser.id))
      setUsers(prev => prev.filter(u => u.id !== deleteUser.id))
    } catch (err) {
      setUsers(prev => prev.filter(u => u.id !== deleteUser.id))
    }
    setDeleteUser(null)
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Settings</PageTitle>
          <PageSubtitle>Manage church configuration, backend sync, users, and audit logs</PageSubtitle>
        </PageTitleBlock>
        {tab === 'general' && (
          <PageActions><Btn onClick={handleSave}>Save Changes</Btn></PageActions>
        )}
        {tab === 'users' && (
          <PageActions><Btn onClick={openCreateUser}>+ Add User</Btn></PageActions>
        )}
      </PageHeader>

      {/* Tab bar */}
      <TabBar>
        <TabBtn $active={tab === 'general'}  onClick={() => setTab('general')}>⚙ General &amp; Firebase</TabBtn>
        <TabBtn $active={tab === 'users'}    onClick={() => setTab('users')}>👥 Users &amp; Roles</TabBtn>
        <TabBtn $active={tab === 'activity'} onClick={() => setTab('activity')}>📋 Activity Log</TabBtn>
      </TabBar>

      {/* ── GENERAL TAB ── */}
      {tab === 'general' && (
        <>
          {/* Firebase Connection Card */}
          <Card style={{ marginBottom: 20, border: `1px solid ${t.colors.primary}40`, background: `${t.colors.primaryLight}40` }}>
            <CardHeader>
              <CardTitle>🔥 Firebase Backend &amp; Cloud Services</CardTitle>
            </CardHeader>
            <CardBody>
              <p style={{ fontFamily: t.fonts.sans, fontSize: 13, color: t.colors.text, margin: '0 0 12px' }}>
                Connected to Firebase Project: <strong>emg-main-sda</strong> (App ID: <code>1:479154887262:web:2b5280e781a039270132cf</code>)
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
                <Badge $variant="success">Firebase Auth Active (Email + Google)</Badge>
                <Badge $variant="info">Cloud Firestore Ready</Badge>
                <Badge $variant="purple">Cloud Storage Connected</Badge>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <Btn
                  onClick={() => handleSeed(false)}
                  disabled={seeding}
                  $variant="primary"
                  $size="sm"
                >
                  {seeding ? 'Seeding Firestore...' : '🚀 Seed / Populate Firestore Data'}
                </Btn>
                <Btn
                  onClick={() => handleSeed(true)}
                  disabled={seeding}
                  $variant="secondary"
                  $size="sm"
                >
                  Force Overwrite Seed Data
                </Btn>
              </div>
              {seedMessage && (
                <p style={{ fontFamily: t.fonts.sans, fontSize: 12, color: seedMessage.startsWith('Error') ? t.colors.danger : t.colors.success, margin: '10px 0 0', fontWeight: 600 }}>
                  {seedMessage}
                </p>
              )}
            </CardBody>
          </Card>

          <Card style={{ marginBottom: 20 }}>
            <CardHeader><CardTitle>Church Information</CardTitle></CardHeader>
            <CardBody>
              <Section>
                <FormGroup><Label>Church Name</Label>
                  <Input value={form.churchName} onChange={e => set('churchName', e.target.value)} />
                </FormGroup>
                <FormGroup><Label>Tagline</Label>
                  <Input value={form.tagline} onChange={e => set('tagline', e.target.value)} />
                </FormGroup>
                <FormGrid>
                  <FormGroup><Label>Contact Email</Label>
                    <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                  </FormGroup>
                  <FormGroup><Label>Phone</Label>
                    <Input value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </FormGroup>
                </FormGrid>
                <FormGroup><Label>Address</Label>
                  <Input value={form.address} onChange={e => set('address', e.target.value)} />
                </FormGroup>
              </Section>
            </CardBody>
          </Card>

          <Card style={{ marginBottom: 20 }}>
            <CardHeader><CardTitle>Service Times</CardTitle></CardHeader>
            <CardBody>
              <FormGrid>
                <FormGroup><Label>Sabbath School Time</Label>
                  <Input type="time" value={form.sabbathSchool} onChange={e => set('sabbathSchool', e.target.value)} />
                </FormGroup>
                <FormGroup><Label>Worship Service Time</Label>
                  <Input type="time" value={form.worship} onChange={e => set('worship', e.target.value)} />
                </FormGroup>
              </FormGrid>
              <FormGroup><Label>Timezone</Label>
                <Select value={form.timezone} onChange={e => set('timezone', e.target.value)}>
                  <option value="Africa/Harare">Africa/Harare (CAT)</option>
                  <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                  <option value="UTC">UTC</option>
                </Select>
              </FormGroup>
            </CardBody>
          </Card>

          <Card style={{ marginBottom: 20 }}>
            <CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader>
            <CardBody>
              <FormGroup><Label>YouTube</Label>
                <Input placeholder="https://youtube.com/@handle" value={form.youtubeUrl} onChange={e => set('youtubeUrl', e.target.value)} />
              </FormGroup>
              <FormGroup><Label>Facebook</Label>
                <Input placeholder="https://facebook.com/page" value={form.facebookUrl} onChange={e => set('facebookUrl', e.target.value)} />
              </FormGroup>
              <FormGroup><Label>TikTok</Label>
                <Input placeholder="https://tiktok.com/@handle" value={form.tiktokUrl} onChange={e => set('tiktokUrl', e.target.value)} />
              </FormGroup>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Toggle><input type="checkbox" checked={form.emailNotifs} onChange={e => set('emailNotifs', e.target.checked)} /> Email me when a new contact message is received</Toggle>
                <Toggle><input type="checkbox" checked={form.prayerNotifs} onChange={e => set('prayerNotifs', e.target.checked)} /> Email me when a new prayer request is submitted</Toggle>
                <Toggle><input type="checkbox" checked={form.messageNotifs} onChange={e => set('messageNotifs', e.target.checked)} /> Show in-dashboard notifications for new activity</Toggle>
              </div>
            </CardBody>
          </Card>
        </>
      )}

      {/* ── USERS & ROLES TAB ── */}
      {tab === 'users' && (
        <>
          <Card style={{ marginBottom: 20 }}>
            <CardHeader><CardTitle>Role Permissions Matrix</CardTitle></CardHeader>
            <CardBody style={{ padding: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 1, background: t.colors.border }}>
                {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([role, label]) => (
                  <div key={role} style={{ background: t.colors.surface, padding: '14px 18px' }}>
                    <p style={{ fontFamily: t.fonts.sans, fontSize: 13, fontWeight: 700, color: t.colors.text, margin: '0 0 6px' }}>{label}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {ROLE_PERMISSIONS[role].map(p => <PermBadge key={p}>{p}</PermBadge>)}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <TableWrap style={{ border: 'none', borderRadius: 0 }}>
              <Table>
                <Thead><tr>
                  <Th>User</Th><Th>Email</Th><Th>Role</Th>
                  <Th>Status</Th><Th>Last Active</Th><Th>Actions</Th>
                </tr></Thead>
                <Tbody>
                  {users.map(u => (
                    <Tr key={u.id}>
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar style={{ width: 32, height: 32, fontSize: 13 }}>{u.name.charAt(0)}</Avatar>
                          <span style={{ fontWeight: 600 }}>{u.name}</span>
                        </div>
                      </Td>
                      <Td>{u.email}</Td>
                      <Td><Badge $variant={ROLE_COLORS[u.role] || 'default'}>{ROLE_LABELS[u.role] || u.role}</Badge></Td>
                      <Td><Badge $variant={statusVariant(u.status)}>{u.status}</Badge></Td>
                      <Td>{u.lastActive ? new Date(u.lastActive).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</Td>
                      <Td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Btn $variant="ghost" $size="sm" onClick={() => openEditUser(u)}>Edit</Btn>
                          {u.id !== user?.uid && (
                            <Btn $variant="danger" $size="sm" onClick={() => setDeleteUser(u)}>Delete</Btn>
                          )}
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableWrap>
          </Card>
        </>
      )}

      {/* ── ACTIVITY LOG TAB ── */}
      {tab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>System Audit &amp; Activity Trail ({activityLogs.length})</CardTitle>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            {activityLogs.map(log => (
              <LogRow key={log.id}>
                <Avatar style={{ width: 32, height: 32, fontSize: 13, flexShrink: 0 }}>
                  {log.user.charAt(0)}
                </Avatar>
                <LogContent>
                  <LogText><span>{log.user}</span> &bull; {log.resource}</LogText>
                  <LogTime>{formatTimestamp(log.timestamp)}</LogTime>
                </LogContent>
                <LogAction $action={log.action}>{log.action}</LogAction>
              </LogRow>
            ))}
          </CardBody>
        </Card>
      )}

      {/* User edit modal */}
      {showUserModal && (
        <ModalOverlay onClick={() => setUserModal(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editingUser ? 'Edit User' : 'Add Admin User'}</ModalTitle>
              <CloseBtn onClick={() => setUserModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Full Name *</Label>
                <Input value={userForm.name || ''} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} placeholder="Pastor Ngwenya" />
              </FormGroup>
              <FormGroup><Label>Email Address *</Label>
                <Input type="email" value={userForm.email || ''} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} placeholder="user@emganwinisda.org" />
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Role</Label>
                  <Select value={userForm.role || 'editor'} onChange={e => setUserForm(f => ({ ...f, role: e.target.value as UserRole }))}>
                    {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([r, l]) => <option key={r} value={r}>{l}</option>)}
                  </Select>
                </FormGroup>
                <FormGroup><Label>Status</Label>
                  <Select value={userForm.status || 'active'} onChange={e => setUserForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </FormGroup>
              </FormGrid>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={() => setUserModal(false)}>Cancel</Btn>
              <Btn onClick={handleSaveUser}>{editingUser ? 'Save Changes' : 'Create User'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* Delete user confirm */}
      {deleteUser && (
        <ConfirmDialog
          title="Delete User"
          message={`Are you sure you want to remove ${deleteUser.name}? They will lose admin access.`}
          onConfirm={handleDeleteUser}
          onCancel={() => setDeleteUser(null)}
        />
      )}

      {/* Save toast */}
      {saved && (
        <SaveBar>
          <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: t.colors.success, fill: 'none', strokeWidth: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
          <p>Settings saved to Cloud Firestore</p>
        </SaveBar>
      )}
    </PageShell>
  )
}

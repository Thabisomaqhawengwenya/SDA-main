import { useState } from 'react'
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
import type { AdminUser, UserRole } from '../adminTypes'

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

const Section = styled.div`margin-bottom: 32px;`

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
const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'danger', pastor: 'accent', media: 'purple',
  events: 'info', editor: 'warning', finance: 'success',
}
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['Full access to all sections'],
  pastor:      ['Sermons', 'Events', 'Announcements', 'Prayer Requests', 'Services'],
  media:       ['Sermons', 'Livestreams', 'Media uploads'],
  events:      ['Events', 'Registrations'],
  editor:      ['Announcements', 'Website pages'],
  finance:     ['Giving & Donations'],
}

const PermBadge = styled.span`
  font-family: ${t.fonts.sans}; font-size: 11px;
  background: ${t.colors.surfaceAlt}; color: ${t.colors.textSecondary};
  padding: 2px 8px; border-radius: ${t.radius.full};
`

const ActionGroup = styled.div`display: flex; gap: 6px;`

function formatLastActive(ts: string) {
  const d = new Date(ts); const diff = Date.now() - d.getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 24) return `${h}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Activity tab ──────────────────────────────────────────────────────────────

const LogList = styled.div`display: flex; flex-direction: column;`
const LogItem = styled.div`
  display: flex; align-items: flex-start; gap: 14px; padding: 14px 0;
  border-bottom: 1px solid ${t.colors.border};
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
  const [users, setUsers]       = useState<AdminUser[]>(mockAdminUsers)
  const [showUserModal, setUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [deleteUser, setDeleteUser]   = useState<AdminUser | null>(null)
  const [userForm, setUserForm]       = useState<Partial<AdminUser>>({})

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  function openCreateUser() { setEditingUser(null); setUserForm({ role: 'editor', status: 'active' }); setUserModal(true) }
  function openEditUser(u: AdminUser) { setEditingUser(u); setUserForm({ ...u }); setUserModal(true) }

  function handleSaveUser() {
    if (!userForm.name?.trim() || !userForm.email?.trim()) return
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userForm } as AdminUser : u))
    } else {
      setUsers(prev => [...prev, {
        id: `u${Date.now()}`, name: userForm.name!, email: userForm.email!,
        role: userForm.role as UserRole || 'editor',
        lastActive: new Date().toISOString(), status: 'active',
      }])
    }
    setUserModal(false)
  }

  function handleDeleteUser() {
    if (deleteUser) setUsers(prev => prev.filter(u => u.id !== deleteUser.id))
    setDeleteUser(null)
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Settings</PageTitle>
          <PageSubtitle>Manage church configuration, users, and system logs</PageSubtitle>
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
        <TabBtn $active={tab === 'general'}  onClick={() => setTab('general')}>⚙ General</TabBtn>
        <TabBtn $active={tab === 'users'}    onClick={() => setTab('users')}>👥 Users &amp; Roles</TabBtn>
        <TabBtn $active={tab === 'activity'} onClick={() => setTab('activity')}>📋 Activity Log</TabBtn>
      </TabBar>

      {/* ── GENERAL TAB ── */}
      {tab === 'general' && (
        <>
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
          {/* Role permissions matrix */}
          <Card style={{ marginBottom: 20 }}>
            <CardHeader><CardTitle>Role Permissions</CardTitle></CardHeader>
            <CardBody style={{ padding: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: t.colors.border }}>
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

          {/* Users table */}
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
                          <Avatar $size={32}>{u.name.charAt(0)}</Avatar>
                          <span style={{ fontWeight: 500 }}>{u.name}</span>
                        </div>
                      </Td>
                      <Td>{u.email}</Td>
                      <Td><Badge $variant={ROLE_COLORS[u.role] as any}>{ROLE_LABELS[u.role]}</Badge></Td>
                      <Td><Badge $variant={statusVariant(u.status)}>{u.status}</Badge></Td>
                      <Td>{formatLastActive(u.lastActive)}</Td>
                      <Td>
                        <ActionGroup>
                          <Btn $variant="ghost" $size="sm" onClick={() => openEditUser(u)}>Edit</Btn>
                          {u.role !== 'super_admin' && (
                            <Btn $variant="danger" $size="sm" onClick={() => setDeleteUser(u)}>Remove</Btn>
                          )}
                        </ActionGroup>
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
          <CardHeader><CardTitle>Activity Log</CardTitle></CardHeader>
          <CardBody style={{ paddingTop: 8 }}>
            <LogList>
              {mockActivityLog.map(log => (
                <LogItem key={log.id}>
                  <Avatar $size={34}>{log.user.charAt(0)}</Avatar>
                  <LogContent>
                    <LogText>
                      <span>{log.user}</span>{' '}
                      <LogAction $action={log.action}>{log.action}</LogAction>{' '}
                      {log.resource}
                    </LogText>
                    <LogTime>{formatTimestamp(log.timestamp)}</LogTime>
                  </LogContent>
                </LogItem>
              ))}
            </LogList>
          </CardBody>
        </Card>
      )}

      {/* ── Save toast ── */}
      {saved && (
        <SaveBar>
          <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: t.colors.success, fill: 'none', strokeWidth: 2.5, flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <p>Settings saved successfully</p>
          <Btn $size="sm" $variant="ghost" style={{ color: 'rgba(255,255,255,0.5)', padding: '4px 8px' }} onClick={() => setSaved(false)}>Dismiss</Btn>
        </SaveBar>
      )}

      {/* ── User modal ── */}
      {showUserModal && (
        <ModalOverlay onClick={() => setUserModal(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editingUser ? 'Edit User' : 'Add Admin User'}</ModalTitle>
              <CloseBtn onClick={() => setUserModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Full Name *</Label>
                <Input value={userForm.name || ''} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} />
              </FormGroup>
              <FormGroup><Label>Email Address *</Label>
                <Input type="email" value={userForm.email || ''} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} />
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Role</Label>
                  <Select value={userForm.role || 'editor'} onChange={e => setUserForm(f => ({ ...f, role: e.target.value as UserRole }))}>
                    {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup><Label>Status</Label>
                  <Select value={userForm.status || 'active'} onChange={e => setUserForm(f => ({ ...f, status: e.target.value as AdminUser['status'] }))}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </FormGroup>
              </FormGrid>
              {userForm.role && (
                <div style={{ padding: '12px 14px', background: t.colors.surfaceAlt, borderRadius: t.radius.md }}>
                  <p style={{ fontFamily: t.fonts.sans, fontSize: 12, fontWeight: 600, color: t.colors.textMuted, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Access Permissions</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {ROLE_PERMISSIONS[userForm.role as UserRole]?.map(p => <PermBadge key={p}>{p}</PermBadge>)}
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={() => setUserModal(false)}>Cancel</Btn>
              <Btn onClick={handleSaveUser}>{editingUser ? 'Save Changes' : 'Add User'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* ── Delete user confirm ── */}
      {deleteUser && (
        <ConfirmDialog
          title="Remove User"
          message={`Remove "${deleteUser.name}" from admin access? They will no longer be able to log in.`}
          confirmLabel="Remove"
          onConfirm={handleDeleteUser}
          onCancel={() => setDeleteUser(null)}
        />
      )}
    </PageShell>
  )
}

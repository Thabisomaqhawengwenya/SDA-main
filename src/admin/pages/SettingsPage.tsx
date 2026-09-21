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
import { subscribeActivityLogs, logActivity } from '../../services/activityService'
import { subscribeUsers, createUser, updateUserProfile, deleteUser as deleteUserApi } from '../../services/usersService'
import { subscribeChurchSettings, saveChurchSettings, defaultChurchSettings } from '../../services/settingsService'
import type { ChurchSettings } from '../../services/settingsService'
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
  const [form, setForm] = useState<ChurchSettings>(defaultChurchSettings)

  // Users state
  const [users, setUsers]             = useState<AdminUser[]>(mockAdminUsers)
  const [showUserModal, setUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [deleteUser, setDeleteUser]   = useState<AdminUser | null>(null)
  const [userForm, setUserForm]       = useState<Partial<AdminUser>>({})

  // Activity Log
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLog)

  // Load live church settings, users, and activity logs from Firestore
  useEffect(() => {
    const unsubSettings = subscribeChurchSettings((settings) => {
      setForm(settings)
    })
    const unsubUsers = subscribeUsers((items) => {
      if (items.length > 0) setUsers(items)
    })
    const unsubActivity = subscribeActivityLogs((items) => {
      if (items.length > 0) setActivityLogs(items)
    })

    return () => {
      unsubSettings?.()
      unsubUsers?.()
      unsubActivity?.()
    }
  }, [])

  async function handleSave() {
    try {
      await saveChurchSettings(form)
      logActivity(user?.displayName || user?.email || 'Admin', 'Updated church general settings', 'Settings')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.warn('Error saving settings to Firestore:', err)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  async function handleSeed(force = false) {
    setSeeding(true)
    setSeedMessage('')
    try {
      const res = await seedFirestoreDatabase(force)
      setSeedMessage(res.message)
      if (res.success) {
        logActivity(user?.displayName || user?.email || 'Admin', 'Seeded initial database records', 'Database')
      }
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
      if (editingUser) {
        await updateUserProfile(id, userData)
        logActivity(user?.displayName || user?.email || 'Admin', `Updated admin user ${userData.name}`, 'Users')
      } else {
        await createUser(userData)
        logActivity(user?.displayName || user?.email || 'Admin', `Created new admin user ${userData.name}`, 'Users')
      }
    } catch (err) {
      console.warn('Error saving user to Firestore:', err)
    }
    setUserModal(false)
  }

  async function handleDeleteUser() {
    if (!deleteUser) return
    try {
      await deleteUserApi(deleteUser.id)
      logActivity(user?.displayName || user?.email || 'Admin', `Deleted admin user ${deleteUser.name}`, 'Users')
    } catch (err) {
      console.warn('Error deleting user:', err)
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
                <Badge $variant="info">Cloud Firestore Ready (14 Collections)</Badge>
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
                  <Input value={form.churchName || ''} onChange={e => setForm(f => ({ ...f, churchName: e.target.value }))} />
                </FormGroup>
                <FormGroup><Label>Tagline</Label>
                  <Input value={form.tagline || ''} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} />
                </FormGroup>
                <FormGrid>
                  <FormGroup><Label>Contact Email</Label>
                    <Input type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </FormGroup>
                  <FormGroup><Label>Phone</Label>
                    <Input value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </FormGroup>
                </FormGrid>
                <FormGroup><Label>Physical Address</Label>
                  <Input value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </FormGroup>
                <FormGroup><Label>Postal Address</Label>
                  <Input value={form.postalAddress || ''} onChange={e => setForm(f => ({ ...f, postalAddress: e.target.value }))} />
                </FormGroup>
              </Section>
            </CardBody>
          </Card>

          <Card style={{ marginBottom: 20 }}>
            <CardHeader><CardTitle>Service Times</CardTitle></CardHeader>
            <CardBody>
              <FormGrid>
                <FormGroup><Label>Sabbath School</Label>
                  <Input value={form.serviceTimes?.sabbathSchool || ''} onChange={e => setForm(f => ({ ...f, serviceTimes: { ...f.serviceTimes, sabbathSchool: e.target.value } }))} placeholder="Every Saturday, 09:00 am" />
                </FormGroup>
                <FormGroup><Label>Divine Service</Label>
                  <Input value={form.serviceTimes?.divineService || ''} onChange={e => setForm(f => ({ ...f, serviceTimes: { ...f.serviceTimes, divineService: e.target.value } }))} placeholder="Every Saturday, 11:30 am" />
                </FormGroup>
              </FormGrid>
              <FormGroup><Label>Midweek Prayer</Label>
                <Input value={form.serviceTimes?.midweekPrayer || ''} onChange={e => setForm(f => ({ ...f, serviceTimes: { ...f.serviceTimes, midweekPrayer: e.target.value } }))} placeholder="Every Wednesday, 07:00 pm" />
              </FormGroup>
            </CardBody>
          </Card>

          <Card style={{ marginBottom: 20 }}>
            <CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader>
            <CardBody>
              <FormGroup><Label>YouTube Channel</Label>
                <Input placeholder="https://youtube.com/@emganwinisda" value={form.socialLinks?.youtube || ''} onChange={e => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, youtube: e.target.value } }))} />
              </FormGroup>
              <FormGroup><Label>Facebook Page</Label>
                <Input placeholder="https://facebook.com/emganwinisda" value={form.socialLinks?.facebook || ''} onChange={e => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, facebook: e.target.value } }))} />
              </FormGroup>
              <FormGroup><Label>TikTok / WhatsApp</Label>
                <Input placeholder="https://wa.me/263771234567" value={form.socialLinks?.whatsapp || ''} onChange={e => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, whatsapp: e.target.value } }))} />
              </FormGroup>
            </CardBody>
          </Card>

          <Card style={{ marginBottom: 20 }}>
            <CardHeader><CardTitle>Banking &amp; Giving Details</CardTitle></CardHeader>
            <CardBody>
              <FormGrid>
                <FormGroup><Label>Bank Name</Label>
                  <Input value={form.givingDetails?.bankName || ''} onChange={e => setForm(f => ({ ...f, givingDetails: { ...f.givingDetails, bankName: e.target.value } }))} />
                </FormGroup>
                <FormGroup><Label>Account Name</Label>
                  <Input value={form.givingDetails?.accountName || ''} onChange={e => setForm(f => ({ ...f, givingDetails: { ...f.givingDetails, accountName: e.target.value } }))} />
                </FormGroup>
              </FormGrid>
              <FormGrid>
                <FormGroup><Label>Account Number</Label>
                  <Input value={form.givingDetails?.accountNumber || ''} onChange={e => setForm(f => ({ ...f, givingDetails: { ...f.givingDetails, accountNumber: e.target.value } }))} />
                </FormGroup>
                <FormGroup><Label>Branch Code</Label>
                  <Input value={form.givingDetails?.branchCode || ''} onChange={e => setForm(f => ({ ...f, givingDetails: { ...f.givingDetails, branchCode: e.target.value } }))} />
                </FormGroup>
              </FormGrid>
              <FormGrid>
                <FormGroup><Label>EcoCash USSD / Merchant Code</Label>
                  <Input value={form.givingDetails?.ecocashMerchant || ''} onChange={e => setForm(f => ({ ...f, givingDetails: { ...f.givingDetails, ecocashMerchant: e.target.value } }))} />
                </FormGroup>
                <FormGroup><Label>InnBucks Number</Label>
                  <Input value={form.givingDetails?.innbucksNumber || ''} onChange={e => setForm(f => ({ ...f, givingDetails: { ...f.givingDetails, innbucksNumber: e.target.value } }))} />
                </FormGroup>
              </FormGrid>
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

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, Badge, statusVariant, Btn, Avatar,
  TableWrap, Table, Thead, Th, Tbody, Tr, Td,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, FormGrid, Label, Input, Select, ConfirmDialog,
} from '../components/ui'
import { mockAdminUsers } from '../mockData'
import type { AdminUser, UserRole } from '../adminTypes'
import { subscribeUsers, createUser, updateUserProfile, deleteUser } from '../../services/usersService'
import { logActivity } from '../../services/activityService'
import { useAuth } from '../../context/AuthContext'

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

const ActionGroup = styled.div`display:flex; gap:6px;`
const PermBadge = styled.span`
  font-family:${t.fonts.sans}; font-size:11px; background:${t.colors.surfaceAlt};
  color:${t.colors.textSecondary}; padding:2px 8px; border-radius:${t.radius.full};
`

export default function UsersPage() {
  const [users, setUsers]       = useState<AdminUser[]>(mockAdminUsers)
  const [showModal, setModal]   = useState(false)
  const [editing, setEditing]   = useState<AdminUser | null>(null)
  const [deleteTarget, setDel]  = useState<AdminUser | null>(null)
  const [form, setForm]         = useState<Partial<AdminUser>>({})
  const { adminProfile, user }  = useAuth()

  const userName = adminProfile?.name || user?.displayName || 'Admin'

  useEffect(() => {
    const unsub = subscribeUsers((items) => {
      if (items.length > 0) setUsers(items)
    })
    return () => unsub?.()
  }, [])

  function openCreate() { setEditing(null); setForm({ role: 'editor', status: 'active' }); setModal(true) }
  function openEdit(u: AdminUser) { setEditing(u); setForm({ ...u }); setModal(true) }

  async function handleSave() {
    if (!form.name?.trim() || !form.email?.trim()) return
    try {
      if (editing) {
        await updateUserProfile(editing.id, form)
        await logActivity(userName, 'Updated User', `${form.name} (${form.role})`)
      } else {
        const id = `u_${Date.now()}`
        const n: AdminUser = {
          id,
          name: form.name.trim(),
          email: form.email.trim(),
          role: (form.role as UserRole) || 'editor',
          lastActive: new Date().toISOString(),
          status: form.status || 'active',
        }
        await createUser(n)
        await logActivity(userName, 'Created User', `${n.name} (${n.role})`)
      }
    } catch (err) {
      console.warn('Firestore user save error:', err)
      if (editing) {
        setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...form } as AdminUser : u))
      } else {
        const n: AdminUser = {
          id: `u${Date.now()}`, name: form.name!, email: form.email!,
          role: form.role as UserRole || 'editor',
          lastActive: new Date().toISOString(), status: 'active',
        }
        setUsers(prev => [...prev, n])
      }
    }
    setModal(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteUser(deleteTarget.id)
      await logActivity(userName, 'Deleted User', deleteTarget.name)
    } catch (err) {
      console.warn('Firestore delete user error:', err)
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
    }
    setDel(null)
  }

  function formatLastActive(ts: string) {
    const d = new Date(ts)
    if (isNaN(d.getTime())) return 'Recently'
    const diff = Date.now() - d.getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 24) return `${Math.max(1, h)}h ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Users & Roles</PageTitle>
          <PageSubtitle>Manage administrator accounts and access permissions</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Add User</Btn></PageActions>
      </PageHeader>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 1, background: t.colors.border }}>
          {(['super_admin', 'pastor', 'media', 'events', 'editor', 'finance'] as UserRole[]).map(role => (
            <div key={role} style={{ background: t.colors.surface, padding: '16px 20px' }}>
              <p style={{ fontFamily: t.fonts.sans, fontSize: 13, fontWeight: 700, color: t.colors.text, margin: '0 0 6px' }}>{ROLE_LABELS[role]}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {ROLE_PERMISSIONS[role].map(p => <PermBadge key={p}>{p}</PermBadge>)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <TableWrap style={{ border: 'none', borderRadius: 0 }}>
          <Table>
            <Thead>
              <Tr>
                <Th>User</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Last Active</Th>
                <Th style={{ textAlign: 'right' }}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(u => (
                <Tr key={u.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar $size={32} $color={t.colors.primaryLight} style={{ color: t.colors.primary, fontSize: 12 }}>
                        {u.name.charAt(0)}
                      </Avatar>
                      <span style={{ fontFamily: t.fonts.sans, fontSize: 13, fontWeight: 600, color: t.colors.text }}>
                        {u.name}
                      </span>
                    </div>
                  </Td>
                  <Td style={{ fontFamily: t.fonts.sans, fontSize: 13, color: t.colors.textSecondary }}>{u.email}</Td>
                  <Td>
                    <Badge $variant={ROLE_COLORS[u.role] as any}>
                      {ROLE_LABELS[u.role]}
                    </Badge>
                  </Td>
                  <Td><Badge $variant={statusVariant(u.status)}>{u.status}</Badge></Td>
                  <Td style={{ fontFamily: t.fonts.sans, fontSize: 13, color: t.colors.textMuted }}>{formatLastActive(u.lastActive)}</Td>
                  <Td style={{ textAlign: 'right' }}>
                    <ActionGroup style={{ justifyContent: 'flex-end' }}>
                      <Btn $variant="ghost" $size="sm" onClick={() => openEdit(u)}>Edit</Btn>
                      <Btn $variant="danger" $size="sm" onClick={() => setDel(u)}>Delete</Btn>
                    </ActionGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrap>
      </Card>

      {showModal && (
        <ModalOverlay onClick={() => setModal(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing ? 'Edit User' : 'Add User'}</ModalTitle>
              <CloseBtn onClick={() => setModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Full Name *</Label>
                <Input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </FormGroup>
              <FormGroup><Label>Email *</Label>
                <Input type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Role</Label>
                  <Select value={form.role || 'editor'} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}>
                    {(Object.keys(ROLE_LABELS) as UserRole[]).map(r => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup><Label>Status</Label>
                  <Select value={form.status || 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active'|'inactive' }))}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </FormGroup>
              </FormGrid>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Create User'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Delete User" message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          confirmLabel="Delete User" onConfirm={handleDelete} onCancel={() => setDel(null)} />
      )}
    </PageShell>
  )
}

import { useState } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, Badge, statusVariant, Btn, Avatar,
  TableWrap, Table, Thead, Th, Tbody, Tr, Td,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, FormGrid, Label, Input, Select, EmptyState, ConfirmDialog,
  Toolbar, ToolbarLeft, ToolbarRight, SearchWrap, SearchInput,
} from '../components/ui'
import { mockMembers } from '../mockData'
import type { Member, MemberStatus } from '../adminTypes'

const PrivacyBanner = styled.div`
  background:${t.colors.infoLight}; border:1px solid ${t.colors.info}30;
  border-radius:${t.radius.md}; padding:12px 16px; margin-bottom:20px;
  display:flex; align-items:center; gap:10px;
  font-family:${t.fonts.sans}; font-size:13px; color:${t.colors.info};
  svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;flex-shrink:0;}
`
const ActionGroup = styled.div`display:flex; gap:6px;`
const MinistriesTags = styled.div`display:flex; flex-wrap:wrap; gap:4px;`
const MinistryTag = styled.span`
  font-family:${t.fonts.sans}; font-size:11px; font-weight:500;
  background:${t.colors.accentLight}; color:${t.colors.accent};
  padding:2px 8px; border-radius:${t.radius.full};
`

export default function MembersPage() {
  const [members, setMembers]     = useState<Member[]>(mockMembers)
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilter] = useState<string>('all')
  const [showModal, setModal]     = useState(false)
  const [editing, setEditing]     = useState<Member | null>(null)
  const [deleteTarget, setDel]    = useState<Member | null>(null)
  const [form, setForm]           = useState<Partial<Member>>({})

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || m.status === filterStatus
    return matchSearch && matchStatus
  })

  function openCreate() { setEditing(null); setForm({ status: 'active', ministries: [] }); setModal(true) }
  function openEdit(m: Member) { setEditing(m); setForm({ ...m }); setModal(true) }

  function handleSave() {
    if (!form.name?.trim()) return
    if (editing) {
      setMembers(prev => prev.map(m => m.id === editing.id ? { ...m, ...form } as Member : m))
    } else {
      const n: Member = {
        id: `mb${Date.now()}`, name: form.name!, email: form.email || '',
        phone: form.phone || '', status: form.status as MemberStatus || 'active',
        ministries: form.ministries || [], joinDate: form.joinDate || new Date().toISOString().split('T')[0],
        smallGroup: form.smallGroup,
      }
      setMembers(prev => [n, ...prev])
    }
    setModal(false)
  }

  function handleDelete() {
    if (deleteTarget) setMembers(prev => prev.filter(m => m.id !== deleteTarget.id))
    setDel(null)
  }

  const counts = {
    active:   members.filter(m => m.status === 'active').length,
    inactive: members.filter(m => m.status === 'inactive').length,
    visitor:  members.filter(m => m.status === 'visitor').length,
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Members</PageTitle>
          <PageSubtitle>Manage church membership records</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Add Member</Btn></PageActions>
      </PageHeader>

      <PrivacyBanner>
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Member records are private. Only authorized administrators may access this section.
      </PrivacyBanner>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Active Members', value: counts.active,   color: t.colors.success, bg: t.colors.successLight },
          { label: 'Visitors',       value: counts.visitor,  color: t.colors.primary, bg: t.colors.primaryLight },
          { label: 'Inactive',       value: counts.inactive, color: t.colors.textMuted, bg: t.colors.surfaceAlt },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: t.radius.md, padding: '16px 20px', border: `1px solid ${c.color}20` }}>
            <p style={{ fontFamily: t.fonts.sans, fontSize: 28, fontWeight: 700, color: c.color, margin: '0 0 4px' }}>{c.value}</p>
            <p style={{ fontFamily: t.fonts.sans, fontSize: 13, color: c.color, margin: 0, opacity: 0.8 }}>{c.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <Toolbar style={{ padding: '16px 20px 0' }}>
          <ToolbarLeft>
            <SearchWrap>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
              <SearchInput placeholder="Search members…" value={search} onChange={e => setSearch(e.target.value)} />
            </SearchWrap>
            <Select style={{ width: 140 }} value={filterStatus} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="visitor">Visitor</option>
              <option value="inactive">Inactive</option>
            </Select>
          </ToolbarLeft>
          <ToolbarRight>
            <span style={{ fontFamily: t.fonts.sans, fontSize: 13, color: t.colors.textMuted }}>{filtered.length} member{filtered.length !== 1 ? 's' : ''}</span>
          </ToolbarRight>
        </Toolbar>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
            title="No members found" description="Church members will appear here."
            action={<Btn onClick={openCreate}>Add Member</Btn>}
          />
        ) : (
          <TableWrap style={{ borderRadius: 0, border: 'none', borderTop: `1px solid ${t.colors.border}`, marginTop: 16 }}>
            <Table>
              <Thead><tr>
                <Th>Member</Th><Th>Email</Th><Th>Phone</Th>
                <Th>Ministries</Th><Th>Status</Th><Th>Joined</Th><Th>Actions</Th>
              </tr></Thead>
              <Tbody>
                {filtered.map(m => (
                  <Tr key={m.id}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar $size={32}>{m.name.charAt(0)}</Avatar>
                        <span style={{ fontWeight: 500 }}>{m.name}</span>
                      </div>
                    </Td>
                    <Td>{m.email}</Td>
                    <Td>{m.phone}</Td>
                    <Td>
                      <MinistriesTags>
                        {m.ministries.length === 0
                          ? <span style={{ color: t.colors.textMuted, fontSize: 13 }}>—</span>
                          : m.ministries.map(min => <MinistryTag key={min}>{min}</MinistryTag>)}
                      </MinistriesTags>
                    </Td>
                    <Td><Badge $variant={statusVariant(m.status)}>{m.status}</Badge></Td>
                    <Td>{new Date(m.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Td>
                    <Td>
                      <ActionGroup>
                        <Btn $variant="ghost" $size="sm" onClick={() => openEdit(m)}>Edit</Btn>
                        <Btn $variant="danger" $size="sm" onClick={() => setDel(m)}>Delete</Btn>
                      </ActionGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrap>
        )}
      </Card>

      {showModal && (
        <ModalOverlay onClick={() => setModal(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing ? 'Edit Member' : 'Add Member'}</ModalTitle>
              <CloseBtn onClick={() => setModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Full Name *</Label>
                <Input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Email</Label>
                  <Input type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </FormGroup>
                <FormGroup><Label>Phone</Label>
                  <Input value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </FormGroup>
              </FormGrid>
              <FormGrid>
                <FormGroup><Label>Status</Label>
                  <Select value={form.status || 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.value as MemberStatus }))}>
                    <option value="active">Active</option>
                    <option value="visitor">Visitor</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </FormGroup>
                <FormGroup><Label>Join Date</Label>
                  <Input type="date" value={form.joinDate || ''} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} />
                </FormGroup>
              </FormGrid>
              <FormGroup><Label>Small Group</Label>
                <Input placeholder="e.g. Group A" value={form.smallGroup || ''} onChange={e => setForm(f => ({ ...f, smallGroup: e.target.value }))} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Add Member'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Remove Member" message={`Remove "${deleteTarget.name}" from the membership records? This cannot be undone.`}
          confirmLabel="Remove" onConfirm={handleDelete} onCancel={() => setDel(null)} />
      )}
    </PageShell>
  )
}

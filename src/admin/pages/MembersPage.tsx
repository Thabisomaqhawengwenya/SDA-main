import { useState, useEffect } from 'react'
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
import { subscribeMembers, createMember, updateMember, deleteMember } from '../../services/membersService'
import { logActivity } from '../../services/activityService'
import { useAuth } from '../../context/AuthContext'

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
  const { adminProfile, user }    = useAuth()

  const userName = adminProfile?.name || user?.displayName || 'Admin'

  useEffect(() => {
    const unsub = subscribeMembers((items) => {
      if (items.length > 0) setMembers(items)
    })
    return () => unsub?.()
  }, [])

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || m.status === filterStatus
    return matchSearch && matchStatus
  })

  function openCreate() { setEditing(null); setForm({ status: 'active', ministries: [] }); setModal(true) }
  function openEdit(m: Member) { setEditing(m); setForm({ ...m }); setModal(true) }

  async function handleSave() {
    if (!form.name?.trim()) return
    try {
      if (editing) {
        await updateMember(editing.id, form)
        await logActivity(userName, 'Updated', `Member: ${form.name}`)
      } else {
        const n: Omit<Member, 'id'> = {
          name: form.name!, email: form.email || '',
          phone: form.phone || '', status: (form.status as MemberStatus) || 'active',
          ministries: form.ministries || [], joinDate: form.joinDate || new Date().toISOString().split('T')[0],
          smallGroup: form.smallGroup || '',
        }
        await createMember(n)
        await logActivity(userName, 'Registered', `Member: ${n.name}`)
      }
    } catch (err) {
      console.warn('Firestore member save error:', err)
      if (editing) {
        setMembers(prev => prev.map(m => m.id === editing.id ? { ...m, ...form } as Member : m))
      } else {
        const fallback: Member = {
          id: `mb${Date.now()}`, name: form.name!, email: form.email || '',
          phone: form.phone || '', status: form.status as MemberStatus || 'active',
          ministries: form.ministries || [], joinDate: form.joinDate || new Date().toISOString().split('T')[0],
          smallGroup: form.smallGroup,
        }
        setMembers(prev => [fallback, ...prev])
      }
    }
    setModal(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteMember(deleteTarget.id)
      await logActivity(userName, 'Deleted', `Member: ${deleteTarget.name}`)
    } catch (err) {
      console.warn('Firestore member delete error:', err)
      setMembers(prev => prev.filter(m => m.id !== deleteTarget.id))
    }
    setDel(null)
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Members Directory</PageTitle>
          <PageSubtitle>Church membership registry, small groups, and department assignments</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Add Member</Btn></PageActions>
      </PageHeader>

      <PrivacyBanner>
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Member contact details are confidential and accessible only to authorized pastoral staff.
      </PrivacyBanner>

      <Card>
        <Toolbar style={{padding:'16px 20px 0'}}>
          <ToolbarLeft>
            <SearchWrap>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
              <SearchInput placeholder="Search members…" value={search} onChange={e=>setSearch(e.target.value)} />
            </SearchWrap>
            <Select style={{width:140}} value={filterStatus} onChange={e=>setFilter(e.target.value)}>
              <option value="all">All Members</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="visitor">Visitor</option>
            </Select>
          </ToolbarLeft>
          <ToolbarRight>
            <span style={{fontFamily:t.fonts.sans,fontSize:13,color:t.colors.textMuted}}>{filtered.length} member{filtered.length!==1?'s':''}</span>
          </ToolbarRight>
        </Toolbar>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            title="No members found"
            description="Add members to build your church directory."
            action={<Btn onClick={openCreate}>Add Member</Btn>}
          />
        ) : (
          <TableWrap style={{borderRadius:0,border:'none',borderTop:`1px solid ${t.colors.border}`,marginTop:16}}>
            <Table>
              <Thead>
                <tr>
                  <Th>Name</Th><Th>Contact</Th><Th>Ministries</Th>
                  <Th>Small Group</Th><Th>Joined</Th><Th>Status</Th><Th>Actions</Th>
                </tr>
              </Thead>
              <Tbody>
                {filtered.map(m => (
                  <Tr key={m.id}>
                    <Td><div style={{display:'flex',alignItems:'center',gap:10}}>
                      <Avatar style={{width:32,height:32,fontSize:13}}>{m.name.charAt(0)}</Avatar>
                      <span style={{fontWeight:600}}>{m.name}</span>
                    </div></Td>
                    <Td>
                      <div>{m.email}</div>
                      <div style={{fontSize:11,color:t.colors.textMuted}}>{m.phone}</div>
                    </Td>
                    <Td>
                      <MinistriesTags>
                        {m.ministries.map(min => <MinistryTag key={min}>{min}</MinistryTag>)}
                      </MinistriesTags>
                    </Td>
                    <Td>{m.smallGroup || '—'}</Td>
                    <Td>{new Date(m.joinDate).toLocaleDateString('en-US',{month:'short',year:'numeric'})}</Td>
                    <Td><Badge $variant={statusVariant(m.status)}>{m.status}</Badge></Td>
                    <Td>
                      <ActionGroup>
                        <Btn $variant="ghost" $size="sm" onClick={()=>openEdit(m)}>Edit</Btn>
                        <Btn $variant="danger" $size="sm" onClick={()=>setDel(m)}>Delete</Btn>
                      </ActionGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrap>
        )}
      </Card>

      {/* Modal */}
      {showModal && (
        <ModalOverlay onClick={()=>setModal(false)}>
          <ModalBox onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing ? 'Edit Member' : 'Add New Member'}</ModalTitle>
              <CloseBtn onClick={()=>setModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Full Name *</Label>
                <Input placeholder="e.g. Brother Dube" value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Email</Label><Input type="email" placeholder="member@example.com" value={form.email||''} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></FormGroup>
                <FormGroup><Label>Phone Number</Label><Input placeholder="+263 77..." value={form.phone||''} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGrid>
                <FormGroup><Label>Status</Label>
                  <Select value={form.status||'active'} onChange={e=>setForm(f=>({...f,status:e.target.value as MemberStatus}))}>
                    <option value="active">Active Member</option>
                    <option value="inactive">Inactive</option>
                    <option value="visitor">Visitor</option>
                  </Select>
                </FormGroup>
                <FormGroup><Label>Small Group</Label>
                  <Input placeholder="e.g. Group A / Zone 4" value={form.smallGroup||''} onChange={e=>setForm(f=>({...f,smallGroup:e.target.value}))}/>
                </FormGroup>
              </FormGrid>
              <FormGroup><Label>Join Date</Label>
                <Input type="date" value={form.joinDate||''} onChange={e=>setForm(f=>({...f,joinDate:e.target.value}))}/>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Add Member'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Member"
          message={`Are you sure you want to remove "${deleteTarget.name}" from the directory?`}
          onConfirm={handleDelete}
          onCancel={()=>setDel(null)}
        />
      )}
    </PageShell>
  )
}

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, Badge, statusVariant, Btn, Grid3, Avatar,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, FormGrid, Label, Input, Textarea, Select, EmptyState, ConfirmDialog,
} from '../components/ui'
import { mockMinistries } from '../mockData'
import type { Ministry } from '../adminTypes'
import { subscribeMinistries, createMinistry, updateMinistry, deleteMinistry } from '../../services/ministriesService'
import { logActivity } from '../../services/activityService'
import { useAuth } from '../../context/AuthContext'

const MinCard = styled(Card)`display:flex; flex-direction:column;`
const MinBody  = styled.div`padding:20px; flex:1;`
const MinTop   = styled.div`display:flex; align-items:flex-start; gap:14px; margin-bottom:14px;`
const MinInfo  = styled.div`flex:1;`
const MinName  = styled.h3`font-family:${t.fonts.sans}; font-size:15px; font-weight:700; color:${t.colors.text}; margin:0 0 4px;`
const MinMeta  = styled.p`font-family:${t.fonts.sans}; font-size:12px; color:${t.colors.textMuted}; margin:0 0 3px;`
const MinDesc  = styled.p`font-family:${t.fonts.sans}; font-size:13px; color:${t.colors.textSecondary}; margin:0; line-height:1.6;`
const MinFooter = styled.div`padding:12px 20px; border-top:1px solid ${t.colors.border}; display:flex; align-items:center; justify-content:space-between;`
const MemberCount = styled.span`font-family:${t.fonts.sans}; font-size:12px; color:${t.colors.textMuted};`
const ActionGroup = styled.div`display:flex; gap:6px;`

const COLORS = ['#4a6741','#1DA1F2','#8b5cf6','#ef4444','#f59e0b','#10b981']

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>(mockMinistries)
  const [showModal, setModal]       = useState(false)
  const [editing, setEditing]       = useState<Ministry | null>(null)
  const [deleteTarget, setDel]      = useState<Ministry | null>(null)
  const [form, setForm]             = useState<Partial<Ministry>>({})
  const { adminProfile, user }      = useAuth()

  const userName = adminProfile?.name || user?.displayName || 'Admin'

  useEffect(() => {
    const unsub = subscribeMinistries((items) => {
      if (items.length > 0) setMinistries(items)
    })
    return () => unsub?.()
  }, [])

  function openCreate() { setEditing(null); setForm({status:'active', memberCount: 0}); setModal(true) }
  function openEdit(m: Ministry) { setEditing(m); setForm({...m}); setModal(true) }

  async function handleSave() {
    if (!form.name?.trim()) return
    try {
      if (editing) {
        await updateMinistry(editing.id, form)
        await logActivity(userName, 'Updated', `Ministry: ${form.name}`)
      } else {
        const n: Omit<Ministry, 'id'> = {
          name: form.name!, description: form.description || '',
          leader: form.leader || '', contact: form.contact || '', schedule: form.schedule || '',
          memberCount: form.memberCount || 0, status: (form.status as Ministry['status']) || 'active',
        }
        await createMinistry(n)
        await logActivity(userName, 'Created', `Ministry: ${n.name}`)
      }
    } catch (err) {
      console.warn('Firestore ministry save error:', err)
      if (editing) {
        setMinistries(prev=>prev.map(m=>m.id===editing.id?{...m,...form} as Ministry:m))
      } else {
        const fallback: Ministry = {
          id:`m${Date.now()}`, name:form.name!, description:form.description||'',
          leader:form.leader||'', contact:form.contact||'', schedule:form.schedule||'',
          memberCount:0, status:form.status as Ministry['status']||'active',
        }
        setMinistries(prev=>[fallback,...prev])
      }
    }
    setModal(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteMinistry(deleteTarget.id)
      await logActivity(userName, 'Deleted', `Ministry: ${deleteTarget.name}`)
    } catch (err) {
      console.warn('Firestore ministry delete error:', err)
      setMinistries(prev=>prev.filter(m=>m.id!==deleteTarget.id))
    }
    setDel(null)
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Ministries</PageTitle>
          <PageSubtitle>Manage church departments, leaders, meeting times, and department rosters</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Add Ministry</Btn></PageActions>
      </PageHeader>

      {ministries.length === 0 ? (
        <Card>
          <EmptyState
            icon={<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            title="No ministries configured"
            description="Add your first church ministry."
            action={<Btn onClick={openCreate}>Add Ministry</Btn>}
          />
        </Card>
      ) : (
        <Grid3>
          {ministries.map((m, i) => (
            <MinCard key={m.id}>
              <MinBody>
                <MinTop>
                  <Avatar style={{background:COLORS[i % COLORS.length]}}>{m.name.charAt(0)}</Avatar>
                  <MinInfo>
                    <MinName>{m.name}</MinName>
                    <MinMeta>👤 {m.leader} &bull; ✉ {m.contact}</MinMeta>
                    {m.schedule && <MinMeta>🕒 {m.schedule}</MinMeta>}
                  </MinInfo>
                </MinTop>
                <MinDesc>{m.description}</MinDesc>
              </MinBody>
              <MinFooter>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <Badge $variant={statusVariant(m.status)}>{m.status}</Badge>
                  <MemberCount>👥 {m.memberCount || 0} members</MemberCount>
                </div>
                <ActionGroup>
                  <Btn $variant="ghost" $size="sm" onClick={()=>openEdit(m)}>Edit</Btn>
                  <Btn $variant="danger" $size="sm" onClick={()=>setDel(m)}>Delete</Btn>
                </ActionGroup>
              </MinFooter>
            </MinCard>
          ))}
        </Grid3>
      )}

      {/* Modal */}
      {showModal && (
        <ModalOverlay onClick={()=>setModal(false)}>
          <ModalBox onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing ? 'Edit Ministry' : 'Add New Ministry'}</ModalTitle>
              <CloseBtn onClick={()=>setModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Ministry Name *</Label>
                <Input placeholder="e.g. Youth Ministry" value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Department Leader</Label><Input placeholder="e.g. Bro. Dube" value={form.leader||''} onChange={e=>setForm(f=>({...f,leader:e.target.value}))}/></FormGroup>
                <FormGroup><Label>Contact Email / Phone</Label><Input placeholder="youth@emganwinisda.org" value={form.contact||''} onChange={e=>setForm(f=>({...f,contact:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGrid>
                <FormGroup><Label>Meeting Schedule</Label><Input placeholder="Every Sabbath, 2:00 PM" value={form.schedule||''} onChange={e=>setForm(f=>({...f,schedule:e.target.value}))}/></FormGroup>
                <FormGroup><Label>Status</Label>
                  <Select value={form.status||'active'} onChange={e=>setForm(f=>({...f,status:e.target.value as Ministry['status']}))}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </FormGroup>
              </FormGrid>
              <FormGroup><Label>Ministry Description</Label>
                <Textarea placeholder="Mission and focus of this department…" value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Create Ministry'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Ministry"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={()=>setDel(null)}
        />
      )}
    </PageShell>
  )
}

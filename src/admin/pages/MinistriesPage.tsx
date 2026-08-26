import { useState } from 'react'
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

  function openCreate() { setEditing(null); setForm({status:'active'}); setModal(true) }
  function openEdit(m: Ministry) { setEditing(m); setForm({...m}); setModal(true) }

  function handleSave() {
    if (!form.name?.trim()) return
    if (editing) {
      setMinistries(prev=>prev.map(m=>m.id===editing.id?{...m,...form} as Ministry:m))
    } else {
      const n: Ministry = {
        id:`m${Date.now()}`, name:form.name!, description:form.description||'',
        leader:form.leader||'', contact:form.contact||'', schedule:form.schedule||'',
        memberCount:0, status:form.status as Ministry['status']||'active',
      }
      setMinistries(prev=>[n,...prev])
    }
    setModal(false)
  }

  function handleDelete() {
    if (deleteTarget) setMinistries(prev=>prev.filter(m=>m.id!==deleteTarget.id))
    setDel(null)
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Ministries</PageTitle>
          <PageSubtitle>Manage church ministries, leaders, and schedules</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Add Ministry</Btn></PageActions>
      </PageHeader>

      {ministries.length === 0 ? (
        <Card><EmptyState
          icon={<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
          title="No ministries yet" description="Add your first ministry to get started."
          action={<Btn onClick={openCreate}>Add Ministry</Btn>}
        /></Card>
      ) : (
        <Grid3>
          {ministries.map((m,i) => (
            <MinCard key={m.id}>
              <MinBody>
                <MinTop>
                  <Avatar $size={44} $color={COLORS[i % COLORS.length]+'22'} style={{color:COLORS[i%COLORS.length],fontSize:16}}>
                    {m.name.charAt(0)}
                  </Avatar>
                  <MinInfo>
                    <MinName>{m.name}</MinName>
                    <Badge $variant={statusVariant(m.status)}>{m.status}</Badge>
                  </MinInfo>
                </MinTop>
                <MinDesc style={{marginBottom:12}}>{m.description}</MinDesc>
                <MinMeta>👤 Leader: {m.leader}</MinMeta>
                <MinMeta>📅 {m.schedule}</MinMeta>
                <MinMeta>✉️ {m.contact}</MinMeta>
              </MinBody>
              <MinFooter>
                <MemberCount>👥 {m.memberCount} members</MemberCount>
                <ActionGroup>
                  <Btn $variant="ghost" $size="sm" onClick={()=>openEdit(m)}>Edit</Btn>
                  <Btn $variant="danger" $size="sm" onClick={()=>setDel(m)}>Delete</Btn>
                </ActionGroup>
              </MinFooter>
            </MinCard>
          ))}
        </Grid3>
      )}

      {showModal && (
        <ModalOverlay onClick={()=>setModal(false)}>
          <ModalBox onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing?'Edit Ministry':'Add Ministry'}</ModalTitle>
              <CloseBtn onClick={()=>setModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Ministry Name *</Label><Input value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></FormGroup>
              <FormGrid>
                <FormGroup><Label>Leader</Label><Input value={form.leader||''} onChange={e=>setForm(f=>({...f,leader:e.target.value}))}/></FormGroup>
                <FormGroup><Label>Contact Email</Label><Input type="email" value={form.contact||''} onChange={e=>setForm(f=>({...f,contact:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGroup><Label>Meeting Schedule</Label><Input placeholder="e.g. Every Sabbath after service" value={form.schedule||''} onChange={e=>setForm(f=>({...f,schedule:e.target.value}))}/></FormGroup>
              <FormGroup><Label>Status</Label>
                <Select value={form.status||'active'} onChange={e=>setForm(f=>({...f,status:e.target.value as Ministry['status']}))}>
                  <option value="active">Active</option><option value="inactive">Inactive</option>
                </Select>
              </FormGroup>
              <FormGroup><Label>Description</Label><Textarea value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing?'Save Changes':'Add Ministry'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Delete Ministry" message={`Delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={handleDelete} onCancel={()=>setDel(null)}/>
      )}
    </PageShell>
  )
}

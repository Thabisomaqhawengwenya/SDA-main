import { useState } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, Btn, Grid3, Avatar,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, FormGrid, Label, Input, Textarea, EmptyState, ConfirmDialog,
} from '../components/ui'
import { mockLeaders } from '../mockData'
import type { Leader } from '../adminTypes'

const LeaderCard = styled(Card)`display:flex; flex-direction:column;`
const LeaderBody = styled.div`padding:20px; flex:1; display:flex; align-items:flex-start; gap:14px;`
const LeaderInfo = styled.div`flex:1;`
const LeaderName = styled.h3`font-family:${t.fonts.sans}; font-size:15px; font-weight:700; color:${t.colors.text}; margin:0 0 3px;`
const LeaderPos  = styled.p`font-family:${t.fonts.sans}; font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:${t.colors.primary}; margin:0 0 8px;`
const LeaderBio  = styled.p`font-family:${t.fonts.sans}; font-size:13px; color:${t.colors.textSecondary}; line-height:1.65; margin:0;`
const LeaderFooter = styled.div`padding:12px 20px; border-top:1px solid ${t.colors.border}; display:flex; justify-content:space-between; align-items:center;`
const LeaderEmail = styled.a`font-family:${t.fonts.sans}; font-size:12px; color:${t.colors.primary}; text-decoration:none; &:hover{text-decoration:underline;}`
const ActionGroup = styled.div`display:flex; gap:6px;`

const LEADER_COLORS = [t.colors.primary, t.colors.accent, t.colors.purple, t.colors.warning]

export default function LeadershipPage() {
  const [leaders, setLeaders]   = useState<Leader[]>(mockLeaders)
  const [showModal, setModal]   = useState(false)
  const [editing, setEditing]   = useState<Leader | null>(null)
  const [deleteTarget, setDel]  = useState<Leader | null>(null)
  const [form, setForm]         = useState<Partial<Leader>>({})

  function openCreate() { setEditing(null); setForm({}); setModal(true) }
  function openEdit(l: Leader) { setEditing(l); setForm({ ...l }); setModal(true) }

  function handleSave() {
    if (!form.name?.trim()) return
    if (editing) {
      setLeaders(prev => prev.map(l => l.id === editing.id ? { ...l, ...form } as Leader : l))
    } else {
      const n: Leader = {
        id: `ld${Date.now()}`, name: form.name!, position: form.position || '',
        bio: form.bio || '', email: form.email || '',
      }
      setLeaders(prev => [...prev, n])
    }
    setModal(false)
  }

  function handleDelete() {
    if (deleteTarget) setLeaders(prev => prev.filter(l => l.id !== deleteTarget.id))
    setDel(null)
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Leadership</PageTitle>
          <PageSubtitle>Manage pastor, elders, deacons, and ministry leaders</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Add Leader</Btn></PageActions>
      </PageHeader>

      {leaders.length === 0 ? (
        <Card><EmptyState
          icon={<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
          title="No leaders added" description="Add church leaders and their profiles."
          action={<Btn onClick={openCreate}>Add Leader</Btn>}
        /></Card>
      ) : (
        <Grid3>
          {leaders.map((l, i) => (
            <LeaderCard key={l.id}>
              <LeaderBody>
                <Avatar $size={52} $color={LEADER_COLORS[i % LEADER_COLORS.length] + '22'} style={{ color: LEADER_COLORS[i % LEADER_COLORS.length], fontSize: 20 }}>
                  {l.name.charAt(0)}
                </Avatar>
                <LeaderInfo>
                  <LeaderName>{l.name}</LeaderName>
                  <LeaderPos>{l.position}</LeaderPos>
                  <LeaderBio>{l.bio}</LeaderBio>
                </LeaderInfo>
              </LeaderBody>
              <LeaderFooter>
                <LeaderEmail href={`mailto:${l.email}`}>{l.email}</LeaderEmail>
                <ActionGroup>
                  <Btn $variant="ghost" $size="sm" onClick={() => openEdit(l)}>Edit</Btn>
                  <Btn $variant="danger" $size="sm" onClick={() => setDel(l)}>Delete</Btn>
                </ActionGroup>
              </LeaderFooter>
            </LeaderCard>
          ))}
        </Grid3>
      )}

      {showModal && (
        <ModalOverlay onClick={() => setModal(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing ? 'Edit Leader' : 'Add Leader'}</ModalTitle>
              <CloseBtn onClick={() => setModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Full Name *</Label>
                <Input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Position</Label>
                  <Input placeholder="e.g. Senior Pastor" value={form.position || ''} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
                </FormGroup>
                <FormGroup><Label>Email</Label>
                  <Input type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </FormGroup>
              </FormGrid>
              <FormGroup><Label>Biography</Label>
                <Textarea placeholder="Brief biography…" value={form.bio || ''} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Add Leader'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Remove Leader" message={`Remove "${deleteTarget.name}" from the leadership directory?`}
          confirmLabel="Remove" onConfirm={handleDelete} onCancel={() => setDel(null)} />
      )}
    </PageShell>
  )
}

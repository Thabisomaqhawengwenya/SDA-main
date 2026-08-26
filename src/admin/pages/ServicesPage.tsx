import { useState } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, CardHeader, CardTitle, CardBody, Btn,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, FormGrid, Label, Input, Textarea, Select, EmptyState, ConfirmDialog,
} from '../components/ui'
import { mockServices } from '../mockData'
import type { ChurchService } from '../adminTypes'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

const ServiceRow = styled.div`
  display:flex; align-items:center; gap:16px; padding:16px 0;
  border-bottom:1px solid ${t.colors.border}; &:last-child{border-bottom:none;}
`
const TimeBox = styled.div`
  width:70px; flex-shrink:0; text-align:center;
  font-family:${t.fonts.sans}; font-size:13px; font-weight:700; color:${t.colors.primary};
`
const ServiceInfo = styled.div`flex:1;`
const ServiceName = styled.p`font-family:${t.fonts.sans}; font-size:14px; font-weight:600; color:${t.colors.text}; margin:0 0 3px;`
const ServiceMeta = styled.p`font-family:${t.fonts.sans}; font-size:12px; color:${t.colors.textMuted}; margin:0;`
const ActionGroup = styled.div`display:flex; gap:6px;`

export default function ServicesPage() {
  const [services, setServices]   = useState<ChurchService[]>(mockServices)
  const [showModal, setModal]     = useState(false)
  const [editing, setEditing]     = useState<ChurchService | null>(null)
  const [deleteTarget, setDel]    = useState<ChurchService | null>(null)
  const [form, setForm]           = useState<Partial<ChurchService>>({})

  const byDay = DAYS.reduce<Record<string, ChurchService[]>>((acc, day) => {
    acc[day] = services.filter(s => s.day === day).sort((a, b) => a.time.localeCompare(b.time))
    return acc
  }, {})

  function openCreate() { setEditing(null); setForm({recurring:true,day:'Saturday'}); setModal(true) }
  function openEdit(s: ChurchService) { setEditing(s); setForm({...s}); setModal(true) }

  function handleSave() {
    if (!form.name?.trim()) return
    if (editing) {
      setServices(prev=>prev.map(s=>s.id===editing.id?{...s,...form} as ChurchService:s))
    } else {
      const n: ChurchService = {
        id:`sv${Date.now()}`, name:form.name!, day:form.day||'Saturday',
        time:form.time||'', description:form.description||'',
        speaker:form.speaker, livestreamLink:form.livestreamLink,
        recurring:form.recurring||true,
      }
      setServices(prev=>[...prev,n])
    }
    setModal(false)
  }

  function handleDelete() {
    if (deleteTarget) setServices(prev=>prev.filter(s=>s.id!==deleteTarget.id))
    setDel(null)
  }

  const activeDays = DAYS.filter(d => byDay[d].length > 0)

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Services</PageTitle>
          <PageSubtitle>Manage recurring church service schedules</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Add Service</Btn></PageActions>
      </PageHeader>

      {activeDays.length === 0 ? (
        <Card><EmptyState
          icon={<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          title="No services scheduled" description="Add your church service times here."
          action={<Btn onClick={openCreate}>Add Service</Btn>}
        /></Card>
      ) : (
        activeDays.map(day => (
          <Card key={day} style={{marginBottom:20}}>
            <CardHeader>
              <CardTitle style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:t.colors.primary}}/>
                {day}
              </CardTitle>
              <Btn $variant="ghost" $size="sm" onClick={openCreate}>+ Add</Btn>
            </CardHeader>
            <CardBody>
              {byDay[day].map(s => (
                <ServiceRow key={s.id}>
                  <TimeBox>{s.time}</TimeBox>
                  <ServiceInfo>
                    <ServiceName>{s.name}</ServiceName>
                    <ServiceMeta>
                      {s.speaker && <span>🎤 {s.speaker} · </span>}
                      {s.description}
                      {s.livestreamLink && <span style={{color:t.colors.primary}}> · 🔴 Live</span>}
                    </ServiceMeta>
                  </ServiceInfo>
                  <ActionGroup>
                    <Btn $variant="ghost" $size="sm" onClick={()=>openEdit(s)}>Edit</Btn>
                    <Btn $variant="danger" $size="sm" onClick={()=>setDel(s)}>Delete</Btn>
                  </ActionGroup>
                </ServiceRow>
              ))}
            </CardBody>
          </Card>
        ))
      )}

      {showModal && (
        <ModalOverlay onClick={()=>setModal(false)}>
          <ModalBox onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing?'Edit Service':'Add Service'}</ModalTitle>
              <CloseBtn onClick={()=>setModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Service Name *</Label><Input value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></FormGroup>
              <FormGrid>
                <FormGroup><Label>Day</Label>
                  <Select value={form.day||'Saturday'} onChange={e=>setForm(f=>({...f,day:e.target.value}))}>
                    {DAYS.map(d=><option key={d} value={d}>{d}</option>)}
                  </Select>
                </FormGroup>
                <FormGroup><Label>Time</Label><Input type="time" value={form.time||''} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGroup><Label>Speaker (optional)</Label><Input value={form.speaker||''} onChange={e=>setForm(f=>({...f,speaker:e.target.value}))}/></FormGroup>
              <FormGroup><Label>Livestream Link</Label><Input placeholder="https://youtube.com/…" value={form.livestreamLink||''} onChange={e=>setForm(f=>({...f,livestreamLink:e.target.value}))}/></FormGroup>
              <FormGroup><Label>Description</Label><Textarea value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing?'Save Changes':'Add Service'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Delete Service" message={`Delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={handleDelete} onCancel={()=>setDel(null)}/>
      )}
    </PageShell>
  )
}

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, CardHeader, CardTitle, CardBody, Btn,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, FormGrid, Label, Input, Textarea, Select, ConfirmDialog,
} from '../components/ui'
import { mockServices } from '../mockData'
import type { ChurchService } from '../adminTypes'
import { subscribeServices, createService, updateService, deleteService } from '../../services/servicesService'
import { logActivity } from '../../services/activityService'
import { useAuth } from '../../context/AuthContext'

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
  const { adminProfile, user }    = useAuth()

  const userName = adminProfile?.name || user?.displayName || 'Admin'

  useEffect(() => {
    const unsub = subscribeServices((items) => {
      if (items.length > 0) setServices(items)
    })
    return () => unsub?.()
  }, [])

  const byDay = DAYS.reduce<Record<string, ChurchService[]>>((acc, day) => {
    acc[day] = services.filter(s => s.day === day).sort((a, b) => a.time.localeCompare(b.time))
    return acc
  }, {})

  function openCreate() { setEditing(null); setForm({recurring:true,day:'Saturday'}); setModal(true) }
  function openEdit(s: ChurchService) { setEditing(s); setForm({...s}); setModal(true) }

  async function handleSave() {
    if (!form.name?.trim()) return
    try {
      if (editing) {
        await updateService(editing.id, form)
        await logActivity(userName, 'Updated', `Service: ${form.name}`)
      } else {
        const n: Omit<ChurchService, 'id'> = {
          name: form.name!, day: form.day || 'Saturday',
          time: form.time || '', description: form.description || '',
          speaker: form.speaker || '', livestreamLink: form.livestreamLink || '',
          recurring: form.recurring ?? true,
        }
        await createService(n)
        await logActivity(userName, 'Created', `Service: ${n.name}`)
      }
    } catch (err) {
      console.warn('Firestore service save error:', err)
      if (editing) {
        setServices(prev=>prev.map(s=>s.id===editing.id?{...s,...form} as ChurchService:s))
      } else {
        const fallback: ChurchService = {
          id:`sv${Date.now()}`, name:form.name!, day:form.day||'Saturday',
          time:form.time||'', description:form.description||'',
          speaker:form.speaker, livestreamLink:form.livestreamLink,
          recurring:form.recurring||true,
        }
        setServices(prev=>[...prev,fallback])
      }
    }
    setModal(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteService(deleteTarget.id)
      await logActivity(userName, 'Deleted', `Service: ${deleteTarget.name}`)
    } catch (err) {
      console.warn('Firestore service delete error:', err)
      setServices(prev=>prev.filter(s=>s.id!==deleteTarget.id))
    }
    setDel(null)
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Services & Times</PageTitle>
          <PageSubtitle>Configure worship services, prayer meetings, and Sabbath schedules</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Add Service</Btn></PageActions>
      </PageHeader>

      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        {DAYS.map(day => {
          const dayServices = byDay[day] || []
          if (dayServices.length === 0) return null
          return (
            <Card key={day}>
              <CardHeader><CardTitle>{day}</CardTitle></CardHeader>
              <CardBody style={{paddingTop:0}}>
                {dayServices.map(s => (
                  <ServiceRow key={s.id}>
                    <TimeBox>{s.time}</TimeBox>
                    <ServiceInfo>
                      <ServiceName>{s.name}</ServiceName>
                      <ServiceMeta>
                        {s.speaker && `🎤 ${s.speaker} &bull; `}
                        {s.description}
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
          )
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <ModalOverlay onClick={()=>setModal(false)}>
          <ModalBox onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing ? 'Edit Service' : 'Add Church Service'}</ModalTitle>
              <CloseBtn onClick={()=>setModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Service Name *</Label>
                <Input placeholder="e.g. Divine Worship Service" value={form.name||''} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Day of Week</Label>
                  <Select value={form.day||'Saturday'} onChange={e=>setForm(f=>({...f,day:e.target.value}))}>
                    {DAYS.map(d=><option key={d} value={d}>{d}</option>)}
                  </Select>
                </FormGroup>
                <FormGroup><Label>Time *</Label><Input placeholder="11:30 AM" value={form.time||''} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGroup><Label>Regular Speaker / Teacher</Label>
                <Input placeholder="e.g. Pastor Ngwenya" value={form.speaker||''} onChange={e=>setForm(f=>({...f,speaker:e.target.value}))}/>
              </FormGroup>
              <FormGroup><Label>Livestream Link (optional)</Label>
                <Input placeholder="https://youtube.com/..." value={form.livestreamLink||''} onChange={e=>setForm(f=>({...f,livestreamLink:e.target.value}))}/>
              </FormGroup>
              <FormGroup><Label>Description</Label>
                <Textarea placeholder="What happens during this service…" value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Save Service'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Service"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={()=>setDel(null)}
        />
      )}
    </PageShell>
  )
}

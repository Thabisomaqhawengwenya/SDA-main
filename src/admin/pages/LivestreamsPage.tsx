import { useState } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, Badge, statusVariant, Btn, SectionLabel,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, FormGrid, Label, Input, Textarea, Select, EmptyState, ConfirmDialog, Grid3,
} from '../components/ui'
import { mockLivestreams } from '../mockData'
import type { Livestream } from '../adminTypes'

const StreamCard = styled(Card)`overflow:hidden;`
const StreamBody = styled.div`padding:18px;`
const StreamTitle = styled.h3`font-family:${t.fonts.sans}; font-size:14px; font-weight:600; color:${t.colors.text}; margin:0 0 6px;`
const StreamMeta  = styled.p`font-family:${t.fonts.sans}; font-size:12px; color:${t.colors.textMuted}; margin:0 0 4px;`
const StreamLinks = styled.div`display:flex; flex-wrap:wrap; gap:6px; margin-top:10px;`
const StreamLink  = styled.a<{$color:string}>`
  display:inline-flex; align-items:center; gap:5px;
  font-family:${t.fonts.sans}; font-size:11px; font-weight:600;
  color:${({$color})=>$color}; background:${({$color})=>$color}18;
  border:1px solid ${({$color})=>$color}30; border-radius:6px;
  padding:4px 10px; text-decoration:none;
  &:hover{opacity:0.8;}
`
const StreamFooter = styled.div`padding:12px 18px; border-top:1px solid ${t.colors.border}; display:flex; justify-content:flex-end; gap:6px;`

export default function LivestreamsPage() {
  const [streams, setStreams]    = useState<Livestream[]>(mockLivestreams)
  const [showModal, setModal]    = useState(false)
  const [editing, setEditing]    = useState<Livestream | null>(null)
  const [deleteTarget, setDel]   = useState<Livestream | null>(null)
  const [form, setForm]          = useState<Partial<Livestream>>({})

  const upcoming = streams.filter(s => s.status === 'upcoming' || s.status === 'live')
  const past     = streams.filter(s => s.status === 'past')

  function openCreate() { setEditing(null); setForm({status:'upcoming'}); setModal(true) }
  function openEdit(s: Livestream) { setEditing(s); setForm({...s}); setModal(true) }

  function handleSave() {
    if (!form.title?.trim()) return
    if (editing) {
      setStreams(prev=>prev.map(s=>s.id===editing.id?{...s,...form} as Livestream:s))
    } else {
      const n: Livestream = {
        id:`l${Date.now()}`, title:form.title!, date:form.date||'',
        time:form.time||'', description:form.description||'',
        status:form.status as Livestream['status']||'upcoming',
        youtubeUrl:form.youtubeUrl, facebookUrl:form.facebookUrl, tiktokUrl:form.tiktokUrl,
      }
      setStreams(prev=>[n,...prev])
    }
    setModal(false)
  }

  function handleDelete() {
    if (deleteTarget) setStreams(prev=>prev.filter(s=>s.id!==deleteTarget.id))
    setDel(null)
  }

  const renderCard = (s: Livestream) => (
    <StreamCard key={s.id}>
      <StreamBody>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
          <StreamTitle>{s.title}</StreamTitle>
          <Badge $variant={statusVariant(s.status)}>{s.status}</Badge>
        </div>
        <StreamMeta>📅 {new Date(s.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})}</StreamMeta>
        <StreamMeta>🕐 {s.time}</StreamMeta>
        <StreamMeta style={{marginTop:6,lineHeight:1.6}}>{s.description}</StreamMeta>
        <StreamLinks>
          {s.youtubeUrl  && <StreamLink href={s.youtubeUrl}  target="_blank" $color="#ef4444">▶ YouTube</StreamLink>}
          {s.facebookUrl && <StreamLink href={s.facebookUrl} target="_blank" $color="#3b82f6">f Facebook</StreamLink>}
          {s.tiktokUrl   && <StreamLink href={s.tiktokUrl}   target="_blank" $color="#1d1d1d">♪ TikTok</StreamLink>}
        </StreamLinks>
      </StreamBody>
      <StreamFooter>
        <Btn $variant="ghost" $size="sm" onClick={()=>openEdit(s)}>Edit</Btn>
        <Btn $variant="danger" $size="sm" onClick={()=>setDel(s)}>Delete</Btn>
      </StreamFooter>
    </StreamCard>
  )

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Livestreams</PageTitle>
          <PageSubtitle>Schedule and manage church livestreams across platforms</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Schedule Livestream</Btn></PageActions>
      </PageHeader>

      {upcoming.length > 0 && (
        <>
          <SectionLabel style={{marginBottom:16}}>Upcoming Livestreams</SectionLabel>
          <Grid3 style={{marginBottom:32}}>
            {upcoming.map(renderCard)}
          </Grid3>
        </>
      )}

      <SectionLabel style={{marginBottom:16}}>Previous Livestreams</SectionLabel>
      {past.length === 0 ? (
        <Card>
          <EmptyState
            icon={<svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>}
            title="No previous livestreams"
            description="Past livestream recordings will be archived here."
          />
        </Card>
      ) : (
        <Grid3>{past.map(renderCard)}</Grid3>
      )}

      {showModal && (
        <ModalOverlay onClick={()=>setModal(false)}>
          <ModalBox onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing?'Edit Livestream':'Schedule Livestream'}</ModalTitle>
              <CloseBtn onClick={()=>setModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Title *</Label><Input value={form.title||''} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></FormGroup>
              <FormGrid>
                <FormGroup><Label>Date</Label><Input type="date" value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></FormGroup>
                <FormGroup><Label>Time</Label><Input type="time" value={form.time||''} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGroup><Label>Status</Label>
                <Select value={form.status||'upcoming'} onChange={e=>setForm(f=>({...f,status:e.target.value as Livestream['status']}))}>
                  <option value="upcoming">Upcoming</option><option value="live">Live</option><option value="past">Past</option>
                </Select>
              </FormGroup>
              <FormGroup><Label>YouTube URL</Label><Input placeholder="https://youtube.com/…" value={form.youtubeUrl||''} onChange={e=>setForm(f=>({...f,youtubeUrl:e.target.value}))}/></FormGroup>
              <FormGroup><Label>Facebook URL</Label><Input placeholder="https://facebook.com/…" value={form.facebookUrl||''} onChange={e=>setForm(f=>({...f,facebookUrl:e.target.value}))}/></FormGroup>
              <FormGroup><Label>TikTok URL</Label><Input placeholder="https://tiktok.com/…" value={form.tiktokUrl||''} onChange={e=>setForm(f=>({...f,tiktokUrl:e.target.value}))}/></FormGroup>
              <FormGroup><Label>Description</Label><Textarea value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing?'Save Changes':'Schedule'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Delete Livestream" message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete} onCancel={()=>setDel(null)}/>
      )}
    </PageShell>
  )
}

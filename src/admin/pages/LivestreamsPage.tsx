import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, Badge, Btn, SectionLabel,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, FormGrid, Label, Input, Textarea, Select, EmptyState, ConfirmDialog, Grid3,
} from '../components/ui'
import { mockLivestreams } from '../mockData'
import type { Livestream } from '../adminTypes'
import { subscribeLivestreams, createLivestream, updateLivestream, deleteLivestream } from '../../services/livestreamsService'
import { logActivity } from '../../services/activityService'
import { useAuth } from '../../context/AuthContext'

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
  const { adminProfile, user }   = useAuth()

  const userName = adminProfile?.name || user?.displayName || 'Admin'

  useEffect(() => {
    const unsub = subscribeLivestreams((items) => {
      if (items.length > 0) setStreams(items)
    })
    return () => unsub?.()
  }, [])

  const upcoming = streams.filter(s => s.status === 'upcoming' || s.status === 'live')
  const past     = streams.filter(s => s.status === 'past')

  function openCreate() {
    setEditing(null)
    const now = new Date().toISOString().split('T')[0]
    setForm({ status: 'upcoming', date: now, time: '11:30 AM' })
    setModal(true)
  }

  function openEdit(s: Livestream) { setEditing(s); setForm({...s}); setModal(true) }

  async function handleSave() {
    if (!form.title?.trim()) return
    try {
      if (editing) {
        await updateLivestream(editing.id, form)
        await logActivity(userName, 'Updated', `Livestream: ${form.title}`)
      } else {
        const n: Omit<Livestream, 'id'> = {
          title: form.title!, date: form.date || '',
          time: form.time || '', description: form.description || '',
          status: (form.status as Livestream['status']) || 'upcoming',
          youtubeUrl: form.youtubeUrl || '', facebookUrl: form.facebookUrl || '', tiktokUrl: form.tiktokUrl || '',
        }
        await createLivestream(n)
        await logActivity(userName, 'Scheduled', `Livestream: ${n.title}`)
      }
    } catch (err) {
      console.warn('Firestore livestream save error:', err)
      if (editing) {
        setStreams(prev => prev.map(s => s.id === editing.id ? {...s,...form} as Livestream : s))
      } else {
        const fallback: Livestream = {
          id: `l${Date.now()}`, title: form.title!, date: form.date || '',
          time: form.time || '', description: form.description || '',
          status: (form.status as Livestream['status']) || 'upcoming',
          youtubeUrl: form.youtubeUrl, facebookUrl: form.facebookUrl, tiktokUrl: form.tiktokUrl,
        }
        setStreams(prev => [fallback, ...prev])
      }
    }
    setModal(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteLivestream(deleteTarget.id)
      await logActivity(userName, 'Deleted', `Livestream: ${deleteTarget.title}`)
    } catch (err) {
      console.warn('Firestore livestream delete error:', err)
      setStreams(prev => prev.filter(s => s.id !== deleteTarget.id))
    }
    setDel(null)
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Livestreams</PageTitle>
          <PageSubtitle>Configure YouTube, Facebook, and TikTok streaming links for worship services</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Schedule Stream</Btn></PageActions>
      </PageHeader>

      <SectionLabel>Upcoming & Live Streams</SectionLabel>
      {upcoming.length === 0 ? (
        <Card style={{marginBottom:24}}>
          <EmptyState
            icon={<svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>}
            title="No upcoming livestreams"
            description="Schedule a livestream for this Sabbath's service."
            action={<Btn onClick={openCreate}>Schedule Stream</Btn>}
          />
        </Card>
      ) : (
        <Grid3 style={{marginBottom:32}}>
          {upcoming.map(s => (
            <StreamCard key={s.id}>
              <StreamBody>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                  <StreamTitle>{s.title}</StreamTitle>
                  <Badge $variant={s.status==='live'?'danger':'warning'}>{s.status.toUpperCase()}</Badge>
                </div>
                <StreamMeta>📅 {new Date(s.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})} at {s.time}</StreamMeta>
                {s.description && <StreamMeta>{s.description}</StreamMeta>}
                <StreamLinks>
                  {s.youtubeUrl  && <StreamLink href={s.youtubeUrl}  target="_blank" rel="noreferrer" $color="#ff0000">YouTube</StreamLink>}
                  {s.facebookUrl && <StreamLink href={s.facebookUrl} target="_blank" rel="noreferrer" $color="#1877f2">Facebook</StreamLink>}
                  {s.tiktokUrl   && <StreamLink href={s.tiktokUrl}   target="_blank" rel="noreferrer" $color="#010101">TikTok</StreamLink>}
                </StreamLinks>
              </StreamBody>
              <StreamFooter>
                <Btn $variant="ghost" $size="sm" onClick={()=>openEdit(s)}>Edit</Btn>
                <Btn $variant="danger" $size="sm" onClick={()=>setDel(s)}>Delete</Btn>
              </StreamFooter>
            </StreamCard>
          ))}
        </Grid3>
      )}

      {past.length > 0 && (
        <>
          <SectionLabel>Past Broadcasts</SectionLabel>
          <Grid3>
            {past.map(s => (
              <StreamCard key={s.id} style={{opacity:0.8}}>
                <StreamBody>
                  <StreamTitle>{s.title}</StreamTitle>
                  <StreamMeta>📅 {new Date(s.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</StreamMeta>
                  <StreamLinks>
                    {s.youtubeUrl && <StreamLink href={s.youtubeUrl} target="_blank" rel="noreferrer" $color="#ff0000">Watch Recording</StreamLink>}
                  </StreamLinks>
                </StreamBody>
                <StreamFooter>
                  <Btn $variant="danger" $size="sm" onClick={()=>setDel(s)}>Delete</Btn>
                </StreamFooter>
              </StreamCard>
            ))}
          </Grid3>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <ModalOverlay onClick={()=>setModal(false)}>
          <ModalBox onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing ? 'Edit Livestream' : 'Schedule Livestream'}</ModalTitle>
              <CloseBtn onClick={()=>setModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Broadcast Title *</Label>
                <Input placeholder="e.g. Divine Worship Service" value={form.title||''} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Date *</Label><Input type="date" value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></FormGroup>
                <FormGroup><Label>Time *</Label><Input placeholder="11:30 AM" value={form.time||''} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGroup><Label>Status</Label>
                <Select value={form.status||'upcoming'} onChange={e=>setForm(f=>({...f,status:e.target.value as Livestream['status']}))}>
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live Now</option>
                  <option value="past">Past / Concluded</option>
                </Select>
              </FormGroup>
              <FormGroup><Label>YouTube Live / Stream URL</Label>
                <Input placeholder="https://youtube.com/watch?v=..." value={form.youtubeUrl||''} onChange={e=>setForm(f=>({...f,youtubeUrl:e.target.value}))}/>
              </FormGroup>
              <FormGroup><Label>Facebook Live URL</Label>
                <Input placeholder="https://facebook.com/..." value={form.facebookUrl||''} onChange={e=>setForm(f=>({...f,facebookUrl:e.target.value}))}/>
              </FormGroup>
              <FormGroup><Label>TikTok Live URL</Label>
                <Input placeholder="https://tiktok.com/@..." value={form.tiktokUrl||''} onChange={e=>setForm(f=>({...f,tiktokUrl:e.target.value}))}/>
              </FormGroup>
              <FormGroup><Label>Notes / Program Outline</Label>
                <Textarea placeholder="Order of service or notes…" value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Schedule Broadcast'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Livestream"
          message={`Are you sure you want to delete "${deleteTarget.title}"?`}
          onConfirm={handleDelete}
          onCancel={()=>setDel(null)}
        />
      )}
    </PageShell>
  )
}

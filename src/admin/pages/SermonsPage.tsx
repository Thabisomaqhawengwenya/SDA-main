import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, Badge, statusVariant, Btn, Grid3,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, FormGrid, Label, Input, Textarea, Select, EmptyState, ConfirmDialog,
  Toolbar, ToolbarLeft, ToolbarRight, SearchWrap, SearchInput,
} from '../components/ui'
import ImageUploader from '../components/ImageUploader'
import { mockSermons } from '../mockData'
import type { Sermon, PublishStatus } from '../adminTypes'
import { subscribeSermons, createSermon, updateSermon, deleteSermon } from '../../services/sermonsService'
import { logActivity } from '../../services/activityService'
import { useAuth } from '../../context/AuthContext'

const SermonCard = styled(Card)`overflow:hidden; display:flex; flex-direction:column;`
const SermonThumb = styled.div<{$url?:string}>`
  height:140px;
  background:${({$url})=>$url?`url(${$url}) center/cover`:`linear-gradient(135deg,${t.colors.sidebarBg},#1a2f4a)`};
  position:relative; flex-shrink:0;
`
const SermonThumbLabel = styled.div`
  position:absolute; bottom:10px; left:10px;
  background:rgba(0,0,0,0.65); border-radius:4px; padding:3px 8px;
  font-family:${t.fonts.sans}; font-size:11px; font-weight:600; color:#fff;
`
const SermonBody = styled.div`padding:16px; flex:1; display:flex; flex-direction:column; gap:6px;`
const SermonTitle = styled.h3`font-family:${t.fonts.sans}; font-size:14px; font-weight:600; color:${t.colors.text}; margin:0; line-height:1.3;`
const SermonMeta  = styled.p`font-family:${t.fonts.sans}; font-size:12px; color:${t.colors.textMuted}; margin:0;`
const SermonFooter = styled.div`padding:12px 16px; border-top:1px solid ${t.colors.border}; display:flex; align-items:center; justify-content:space-between; gap:8px;`
const ViewCount = styled.span`font-family:${t.fonts.sans}; font-size:12px; color:${t.colors.textMuted};`
const ActionGroup = styled.div`display:flex; gap:6px;`

export default function SermonsPage() {
  const [sermons, setSermons]       = useState<Sermon[]>(mockSermons)
  const [search, setSearch]         = useState('')
  const [filterStatus, setFilter]   = useState<string>('all')
  const [showModal, setShowModal]   = useState(false)
  const [editing, setEditing]       = useState<Sermon | null>(null)
  const [deleteTarget, setDelete]   = useState<Sermon | null>(null)
  const [form, setForm]             = useState<Partial<Sermon>>({})
  const { adminProfile, user }      = useAuth()

  const userName = adminProfile?.name || user?.displayName || 'Admin'

  useEffect(() => {
    const unsub = subscribeSermons((items) => {
      if (items.length > 0) setSermons(items)
    })
    return () => unsub?.()
  }, [])

  const filtered = sermons.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.speaker.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || s.status === filterStatus
    return matchSearch && matchStatus
  })

  function openCreate() {
    setEditing(null)
    const now = new Date().toISOString().split('T')[0]
    setForm({ status: 'draft', date: now, speaker: 'Pastor Ngwenya' })
    setShowModal(true)
  }

  function openEdit(s: Sermon) { setEditing(s); setForm({...s}); setShowModal(true) }

  async function handleSave() {
    if (!form.title?.trim()) return
    try {
      if (editing) {
        await updateSermon(editing.id, form)
        await logActivity(userName, 'Updated', `Sermon: ${form.title}`)
      } else {
        const n: Omit<Sermon, 'id'> = {
          title: form.title!, speaker: form.speaker || '',
          date: form.date || new Date().toISOString().split('T')[0],
          scripture: form.scripture || '',
          description: form.description || '', category: form.category || 'General',
          views: 0, status: (form.status as PublishStatus) || 'draft',
          videoUrl: form.videoUrl || '', audioUrl: form.audioUrl || '',
          thumbnail: form.thumbnail || '', duration: form.duration || '',
        }
        await createSermon(n)
        await logActivity(userName, 'Created', `Sermon: ${n.title}`)
      }
    } catch (err) {
      console.warn('Firestore sermon save error:', err)
      if (editing) {
        setSermons(prev => prev.map(s => s.id === editing.id ? {...s, ...form} as Sermon : s))
      } else {
        const fallback: Sermon = {
          id: `s${Date.now()}`, title: form.title!, speaker: form.speaker || '',
          date: form.date || '', scripture: form.scripture || '',
          description: form.description || '', category: form.category || '',
          views: 0, status: form.status as PublishStatus || 'draft',
          thumbnail: form.thumbnail || '', duration: form.duration || '',
        }
        setSermons(prev => [fallback, ...prev])
      }
    }
    setShowModal(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteSermon(deleteTarget.id)
      await logActivity(userName, 'Deleted', `Sermon: ${deleteTarget.title}`)
    } catch (err) {
      console.warn('Firestore sermon delete error:', err)
      setSermons(prev => prev.filter(s => s.id !== deleteTarget.id))
    }
    setDelete(null)
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Sermons</PageTitle>
          <PageSubtitle>Upload, organize, and publish sermon recordings and notes</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Upload Sermon</Btn></PageActions>
      </PageHeader>

      <Card style={{marginBottom:24}}>
        <Toolbar style={{padding:'16px 20px'}}>
          <ToolbarLeft>
            <SearchWrap>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
              <SearchInput placeholder="Search by title or speaker…" value={search} onChange={e=>setSearch(e.target.value)} />
            </SearchWrap>
            <Select style={{width:140}} value={filterStatus} onChange={e=>setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </Select>
          </ToolbarLeft>
          <ToolbarRight>
            <span style={{fontFamily:t.fonts.sans,fontSize:13,color:t.colors.textMuted}}>{filtered.length} sermon{filtered.length!==1?'s':''}</span>
          </ToolbarRight>
        </Toolbar>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
          title="No sermons found"
          description="Uploaded and published sermons will appear here."
          action={<Btn onClick={openCreate}>Upload Sermon</Btn>}
        />
      ) : (
        <Grid3>
          {filtered.map(s => (
            <SermonCard key={s.id}>
              <SermonThumb $url={s.thumbnail}>
                {s.duration && <SermonThumbLabel>{s.duration}</SermonThumbLabel>}
              </SermonThumb>
              <SermonBody>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                  <SermonTitle>{s.title}</SermonTitle>
                  <Badge $variant={statusVariant(s.status)}>{s.status}</Badge>
                </div>
                <SermonMeta>🎤 {s.speaker} &bull; {new Date(s.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</SermonMeta>
                {s.scripture && <SermonMeta style={{color:t.colors.primary}}>📖 {s.scripture}</SermonMeta>}
              </SermonBody>
              <SermonFooter>
                <ViewCount>👁 {s.views || 0} views</ViewCount>
                <ActionGroup>
                  <Btn $variant="ghost" $size="sm" onClick={()=>openEdit(s)}>Edit</Btn>
                  <Btn $variant="danger" $size="sm" onClick={()=>setDelete(s)}>Delete</Btn>
                </ActionGroup>
              </SermonFooter>
            </SermonCard>
          ))}
        </Grid3>
      )}

      {/* Modal */}
      {showModal && (
        <ModalOverlay onClick={()=>setShowModal(false)}>
          <ModalBox onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing ? 'Edit Sermon' : 'Upload Sermon'}</ModalTitle>
              <CloseBtn onClick={()=>setShowModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Sermon Title *</Label>
                <Input placeholder="e.g. The God Who Sees You" value={form.title||''} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Speaker *</Label><Input placeholder="e.g. Pastor Ngwenya" value={form.speaker||''} onChange={e=>setForm(f=>({...f,speaker:e.target.value}))}/></FormGroup>
                <FormGroup><Label>Date</Label><Input type="date" value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGrid>
                <FormGroup><Label>Scripture Reference</Label><Input placeholder="e.g. Genesis 16:13" value={form.scripture||''} onChange={e=>setForm(f=>({...f,scripture:e.target.value}))}/></FormGroup>
                <FormGroup><Label>Category / Series</Label><Input placeholder="e.g. Faith, Hope, Prophecy" value={form.category||''} onChange={e=>setForm(f=>({...f,category:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGrid>
                <FormGroup><Label>Status</Label>
                  <Select value={form.status||'draft'} onChange={e=>setForm(f=>({...f,status:e.target.value as PublishStatus}))}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Select>
                </FormGroup>
                <FormGroup><Label>Duration</Label><Input placeholder="e.g. 45 min" value={form.duration||''} onChange={e=>setForm(f=>({...f,duration:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGroup><Label>Video URL (YouTube / Vimeo)</Label>
                <Input placeholder="https://youtube.com/watch?v=..." value={form.videoUrl||''} onChange={e=>setForm(f=>({...f,videoUrl:e.target.value}))}/>
              </FormGroup>
              <FormGroup><Label>Audio URL / Podcast</Label>
                <Input placeholder="https://..." value={form.audioUrl||''} onChange={e=>setForm(f=>({...f,audioUrl:e.target.value}))}/>
              </FormGroup>
              <FormGroup><Label>Description / Sermon Notes</Label>
                <Textarea placeholder="Key takeaways and scripture breakdown…" value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
              </FormGroup>
              <ImageUploader
                label="Sermon Thumbnail"
                value={form.thumbnail||''}
                onChange={url=>setForm(f=>({...f,thumbnail:url}))}
                aspectRatio="16 / 9"
                folder="sermons"
              />
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={()=>setShowModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Save Sermon'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Sermon"
          message={`Are you sure you want to delete "${deleteTarget.title}"?`}
          onConfirm={handleDelete}
          onCancel={()=>setDelete(null)}
        />
      )}
    </PageShell>
  )
}

import { useState } from 'react'
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

  const filtered = sermons.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.speaker.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || s.status === filterStatus
    return matchSearch && matchStatus
  })

  function openCreate() { setEditing(null); setForm({status:'draft'}); setShowModal(true) }
  function openEdit(s: Sermon) { setEditing(s); setForm({...s}); setShowModal(true) }

  function handleSave() {
    if (!form.title?.trim()) return
    if (editing) {
      setSermons(prev => prev.map(s => s.id===editing.id ? {...s,...form} as Sermon : s))
    } else {
      const n: Sermon = {
        id:`s${Date.now()}`, title:form.title!, speaker:form.speaker||'',
        date:form.date||'', scripture:form.scripture||'',
        description:form.description||'', category:form.category||'',
        views:0, status:form.status as PublishStatus||'draft',
        duration:form.duration||'', videoUrl:form.videoUrl, thumbnail:form.thumbnail,
      }
      setSermons(prev=>[n,...prev])
    }
    setShowModal(false)
  }

  function handleDelete() {
    if (deleteTarget) setSermons(prev=>prev.filter(s=>s.id!==deleteTarget.id))
    setDelete(null)
  }

  function togglePublish(s: Sermon) {
    setSermons(prev=>prev.map(x=>x.id===s.id?{...x,status:x.status==='published'?'draft':'published'}:x))
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Sermons & Media</PageTitle>
          <PageSubtitle>Upload and manage sermon recordings, audio, and media</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Upload Sermon</Btn></PageActions>
      </PageHeader>

      <Toolbar style={{marginBottom:20}}>
        <ToolbarLeft>
          <SearchWrap>
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
            <SearchInput placeholder="Search sermons…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </SearchWrap>
          <Select style={{width:140}} value={filterStatus} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Select>
        </ToolbarLeft>
        <ToolbarRight>
          <span style={{fontFamily:t.fonts.sans,fontSize:13,color:t.colors.textMuted}}>{filtered.length} sermon{filtered.length!==1?'s':''}</span>
        </ToolbarRight>
      </Toolbar>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
            title="No sermons found"
            description="Uploaded sermon recordings will appear here."
            action={<Btn onClick={openCreate}>Upload Sermon</Btn>}
          />
        </Card>
      ) : (
        <Grid3>
          {filtered.map(s => (
            <SermonCard key={s.id}>
              <SermonThumb $url={s.thumbnail}>
                {s.duration && <SermonThumbLabel>{s.duration}</SermonThumbLabel>}
              </SermonThumb>
              <SermonBody>
                <SermonTitle>{s.title}</SermonTitle>
                <SermonMeta>{s.speaker} · {new Date(s.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</SermonMeta>
                <SermonMeta>{s.scripture}</SermonMeta>
                <Badge $variant={statusVariant(s.status)} style={{width:'fit-content'}}>{s.status}</Badge>
              </SermonBody>
              <SermonFooter>
                <ViewCount>👁 {s.views.toLocaleString()} views</ViewCount>
                <ActionGroup>
                  <Btn $variant="ghost" $size="sm" onClick={()=>openEdit(s)}>Edit</Btn>
                  <Btn $variant={s.status==='published'?'secondary':'success'} $size="sm" onClick={()=>togglePublish(s)}>
                    {s.status==='published'?'Unpublish':'Publish'}
                  </Btn>
                  <Btn $variant="danger" $size="sm" onClick={()=>setDelete(s)}>
                    <svg viewBox="0 0 24 24" style={{width:12,height:12}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </Btn>
                </ActionGroup>
              </SermonFooter>
            </SermonCard>
          ))}
        </Grid3>
      )}

      {showModal && (
        <ModalOverlay onClick={()=>setShowModal(false)}>
          <ModalBox onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing?'Edit Sermon':'Upload Sermon'}</ModalTitle>
              <CloseBtn onClick={()=>setShowModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Title *</Label>
                <Input placeholder="Sermon title" value={form.title||''} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Speaker</Label><Input value={form.speaker||''} onChange={e=>setForm(f=>({...f,speaker:e.target.value}))}/></FormGroup>
                <FormGroup><Label>Date</Label><Input type="date" value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGrid>
                <FormGroup><Label>Scripture Reference</Label><Input placeholder="e.g. John 3:16" value={form.scripture||''} onChange={e=>setForm(f=>({...f,scripture:e.target.value}))}/></FormGroup>
                <FormGroup><Label>Category</Label><Input placeholder="e.g. Hope" value={form.category||''} onChange={e=>setForm(f=>({...f,category:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGrid>
                <FormGroup><Label>Duration</Label><Input placeholder="e.g. 45 min" value={form.duration||''} onChange={e=>setForm(f=>({...f,duration:e.target.value}))}/></FormGroup>
                <FormGroup><Label>Status</Label>
                  <Select value={form.status||'draft'} onChange={e=>setForm(f=>({...f,status:e.target.value as PublishStatus}))}>
                    <option value="draft">Draft</option><option value="published">Published</option>
                  </Select>
                </FormGroup>
              </FormGrid>
              <FormGroup><Label>Video URL</Label><Input placeholder="https://youtube.com/…" value={form.videoUrl||''} onChange={e=>setForm(f=>({...f,videoUrl:e.target.value}))}/></FormGroup>
              <ImageUploader
                label="Sermon Thumbnail"
                value={form.thumbnail||''}
                onChange={url=>setForm(f=>({...f,thumbnail:url}))}
                aspectRatio="16 / 9"
              />
              <FormGroup><Label>Description</Label><Textarea value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={()=>setShowModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing?'Save Changes':'Upload Sermon'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Delete Sermon" message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete} onCancel={()=>setDelete(null)}/>
      )}
    </PageShell>
  )
}

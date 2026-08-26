import { useState } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, Badge, statusVariant, Btn, TableWrap, Table, Thead, Th, Tbody, Tr, Td,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, FormGrid, Label, Input, Textarea, Select, EmptyState, ConfirmDialog,
  Toolbar, ToolbarLeft, ToolbarRight, SearchWrap, SearchInput,
} from '../components/ui'
import { mockAnnouncements } from '../mockData'
import type { Announcement, PublishStatus } from '../adminTypes'

const FeaturedStar = styled.span`color:${t.colors.gold}; font-size:14px;`
const ActionGroup = styled.div`display:flex; align-items:center; gap:6px;`

const categoryVariant: Record<string, string> = {
  general: 'default', news: 'info', urgent: 'danger', ministry: 'accent',
}

export default function AnnouncementsPage() {
  const [items, setItems]           = useState<Announcement[]>(mockAnnouncements)
  const [search, setSearch]         = useState('')
  const [filterStatus, setFilter]   = useState<string>('all')
  const [showModal, setShowModal]   = useState(false)
  const [editing, setEditing]       = useState<Announcement | null>(null)
  const [deleteTarget, setDelete]   = useState<Announcement | null>(null)
  const [form, setForm]             = useState<Partial<Announcement>>({})

  const filtered = items.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || a.status === filterStatus
    return matchSearch && matchStatus
  })

  function openCreate() {
    setEditing(null)
    setForm({ status: 'draft', featured: false, category: 'general', author: 'Admin' })
    setShowModal(true)
  }

  function openEdit(a: Announcement) { setEditing(a); setForm({...a}); setShowModal(true) }

  function handleSave() {
    if (!form.title?.trim()) return
    if (editing) {
      setItems(prev => prev.map(a => a.id === editing.id ? {...a,...form} as Announcement : a))
    } else {
      const n: Announcement = {
        id: `a${Date.now()}`, createdAt: new Date().toISOString(),
        title: form.title!, description: form.description || '',
        category: form.category as Announcement['category'] || 'general',
        author: form.author || 'Admin',
        status: form.status as PublishStatus || 'draft',
        featured: form.featured || false,
        publishDate: form.publishDate || new Date().toISOString().split('T')[0],
      }
      setItems(prev => [n, ...prev])
    }
    setShowModal(false)
  }

  function handleDelete() {
    if (deleteTarget) setItems(prev => prev.filter(a => a.id !== deleteTarget.id))
    setDelete(null)
  }

  function cycleStatus(a: Announcement) {
    const next: Record<PublishStatus, PublishStatus> = {
      draft: 'scheduled', scheduled: 'published', published: 'archived', archived: 'draft',
    }
    setItems(prev => prev.map(x => x.id === a.id ? {...x, status: next[x.status]} : x))
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Announcements</PageTitle>
          <PageSubtitle>Manage church news, updates, and notices</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Add Announcement</Btn></PageActions>
      </PageHeader>

      <Card>
        <Toolbar style={{padding:'16px 20px 0'}}>
          <ToolbarLeft>
            <SearchWrap>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
              <SearchInput placeholder="Search announcements…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </SearchWrap>
            <Select style={{width:140}} value={filterStatus} onChange={e=>setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </ToolbarLeft>
          <ToolbarRight>
            <span style={{fontFamily:t.fonts.sans,fontSize:13,color:t.colors.textMuted}}>{filtered.length} announcement{filtered.length!==1?'s':''}</span>
          </ToolbarRight>
        </Toolbar>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
            title="No announcements found"
            description="Church announcements and news will appear here."
            action={<Btn onClick={openCreate}>Create Announcement</Btn>}
          />
        ) : (
          <TableWrap style={{borderRadius:0,border:'none',borderTop:`1px solid ${t.colors.border}`,marginTop:16}}>
            <Table>
              <Thead><tr>
                <Th>Title</Th><Th>Category</Th><Th>Author</Th>
                <Th>Date</Th><Th>Status</Th><Th>Featured</Th><Th>Actions</Th>
              </tr></Thead>
              <Tbody>
                {filtered.map(a => (
                  <Tr key={a.id}>
                    <Td style={{fontWeight:500,maxWidth:260}}>{a.title}</Td>
                    <Td><Badge $variant={categoryVariant[a.category] as any}>{a.category}</Badge></Td>
                    <Td>{a.author}</Td>
                    <Td>{new Date(a.publishDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</Td>
                    <Td><Badge $variant={statusVariant(a.status)}>{a.status}</Badge></Td>
                    <Td>{a.featured ? <FeaturedStar>★</FeaturedStar> : <span style={{color:t.colors.textMuted}}>—</span>}</Td>
                    <Td>
                      <ActionGroup>
                        <Btn $variant="ghost" $size="sm" onClick={()=>openEdit(a)}>Edit</Btn>
                        <Btn $variant="secondary" $size="sm" onClick={()=>cycleStatus(a)}>
                          {a.status==='draft'?'Schedule':a.status==='scheduled'?'Publish':a.status==='published'?'Archive':'Restore'}
                        </Btn>
                        <Btn $variant="danger" $size="sm" onClick={()=>setDelete(a)}>Delete</Btn>
                      </ActionGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrap>
        )}
      </Card>

      {showModal && (
        <ModalOverlay onClick={()=>setShowModal(false)}>
          <ModalBox onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing ? 'Edit Announcement' : 'New Announcement'}</ModalTitle>
              <CloseBtn onClick={()=>setShowModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Title *</Label>
                <Input placeholder="Announcement title" value={form.title||''} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Category</Label>
                  <Select value={form.category||'general'} onChange={e=>setForm(f=>({...f,category:e.target.value as any}))}>
                    <option value="general">General</option>
                    <option value="news">News</option>
                    <option value="urgent">Urgent</option>
                    <option value="ministry">Ministry</option>
                  </Select>
                </FormGroup>
                <FormGroup><Label>Status</Label>
                  <Select value={form.status||'draft'} onChange={e=>setForm(f=>({...f,status:e.target.value as PublishStatus}))}>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Select>
                </FormGroup>
              </FormGrid>
              <FormGrid>
                <FormGroup><Label>Author</Label>
                  <Input value={form.author||''} onChange={e=>setForm(f=>({...f,author:e.target.value}))}/>
                </FormGroup>
                <FormGroup><Label>Publish Date</Label>
                  <Input type="date" value={form.publishDate||''} onChange={e=>setForm(f=>({...f,publishDate:e.target.value}))}/>
                </FormGroup>
              </FormGrid>
              <FormGroup><Label>Description</Label>
                <Textarea placeholder="Announcement details…" value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
              </FormGroup>
              <FormGroup>
                <label style={{display:'flex',alignItems:'center',gap:8,fontFamily:t.fonts.sans,fontSize:13,cursor:'pointer'}}>
                  <input type="checkbox" checked={form.featured||false} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))}/>
                  Mark as Featured
                </label>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={()=>setShowModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Create Announcement'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Announcement"
          message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={()=>setDelete(null)}
        />
      )}
    </PageShell>
  )
}

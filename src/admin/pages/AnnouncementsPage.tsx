import { useState, useEffect } from 'react'
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
import { subscribeAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../services/announcementsService'
import { logActivity } from '../../services/activityService'
import { useAuth } from '../../context/AuthContext'

const FeaturedStar = styled.span`color:${t.colors.gold}; font-size:14px;`
const ActionGroup = styled.div`display:flex; align-items:center; gap:6px;`

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'accent'

const categoryVariant: Record<string, BadgeVariant> = {
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
  const { adminProfile, user }      = useAuth()

  const userName = adminProfile?.name || user?.displayName || 'Admin'

  useEffect(() => {
    const unsub = subscribeAnnouncements((data) => {
      if (data.length > 0) setItems(data)
    })
    return () => unsub?.()
  }, [])

  const filtered = items.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || a.status === filterStatus
    return matchSearch && matchStatus
  })

  function openCreate() {
    setEditing(null)
    setForm({ status: 'draft', featured: false, category: 'general', author: userName })
    setShowModal(true)
  }

  function openEdit(a: Announcement) { setEditing(a); setForm({...a}); setShowModal(true) }

  async function handleSave() {
    if (!form.title?.trim()) return
    try {
      if (editing) {
        await updateAnnouncement(editing.id, form)
        await logActivity(userName, 'Updated', `Announcement: ${form.title}`)
      } else {
        const n: Omit<Announcement, 'id'> = {
          createdAt: new Date().toISOString(),
          title: form.title!, description: form.description || '',
          category: (form.category as Announcement['category']) || 'general',
          author: form.author || userName,
          status: (form.status as PublishStatus) || 'draft',
          featured: form.featured || false,
          publishDate: form.publishDate || new Date().toISOString().split('T')[0],
        }
        await createAnnouncement(n)
        await logActivity(userName, 'Created', `Announcement: ${n.title}`)
      }
    } catch (err) {
      console.warn('Firestore announcement error:', err)
      if (editing) {
        setItems(prev => prev.map(a => a.id === editing.id ? {...a,...form} as Announcement : a))
      } else {
        const fallback: Announcement = {
          id: `a${Date.now()}`, createdAt: new Date().toISOString(),
          title: form.title!, description: form.description || '',
          category: form.category as Announcement['category'] || 'general',
          author: form.author || userName,
          status: form.status as PublishStatus || 'draft',
          featured: form.featured || false,
          publishDate: form.publishDate || new Date().toISOString().split('T')[0],
        }
        setItems(prev => [fallback, ...prev])
      }
    }
    setShowModal(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteAnnouncement(deleteTarget.id)
      await logActivity(userName, 'Deleted', `Announcement: ${deleteTarget.title}`)
    } catch (err) {
      console.warn('Firestore announcement delete error:', err)
      setItems(prev => prev.filter(a => a.id !== deleteTarget.id))
    }
    setDelete(null)
  }

  async function toggleFeatured(a: Announcement) {
    try {
      await updateAnnouncement(a.id, { featured: !a.featured })
    } catch (err) {
      setItems(prev => prev.map(x => x.id === a.id ? {...x, featured: !x.featured} : x))
    }
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Announcements</PageTitle>
          <PageSubtitle>Publish news, bulletin notices, and urgent church updates</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ New Announcement</Btn></PageActions>
      </PageHeader>

      <Card>
        <Toolbar style={{padding:'16px 20px 0'}}>
          <ToolbarLeft>
            <SearchWrap>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
              <SearchInput placeholder="Search announcements…" value={search} onChange={e=>setSearch(e.target.value)} />
            </SearchWrap>
            <Select style={{width:140}} value={filterStatus} onChange={e=>setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </Select>
          </ToolbarLeft>
          <ToolbarRight>
            <span style={{fontFamily:t.fonts.sans,fontSize:13,color:t.colors.textMuted}}>{filtered.length} item{filtered.length!==1?'s':''}</span>
          </ToolbarRight>
        </Toolbar>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
            title="No announcements found"
            description="Create your first announcement to share updates with the church."
            action={<Btn onClick={openCreate}>Create Announcement</Btn>}
          />
        ) : (
          <TableWrap style={{borderRadius:0,border:'none',borderTop:`1px solid ${t.colors.border}`,marginTop:16}}>
            <Table>
              <Thead>
                <tr>
                  <Th>Title</Th><Th>Category</Th><Th>Author</Th>
                  <Th>Publish Date</Th><Th>Status</Th><Th>Featured</Th><Th>Actions</Th>
                </tr>
              </Thead>
              <Tbody>
                {filtered.map(a => (
                  <Tr key={a.id}>
                    <Td style={{maxWidth:240,fontWeight:500}}>{a.title}</Td>
                    <Td><Badge $variant={categoryVariant[a.category]||'default'}>{a.category}</Badge></Td>
                    <Td>{a.author}</Td>
                    <Td>{new Date(a.publishDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</Td>
                    <Td><Badge $variant={statusVariant(a.status)}>{a.status}</Badge></Td>
                    <Td style={{textAlign:'center'}}>
                      <button onClick={()=>toggleFeatured(a)} style={{background:'none',border:'none',cursor:'pointer'}} title={a.featured?'Unfeature':'Feature'}>
                        {a.featured ? <FeaturedStar>★</FeaturedStar> : <span style={{color:t.colors.textMuted}}>☆</span>}
                      </button>
                    </Td>
                    <Td>
                      <ActionGroup>
                        <Btn $variant="ghost" $size="sm" onClick={()=>openEdit(a)}>Edit</Btn>
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

      {/* Modal */}
      {showModal && (
        <ModalOverlay onClick={()=>setShowModal(false)}>
          <ModalBox onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{editing ? 'Edit Announcement' : 'New Announcement'}</ModalTitle>
              <CloseBtn onClick={()=>setShowModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Title *</Label>
                <Input placeholder="Announcement title…" value={form.title||''} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Category</Label>
                  <Select value={form.category||'general'} onChange={e=>setForm(f=>({...f,category:e.target.value as Announcement['category']}))}>
                    <option value="general">General</option>
                    <option value="news">News</option>
                    <option value="urgent">Urgent</option>
                    <option value="ministry">Ministry</option>
                  </Select>
                </FormGroup>
                <FormGroup><Label>Status</Label>
                  <Select value={form.status||'draft'} onChange={e=>setForm(f=>({...f,status:e.target.value as PublishStatus}))}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Select>
                </FormGroup>
              </FormGrid>
              <FormGrid>
                <FormGroup><Label>Author</Label>
                  <Input placeholder="e.g. Pastor Ngwenya" value={form.author||''} onChange={e=>setForm(f=>({...f,author:e.target.value}))} />
                </FormGroup>
                <FormGroup><Label>Publish Date</Label>
                  <Input type="date" value={form.publishDate||''} onChange={e=>setForm(f=>({...f,publishDate:e.target.value}))} />
                </FormGroup>
              </FormGrid>
              <FormGroup><Label>Description / Body</Label>
                <Textarea placeholder="Full announcement text…" value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
              </FormGroup>
              <FormGroup>
                <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontFamily:t.fonts.sans,fontSize:13,color:t.colors.text}}>
                  <input type="checkbox" checked={form.featured||false} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))} />
                  Feature on website homepage
                </label>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={()=>setShowModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Publish Announcement'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Announcement"
          message={`Are you sure you want to delete "${deleteTarget.title}"?`}
          onConfirm={handleDelete}
          onCancel={()=>setDelete(null)}
        />
      )}
    </PageShell>
  )
}

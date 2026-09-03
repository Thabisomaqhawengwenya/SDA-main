import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, Badge, statusVariant, Btn, TableWrap, Table, Thead, Th, Tbody, Tr, Td,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, FormGrid, Label, Input, Textarea, Select, EmptyState, ConfirmDialog, Toolbar, ToolbarLeft, ToolbarRight, SearchWrap, SearchInput,
} from '../components/ui'
import ImageUploader from '../components/ImageUploader'
import { mockEvents } from '../mockData'
import type { AdminEvent, EventStatus } from '../adminTypes'
import { subscribeEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventsService'
import { logActivity } from '../../services/activityService'
import { useAuth } from '../../context/AuthContext'

const CategoryDot = styled.span<{$color:string}>`
  display:inline-block; width:8px; height:8px; border-radius:50%;
  background:${({$color})=>$color}; margin-right:7px; flex-shrink:0;
`
const TitleCell = styled.div`display:flex; align-items:center;`
const ActionGroup = styled.div`display:flex; align-items:center; gap:6px;`

const CATEGORIES = ['Bible Study','Prayer & Fasting','Youth','Community','Book Group','Worship']

export default function EventsAdminPage() {
  const [events, setEvents]         = useState<AdminEvent[]>(mockEvents)
  const [search, setSearch]         = useState('')
  const [filterStatus, setFilter]   = useState<string>('all')
  const [showModal, setShowModal]   = useState(false)
  const [editing, setEditing]       = useState<AdminEvent | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminEvent | null>(null)
  const [form, setForm]             = useState<Partial<AdminEvent>>({})
  const { adminProfile, user }      = useAuth()

  const userName = adminProfile?.name || user?.displayName || 'Admin'

  useEffect(() => {
    const unsub = subscribeEvents((items) => {
      if (items.length > 0) {
        setEvents(items)
      }
    })
    return () => unsub?.()
  }, [])

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || e.status === filterStatus
    return matchSearch && matchStatus
  })

  function openCreate() {
    setEditing(null)
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().slice(0, 5)
    setForm({ status: 'draft', categoryColor: '#3b82f6', date, time })
    setShowModal(true)
  }

  function openEdit(ev: AdminEvent) {
    setEditing(ev)
    setForm({ ...ev })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.title?.trim()) return
    try {
      if (editing) {
        await updateEvent(editing.id, form)
        await logActivity(userName, 'Updated', `Event: ${form.title}`)
      } else {
        const newEv: Omit<AdminEvent, 'id'> = {
          createdAt: new Date().toISOString(),
          title: form.title!, date: form.date || '', time: form.time || '',
          location: form.location || '', category: form.category || 'General',
          categoryColor: form.categoryColor || '#3b82f6',
          description: form.description || '', status: (form.status as EventStatus) || 'draft',
          image: form.image || '', speaker: form.speaker || '',
        }
        await createEvent(newEv)
        await logActivity(userName, 'Created', `Event: ${newEv.title}`)
      }
    } catch (err) {
      console.warn('Firestore event save error, updating local state:', err)
      if (editing) {
        setEvents(prev => prev.map(e => e.id === editing.id ? { ...e, ...form } as AdminEvent : e))
      } else {
        const fallbackEv: AdminEvent = {
          id: `e${Date.now()}`, createdAt: new Date().toISOString(),
          title: form.title!, date: form.date || '', time: form.time || '',
          location: form.location || '', category: form.category || 'General',
          categoryColor: form.categoryColor || '#3b82f6',
          description: form.description || '', status: (form.status as EventStatus) || 'draft',
        }
        setEvents(prev => [fallbackEv, ...prev])
      }
    }
    setShowModal(false)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteEvent(deleteTarget.id)
      await logActivity(userName, 'Deleted', `Event: ${deleteTarget.title}`)
    } catch (err) {
      console.warn('Firestore event delete error:', err)
      setEvents(prev => prev.filter(e => e.id !== deleteTarget.id))
    }
    setDeleteTarget(null)
  }

  async function toggleStatus(ev: AdminEvent) {
    const nextStatus = ev.status === 'published' ? 'draft' : 'published'
    try {
      await updateEvent(ev.id, { status: nextStatus })
      await logActivity(userName, nextStatus === 'published' ? 'Published' : 'Unpublished', `Event: ${ev.title}`)
    } catch (err) {
      console.warn('Firestore toggleStatus error:', err)
      setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, status: nextStatus } : e))
    }
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Events</PageTitle>
          <PageSubtitle>Manage church events, schedules, and registrations</PageSubtitle>
        </PageTitleBlock>
        <PageActions><Btn onClick={openCreate}>+ Add Event</Btn></PageActions>
      </PageHeader>

      <Card>
        <Toolbar style={{padding:'16px 20px 0'}}>
          <ToolbarLeft>
            <SearchWrap>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
              <SearchInput placeholder="Search events…" value={search} onChange={e=>setSearch(e.target.value)} />
            </SearchWrap>
            <Select style={{width:140}} value={filterStatus} onChange={e=>setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </ToolbarLeft>
          <ToolbarRight>
            <span style={{fontFamily:t.fonts.sans,fontSize:13,color:t.colors.textMuted}}>{filtered.length} event{filtered.length!==1?'s':''}</span>
          </ToolbarRight>
        </Toolbar>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            title="No events found"
            description="Your upcoming church events will appear here."
            action={<Btn onClick={openCreate}>Create Event</Btn>}
          />
        ) : (
          <TableWrap style={{borderRadius:0,border:'none',borderTop:`1px solid ${t.colors.border}`,marginTop:16}}>
            <Table>
              <Thead>
                <tr>
                  <Th>Event</Th><Th>Date</Th><Th>Time</Th>
                  <Th>Location</Th><Th>Category</Th><Th>Status</Th><Th>Actions</Th>
                </tr>
              </Thead>
              <Tbody>
                {filtered.map(ev => (
                  <Tr key={ev.id}>
                    <Td><TitleCell>
                      {ev.image && <img src={ev.image} alt="" style={{width:36,height:28,objectFit:'cover',borderRadius:4,marginRight:10,flexShrink:0}}/>}
                      <CategoryDot $color={ev.categoryColor || '#3b82f6'}/>{ev.title}
                    </TitleCell></Td>
                    <Td>{new Date(ev.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</Td>
                    <Td>{ev.time}</Td>
                    <Td>{ev.location}</Td>
                    <Td>{ev.category}</Td>
                    <Td><Badge $variant={statusVariant(ev.status)}>{ev.status}</Badge></Td>
                    <Td>
                      <ActionGroup>
                        <Btn $variant="ghost" $size="sm" onClick={()=>openEdit(ev)}>Edit</Btn>
                        <Btn $variant={ev.status==='published'?'secondary':'success'} $size="sm" onClick={()=>toggleStatus(ev)}>
                          {ev.status==='published'?'Unpublish':'Publish'}
                        </Btn>
                        <Btn $variant="danger" $size="sm" onClick={()=>setDeleteTarget(ev)}>Delete</Btn>
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
              <ModalTitle>{editing ? 'Edit Event' : 'Add New Event'}</ModalTitle>
              <CloseBtn onClick={()=>setShowModal(false)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <FormGroup><Label>Event Title *</Label>
                <Input placeholder="e.g. Youth Sabbath Program" value={form.title||''} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Date *</Label><Input type="date" value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></FormGroup>
                <FormGroup><Label>Time *</Label><Input type="time" value={form.time||''} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/></FormGroup>
              </FormGrid>
              <FormGroup><Label>Location</Label>
                <Input placeholder="e.g. Main Sanctuary" value={form.location||''} onChange={e=>setForm(f=>({...f,location:e.target.value}))}/>
              </FormGroup>
              <FormGrid>
                <FormGroup><Label>Category</Label>
                  <Select value={form.category||''} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </Select>
                </FormGroup>
                <FormGroup><Label>Status</Label>
                  <Select value={form.status||'draft'} onChange={e=>setForm(f=>({...f,status:e.target.value as EventStatus}))}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </FormGroup>
              </FormGrid>
              <FormGroup><Label>Speaker (optional)</Label>
                <Input placeholder="e.g. Pastor Ngwenya" value={form.speaker||''} onChange={e=>setForm(f=>({...f,speaker:e.target.value}))}/>
              </FormGroup>
              <FormGroup><Label>Description</Label>
                <Textarea placeholder="Event description…" value={form.description||''} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
              </FormGroup>
              <ImageUploader
                label="Event Image (Flyer / Photo)"
                value={form.image||''}
                onChange={url=>setForm(f=>({...f,image:url}))}
                aspectRatio="16 / 7"
                folder="events"
              />
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" onClick={()=>setShowModal(false)}>Cancel</Btn>
              <Btn onClick={handleSave}>{editing ? 'Save Changes' : 'Create Event'}</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* Confirm delete */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Event"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={()=>setDeleteTarget(null)}
        />
      )}
    </PageShell>
  )
}

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle,
  Card, Badge, statusVariant, Btn, Avatar,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, Label, Textarea, Select, EmptyState,
  Toolbar, ToolbarLeft, ToolbarRight, SearchWrap, SearchInput,
} from '../components/ui'
import { mockMessages } from '../mockData'
import type { ContactMessage, MessageStatus } from '../adminTypes'
import { subscribeContactMessages, updateMessageStatus, toggleMessageImportant, deleteContactMessage } from '../../services/contactService'
import { logActivity } from '../../services/activityService'
import { useAuth } from '../../context/AuthContext'

const MsgList = styled.div`display:flex; flex-direction:column;`
const MsgRow = styled.div<{$unread:boolean}>`
  display:flex; align-items:flex-start; gap:14px; padding:16px 20px;
  border-bottom:1px solid ${t.colors.border}; cursor:pointer;
  background:${({$unread})=>$unread?`${t.colors.primaryLight}`:t.colors.surface};
  transition:background 0.12s;
  &:last-child{border-bottom:none;}
  &:hover{background:${t.colors.surfaceAlt};}
`
const MsgContent = styled.div`flex:1; min-width:0;`
const MsgTop = styled.div`display:flex; align-items:baseline; justify-content:space-between; gap:8px; margin-bottom:3px;`
const MsgSender  = styled.span`font-family:${t.fonts.sans}; font-size:14px; font-weight:600; color:${t.colors.text};`
const MsgTime    = styled.span`font-family:${t.fonts.sans}; font-size:12px; color:${t.colors.textMuted}; white-space:nowrap;`
const MsgSubject = styled.p`font-family:${t.fonts.sans}; font-size:13px; font-weight:500; color:${t.colors.text}; margin:0 0 2px;`
const MsgPreview = styled.p`font-family:${t.fonts.sans}; font-size:13px; color:${t.colors.textMuted}; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`
const StarBtn = styled.button<{$active:boolean}>`
  background:none; border:none; cursor:pointer; font-size:16px;
  color:${({$active})=>$active?t.colors.gold:t.colors.border};
  transition:color 0.15s; padding:0; flex-shrink:0;
  &:hover{color:${t.colors.gold};}
`
const ImportantDot = styled.span`width:8px; height:8px; border-radius:50%; background:${t.colors.primary}; flex-shrink:0; margin-top:6px;`

export default function MessagesPage() {
  const [messages, setMessages]   = useState<ContactMessage[]>(mockMessages)
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilter] = useState<string>('all')
  const [viewing, setViewing]     = useState<ContactMessage | null>(null)
  const [reply, setReply]         = useState('')
  const { adminProfile, user }    = useAuth()

  const userName = adminProfile?.name || user?.displayName || 'Admin'

  useEffect(() => {
    const unsub = subscribeContactMessages((items) => {
      if (items.length > 0) setMessages(items)
    })
    return () => unsub?.()
  }, [])

  const filtered = messages.filter(m => {
    const matchSearch = m.sender.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || m.status === filterStatus
    return matchSearch && matchStatus
  })

  async function openMessage(m: ContactMessage) {
    setViewing(m)
    setReply('')
    if (m.status === 'new') {
      try {
        await updateMessageStatus(m.id, 'read')
      } catch (err) {
        setMessages(prev=>prev.map(x=>x.id===m.id?{...x,status:'read' as MessageStatus}:x))
      }
    }
  }

  async function markStatus(id: string, status: MessageStatus) {
    try {
      await updateMessageStatus(id, status)
      await logActivity(userName, 'Updated Status', `Message #${id} -> ${status}`)
    } catch (err) {
      setMessages(prev=>prev.map(m=>m.id===id?{...m,status}:m))
    }
  }

  async function toggleStar(id: string, current: boolean, e: React.MouseEvent) {
    e.stopPropagation()
    try {
      await toggleMessageImportant(id, !current)
    } catch (err) {
      setMessages(prev=>prev.map(m=>m.id===id?{...m,isImportant:!current}:m))
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteContactMessage(id)
      await logActivity(userName, 'Deleted', `Message #${id}`)
    } catch (err) {
      setMessages(prev=>prev.filter(m=>m.id!==id))
    }
    setViewing(null)
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Contact Messages</PageTitle>
          <PageSubtitle>Inquiries and messages submitted through the website contact form</PageSubtitle>
        </PageTitleBlock>
      </PageHeader>

      <Card>
        <Toolbar style={{padding:'16px 20px'}}>
          <ToolbarLeft>
            <SearchWrap>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
              <SearchInput placeholder="Search messages…" value={search} onChange={e=>setSearch(e.target.value)} />
            </SearchWrap>
            <Select style={{width:140}} value={filterStatus} onChange={e=>setFilter(e.target.value)}>
              <option value="all">All Messages</option>
              <option value="new">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </Select>
          </ToolbarLeft>
          <ToolbarRight>
            <span style={{fontFamily:t.fonts.sans,fontSize:13,color:t.colors.textMuted}}>{filtered.length} message{filtered.length!==1?'s':''}</span>
          </ToolbarRight>
        </Toolbar>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
            title="No messages found"
            description="Incoming messages from the contact page will appear here."
          />
        ) : (
          <MsgList>
            {filtered.map(m => (
              <MsgRow key={m.id} $unread={m.status === 'new'} onClick={()=>openMessage(m)}>
                {m.status === 'new' ? <ImportantDot /> : <div style={{width:8}} />}
                <StarBtn $active={m.isImportant} onClick={e=>toggleStar(m.id,m.isImportant,e)}>
                  {m.isImportant ? '★' : '☆'}
                </StarBtn>
                <Avatar style={{width:36,height:36,fontSize:14,flexShrink:0}}>{m.sender.charAt(0)}</Avatar>
                <MsgContent>
                  <MsgTop>
                    <MsgSender>{m.sender} &bull; <span style={{fontSize:12,color:t.colors.textMuted,fontWeight:400}}>{m.email}</span></MsgSender>
                    <MsgTime>{new Date(m.receivedAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</MsgTime>
                  </MsgTop>
                  <MsgSubject>{m.subject}</MsgSubject>
                  <MsgPreview>{m.message}</MsgPreview>
                </MsgContent>
                <Badge $variant={statusVariant(m.status)}>{m.status}</Badge>
              </MsgRow>
            ))}
          </MsgList>
        )}
      </Card>

      {/* Message Modal */}
      {viewing && (
        <ModalOverlay onClick={()=>setViewing(null)}>
          <ModalBox onClick={e=>e.stopPropagation()} style={{maxWidth:600}}>
            <ModalHead>
              <div>
                <ModalTitle>{viewing.subject}</ModalTitle>
                <p style={{fontFamily:t.fonts.sans,fontSize:12,color:t.colors.textMuted,margin:'3px 0 0'}}>
                  From: {viewing.sender} ({viewing.email}) &bull; {new Date(viewing.receivedAt).toLocaleString('en-US')}
                </p>
              </div>
              <CloseBtn onClick={()=>setViewing(null)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <div style={{fontFamily:t.fonts.sans,fontSize:14,color:t.colors.text,lineHeight:1.7,background:t.colors.surfaceAlt,padding:18,borderRadius:8,marginBottom:20}}>
                {viewing.message}
              </div>

              <FormGroup><Label>Reply via Email</Label>
                <Textarea placeholder="Type your response to send to their email…" value={reply} onChange={e=>setReply(e.target.value)} rows={4}/>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <div style={{display:'flex',gap:8}}>
                <Btn $variant="danger" $size="sm" onClick={()=>handleDelete(viewing.id)}>Delete</Btn>
                <Btn $variant="ghost" $size="sm" onClick={()=>{ markStatus(viewing.id,'archived'); setViewing(null) }}>Archive</Btn>
              </div>
              <div style={{display:'flex',gap:8}}>
                <Btn $variant="ghost" onClick={()=>setViewing(null)}>Close</Btn>
                <Btn onClick={()=>{
                  if (reply.trim()) {
                    window.open(`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject)}&body=${encodeURIComponent(reply)}`)
                    markStatus(viewing.id,'replied')
                    setViewing(null)
                  }
                }}>Send Reply</Btn>
              </div>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageShell>
  )
}

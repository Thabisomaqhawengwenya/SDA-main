import { useState } from 'react'
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

  const filtered = messages.filter(m => {
    const matchSearch = m.sender.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || m.status === filterStatus
    return matchSearch && matchStatus
  })

  function openMessage(m: ContactMessage) {
    setViewing(m)
    setReply('')
    if (m.status === 'new') {
      setMessages(prev=>prev.map(x=>x.id===m.id?{...x,status:'read' as MessageStatus}:x))
    }
  }

  function markStatus(id: string, status: MessageStatus) {
    setMessages(prev=>prev.map(m=>m.id===id?{...m,status}:m))
    if (viewing?.id === id) setViewing(v=>v?{...v,status}:null)
  }

  function toggleImportant(id: string) {
    setMessages(prev=>prev.map(m=>m.id===id?{...m,isImportant:!m.isImportant}:m))
    if (viewing?.id === id) setViewing(v=>v?{...v,isImportant:!v.isImportant}:null)
  }

  function handleReply() {
    if (!reply.trim() || !viewing) return
    markStatus(viewing.id, 'replied')
    setViewing(null)
  }

  const newCount = messages.filter(m=>m.status==='new').length

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Messages {newCount > 0 && <span style={{fontFamily:t.fonts.sans,fontSize:14,fontWeight:400,color:t.colors.danger,marginLeft:8}}>{newCount} new</span>}</PageTitle>
          <PageSubtitle>Contact form submissions from the church website</PageSubtitle>
        </PageTitleBlock>
      </PageHeader>

      <Card>
        <Toolbar style={{padding:'16px 20px 0'}}>
          <ToolbarLeft>
            <SearchWrap>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
              <SearchInput placeholder="Search messages…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </SearchWrap>
            <Select style={{width:140}} value={filterStatus} onChange={e=>setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="new">New</option>
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
            title="No messages" description="Contact form submissions will appear here."
          />
        ) : (
          <MsgList style={{marginTop:16}}>
            {filtered.map(m => (
              <MsgRow key={m.id} $unread={m.status==='new'} onClick={()=>openMessage(m)}>
                {m.status==='new' ? <ImportantDot/> : <div style={{width:8}}/>}
                <Avatar $size={36}>{m.sender.charAt(0)}</Avatar>
                <MsgContent>
                  <MsgTop>
                    <MsgSender>{m.sender}</MsgSender>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <MsgTime>{new Date(m.receivedAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</MsgTime>
                      <Badge $variant={statusVariant(m.status)}>{m.status}</Badge>
                    </div>
                  </MsgTop>
                  <MsgSubject>{m.subject}</MsgSubject>
                  <MsgPreview>{m.message}</MsgPreview>
                </MsgContent>
                <StarBtn $active={m.isImportant} onClick={e=>{e.stopPropagation();toggleImportant(m.id)}}>★</StarBtn>
              </MsgRow>
            ))}
          </MsgList>
        )}
      </Card>

      {/* View message modal */}
      {viewing && (
        <ModalOverlay onClick={()=>setViewing(null)}>
          <ModalBox $width="600px" onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{viewing.subject}</ModalTitle>
              <CloseBtn onClick={()=>setViewing(null)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${t.colors.border}`}}>
                <Avatar $size={40}>{viewing.sender.charAt(0)}</Avatar>
                <div>
                  <p style={{fontFamily:t.fonts.sans,fontSize:14,fontWeight:600,color:t.colors.text,margin:'0 0 2px'}}>{viewing.sender}</p>
                  <p style={{fontFamily:t.fonts.sans,fontSize:12,color:t.colors.textMuted,margin:0}}>{viewing.email} · {new Date(viewing.receivedAt).toLocaleString('en-US',{dateStyle:'medium',timeStyle:'short'})}</p>
                </div>
                <div style={{marginLeft:'auto',display:'flex',gap:6}}>
                  <Badge $variant={statusVariant(viewing.status)}>{viewing.status}</Badge>
                  {viewing.isImportant && <Badge $variant="warning">★ Important</Badge>}
                </div>
              </div>
              <p style={{fontFamily:t.fonts.sans,fontSize:14,color:t.colors.textSecondary,lineHeight:1.75,margin:'0 0 20px',padding:'14px',background:t.colors.surfaceAlt,borderRadius:t.radius.md}}>
                {viewing.message}
              </p>
              <FormGroup><Label>Reply</Label>
                <Textarea placeholder="Type your reply…" value={reply} onChange={e=>setReply(e.target.value)} style={{minHeight:100}}/>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="ghost" $size="sm" onClick={()=>markStatus(viewing.id,'archived')}>Archive</Btn>
              <Btn $variant="ghost" $size="sm" onClick={()=>toggleImportant(viewing.id)}>{viewing.isImportant?'Remove Star':'Star'}</Btn>
              <div style={{flex:1}}/>
              <Btn $variant="ghost" onClick={()=>setViewing(null)}>Close</Btn>
              <Btn onClick={handleReply} disabled={!reply.trim()}>Send Reply</Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageShell>
  )
}

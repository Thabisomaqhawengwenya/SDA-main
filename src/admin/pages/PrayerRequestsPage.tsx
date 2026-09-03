import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle,
  Card, Badge, statusVariant, Btn,
  ModalOverlay, ModalBox, ModalHead, ModalTitle, ModalBody, ModalFooter, CloseBtn,
  FormGroup, Label, Select,
  TableWrap, Table, Thead, Th, Tbody, Tr, Td, EmptyState,
  Toolbar, ToolbarLeft, ToolbarRight, SearchWrap, SearchInput,
} from '../components/ui'
import { mockPrayerRequests } from '../mockData'
import type { PrayerRequest, PrayerStatus } from '../adminTypes'
import { subscribePrayerRequests, updatePrayerStatus, deletePrayerRequest } from '../../services/prayerService'
import { logActivity } from '../../services/activityService'
import { useAuth } from '../../context/AuthContext'

const PrivacyTag = styled.span<{$private:boolean}>`
  font-family:${t.fonts.sans}; font-size:11px; font-weight:600;
  color:${({$private})=>$private?t.colors.danger:t.colors.success};
`
const ActionGroup = styled.div`display:flex; gap:6px;`

const PrivacyBanner = styled.div`
  background:${t.colors.warningLight}; border:1px solid ${t.colors.warning}30;
  border-radius:${t.radius.md}; padding:12px 16px; margin-bottom:20px;
  display:flex; align-items:center; gap:10px;
  font-family:${t.fonts.sans}; font-size:13px; color:${t.colors.warning};
  svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;flex-shrink:0;}
`

const NEXT_STATUS: Record<PrayerStatus, PrayerStatus> = {
  new: 'praying', praying: 'answered', answered: 'archived', archived: 'new',
}
const STATUS_LABEL: Record<PrayerStatus, string> = {
  new: 'Start Praying', praying: 'Mark Answered', answered: 'Archive', archived: 'Reopen',
}

export default function PrayerRequestsPage() {
  const [requests, setRequests]   = useState<PrayerRequest[]>(mockPrayerRequests)
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilter] = useState<string>('all')
  const [viewing, setViewing]     = useState<PrayerRequest | null>(null)
  const { adminProfile, user }    = useAuth()

  const userName = adminProfile?.name || user?.displayName || 'Admin'

  useEffect(() => {
    const unsub = subscribePrayerRequests((items) => {
      if (items.length > 0) setRequests(items)
    })
    return () => unsub?.()
  }, [])

  const filtered = requests.filter(r => {
    const matchSearch = r.request.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    return matchSearch && matchStatus
  })

  async function cycleStatus(r: PrayerRequest) {
    const next = NEXT_STATUS[r.status]
    try {
      await updatePrayerStatus(r.id, next)
      await logActivity(userName, 'Updated Status', `Prayer Request by ${r.name} -> ${next}`)
    } catch (err) {
      console.warn('Firestore prayer status error:', err)
      setRequests(prev=>prev.map(x=>x.id===r.id?{...x,status:next}:x))
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePrayerRequest(id)
      await logActivity(userName, 'Deleted', `Prayer Request #${id}`)
    } catch (err) {
      setRequests(prev => prev.filter(r => r.id !== id))
    }
    setViewing(null)
  }

  const counts = {
    new:      requests.filter(r=>r.status==='new').length,
    praying:  requests.filter(r=>r.status==='praying').length,
    answered: requests.filter(r=>r.status==='answered').length,
  }

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Prayer Requests</PageTitle>
          <PageSubtitle>Manage requests submitted online and assign them to the prayer ministry team</PageSubtitle>
        </PageTitleBlock>
      </PageHeader>

      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <Btn $variant={filterStatus==='all'?'primary':'secondary'} $size="sm" onClick={()=>setFilter('all')}>All ({requests.length})</Btn>
        <Btn $variant={filterStatus==='new'?'primary':'secondary'} $size="sm" onClick={()=>setFilter('new')}>New ({counts.new})</Btn>
        <Btn $variant={filterStatus==='praying'?'primary':'secondary'} $size="sm" onClick={()=>setFilter('praying')}>Praying ({counts.praying})</Btn>
        <Btn $variant={filterStatus==='answered'?'primary':'secondary'} $size="sm" onClick={()=>setFilter('answered')}>Answered ({counts.answered})</Btn>
      </div>

      <PrivacyBanner>
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Private requests are confidential and visible only to authorized pastoral and prayer leaders.
      </PrivacyBanner>

      <Card>
        <Toolbar style={{padding:'16px 20px 0'}}>
          <ToolbarLeft>
            <SearchWrap>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
              <SearchInput placeholder="Search prayer requests…" value={search} onChange={e=>setSearch(e.target.value)} />
            </SearchWrap>
            <Select style={{width:140}} value={filterStatus} onChange={e=>setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="praying">Praying</option>
              <option value="answered">Answered</option>
              <option value="archived">Archived</option>
            </Select>
          </ToolbarLeft>
          <ToolbarRight>
            <span style={{fontFamily:t.fonts.sans,fontSize:13,color:t.colors.textMuted}}>{filtered.length} request{filtered.length!==1?'s':''}</span>
          </ToolbarRight>
        </Toolbar>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
            title="No prayer requests found"
            description="Submitted prayer requests will appear here."
          />
        ) : (
          <TableWrap style={{borderRadius:0,border:'none',borderTop:`1px solid ${t.colors.border}`,marginTop:16}}>
            <Table>
              <Thead>
                <tr>
                  <Th>Submitted By</Th><Th>Category</Th><Th>Request</Th>
                  <Th>Confidential</Th><Th>Date</Th><Th>Status</Th><Th>Actions</Th>
                </tr>
              </Thead>
              <Tbody>
                {filtered.map(r => (
                  <Tr key={r.id}>
                    <Td style={{fontWeight:500}}>{r.name}</Td>
                    <Td><Badge $variant="default">{r.category}</Badge></Td>
                    <Td style={{maxWidth:260,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.request}</Td>
                    <Td><PrivacyTag $private={r.isPrivate}>{r.isPrivate ? '🔒 Confidential' : 'Public'}</PrivacyTag></Td>
                    <Td>{new Date(r.submittedAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</Td>
                    <Td><Badge $variant={statusVariant(r.status)}>{r.status}</Badge></Td>
                    <Td>
                      <ActionGroup>
                        <Btn $variant="ghost" $size="sm" onClick={()=>setViewing(r)}>View</Btn>
                        <Btn $variant="secondary" $size="sm" onClick={()=>cycleStatus(r)}>{STATUS_LABEL[r.status]}</Btn>
                      </ActionGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrap>
        )}
      </Card>

      {/* View detail modal */}
      {viewing && (
        <ModalOverlay onClick={()=>setViewing(null)}>
          <ModalBox onClick={e=>e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>Prayer Request from {viewing.name}</ModalTitle>
              <CloseBtn onClick={()=>setViewing(null)}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
            </ModalHead>
            <ModalBody>
              <div style={{display:'flex',gap:10,marginBottom:16}}>
                <Badge $variant="default">{viewing.category}</Badge>
                <Badge $variant={statusVariant(viewing.status)}>{viewing.status}</Badge>
                <PrivacyTag $private={viewing.isPrivate}>{viewing.isPrivate ? '🔒 Confidential' : 'Public'}</PrivacyTag>
              </div>
              <FormGroup><Label>Prayer Request</Label>
                <div style={{fontFamily:t.fonts.sans,fontSize:14,color:t.colors.text,lineHeight:1.7,background:t.colors.surfaceAlt,padding:16,borderRadius:8}}>
                  {viewing.request}
                </div>
              </FormGroup>
              <p style={{fontFamily:t.fonts.sans,fontSize:12,color:t.colors.textMuted,margin:'12px 0 0'}}>
                Submitted: {new Date(viewing.submittedAt).toLocaleString('en-US')}
              </p>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="danger" $size="sm" onClick={()=>handleDelete(viewing.id)}>Delete</Btn>
              <Btn $variant="secondary" onClick={()=>{ cycleStatus(viewing); setViewing(null) }}>
                {STATUS_LABEL[viewing.status]}
              </Btn>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageShell>
  )
}

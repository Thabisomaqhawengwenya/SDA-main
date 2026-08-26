import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle,
  Card, Avatar, Toolbar, ToolbarLeft, ToolbarRight, SearchWrap, SearchInput, Select,
} from '../components/ui'
import { mockActivityLog } from '../mockData'
import { useState } from 'react'

const LogList = styled.div`display:flex; flex-direction:column;`
const LogItem = styled.div`
  display:flex; align-items:flex-start; gap:14px; padding:14px 20px;
  border-bottom:1px solid ${t.colors.border}; transition:background 0.1s;
  &:last-child{border-bottom:none;}
  &:hover{background:${t.colors.surfaceAlt};}
`
const LogContent = styled.div`flex:1;`
const LogText = styled.p`
  font-family:${t.fonts.sans}; font-size:13.5px; color:${t.colors.text}; margin:0 0 3px;
  span{font-weight:600;}
`
const LogTime = styled.p`font-family:${t.fonts.sans}; font-size:12px; color:${t.colors.textMuted}; margin:0;`
const LogAction = styled.span<{$action:string}>`
  font-family:${t.fonts.sans}; font-size:11px; font-weight:700; text-transform:uppercase;
  letter-spacing:0.06em; padding:2px 8px; border-radius:${t.radius.full};
  ${({$action}) => {
    switch($action.toLowerCase()) {
      case 'published': return `background:${t.colors.successLight};color:${t.colors.success};`
      case 'uploaded':  return `background:${t.colors.purpleLight};color:${t.colors.purple};`
      case 'created':   return `background:${t.colors.primaryLight};color:${t.colors.primary};`
      case 'updated':   return `background:${t.colors.infoLight};color:${t.colors.info};`
      case 'archived':  return `background:${t.colors.surfaceAlt};color:${t.colors.textMuted};`
      case 'replied':   return `background:${t.colors.accentLight};color:${t.colors.accent};`
      case 'scheduled': return `background:${t.colors.warningLight};color:${t.colors.warning};`
      case 'drafted':   return `background:${t.colors.surfaceAlt};color:${t.colors.textMuted};`
      default: return `background:${t.colors.surfaceAlt};color:${t.colors.textMuted};`
    }
  }}
`

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffH < 1)   return `Just now`
  if (diffH < 24)  return `${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} today`
  if (diffD === 1) return `Yesterday at ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function ActivityLogPage() {
  const [search, setSearch]     = useState('')
  const [filterUser, setFilter] = useState('all')

  const users = ['all', ...Array.from(new Set(mockActivityLog.map(l => l.user)))]

  const filtered = mockActivityLog.filter(l => {
    const matchSearch = l.resource.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase())
    const matchUser = filterUser === 'all' || l.user === filterUser
    return matchSearch && matchUser
  })

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Activity Log</PageTitle>
          <PageSubtitle>A record of all administrative actions</PageSubtitle>
        </PageTitleBlock>
      </PageHeader>

      <Card>
        <Toolbar style={{ padding: '16px 20px 0' }}>
          <ToolbarLeft>
            <SearchWrap>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
              <SearchInput placeholder="Search activity…" value={search} onChange={e => setSearch(e.target.value)} />
            </SearchWrap>
            <Select style={{ width: 160 }} value={filterUser} onChange={e => setFilter(e.target.value)}>
              {users.map(u => <option key={u} value={u}>{u === 'all' ? 'All Users' : u}</option>)}
            </Select>
          </ToolbarLeft>
          <ToolbarRight>
            <span style={{ fontFamily: t.fonts.sans, fontSize: 13, color: t.colors.textMuted }}>{filtered.length} entries</span>
          </ToolbarRight>
        </Toolbar>

        <LogList style={{ marginTop: 16 }}>
          {filtered.map(log => (
            <LogItem key={log.id}>
              <Avatar $size={34}>{log.user.charAt(0)}</Avatar>
              <LogContent>
                <LogText>
                  <span>{log.user}</span> <LogAction $action={log.action}>{log.action}</LogAction>{' '}
                  {log.resource}
                </LogText>
                <LogTime>{formatTimestamp(log.timestamp)}</LogTime>
              </LogContent>
            </LogItem>
          ))}
        </LogList>
      </Card>
    </PageShell>
  )
}

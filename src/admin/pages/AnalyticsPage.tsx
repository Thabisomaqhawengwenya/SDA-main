import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle,
  Card, CardHeader, CardTitle, CardBody, Grid4, Grid2,
} from '../components/ui'
import { subscribeSermons } from '../../services/sermonsService'
import { subscribePrayerRequests } from '../../services/prayerService'
import { subscribeContactMessages } from '../../services/contactService'
import { subscribeMembers } from '../../services/membersService'
import { subscribeEvents } from '../../services/eventsService'
import type { Sermon, PrayerRequest, ContactMessage, Member, AdminEvent } from '../adminTypes'

const FilterRow = styled.div`
  display:flex; gap:6px; flex-wrap:wrap;
`
const FilterBtn = styled.button<{$active:boolean}>`
  font-family:${t.fonts.sans}; font-size:12px; font-weight:600;
  padding:6px 14px; border-radius:${t.radius.full}; border:1px solid;
  cursor:pointer; transition:0.15s;
  background:${({$active})=>$active?t.colors.primary:'transparent'};
  color:${({$active})=>$active?'#fff':t.colors.textSecondary};
  border-color:${({$active})=>$active?t.colors.primary:t.colors.border};
  &:hover{border-color:${t.colors.primary}; color:${({$active})=>$active?'#fff':t.colors.primary};}
`

// Simple bar chart using divs
const BarChart = styled.div`display:flex; align-items:flex-end; gap:8px; height:160px; padding-top:16px;`
const Bar = styled.div<{$h:number;$color:string}>`
  flex:1; height:${({$h})=>$h}%; background:${({$color})=>$color};
  border-radius:4px 4px 0 0; transition:height 0.4s ease; min-width:20px;
  position:relative;
  &:hover::after{content:attr(data-label); position:absolute; bottom:calc(100%+4px); left:50%;
    transform:translateX(-50%); background:${t.colors.sidebarBg}; color:#fff;
    font-family:${t.fonts.sans}; font-size:11px; padding:3px 7px; border-radius:4px; white-space:nowrap;}
`
const BarLabel = styled.p`font-family:${t.fonts.sans}; font-size:11px; color:${t.colors.textMuted}; text-align:center; margin:6px 0 0;`
const BarGroup = styled.div`flex:1; display:flex; flex-direction:column; align-items:stretch;`

const MetricRow = styled.div`
  display:flex; align-items:center; justify-content:space-between; padding:12px 0;
  border-bottom:1px solid ${t.colors.border}; &:last-child{border-bottom:none;}
`
const MetricLabel = styled.span`font-family:${t.fonts.sans}; font-size:13px; color:${t.colors.textSecondary};`
const MetricValue = styled.span`font-family:${t.fonts.sans}; font-size:14px; font-weight:700; color:${t.colors.text};`
const MetricTrend = styled.span<{$up:boolean}>`font-family:${t.fonts.sans}; font-size:12px; font-weight:500; color:${({$up})=>$up?t.colors.success:t.colors.danger};`

const PageRow = styled.div`
  display:flex; align-items:center; gap:12px; padding:10px 0;
  border-bottom:1px solid ${t.colors.border}; &:last-child{border-bottom:none;}
`
const PageName  = styled.span`font-family:${t.fonts.sans}; font-size:13px; color:${t.colors.text}; flex:1;`
const PageViews = styled.span`font-family:${t.fonts.sans}; font-size:13px; font-weight:600; color:${t.colors.text}; white-space:nowrap;`
const PageBar   = styled.div<{$pct:number}>`
  height:6px; border-radius:3px; background:${t.colors.primaryLight}; flex:2;
  &::after{content:''; display:block; height:100%; width:${({$pct})=>$pct}%;
    background:${t.colors.primary}; border-radius:3px;}
`

const FILTERS = ['7 Days', '30 Days', '90 Days', '1 Year'] as const
type Filter = typeof FILTERS[number]

const DATA: Record<Filter, { visitors: number[]; labels: string[] }> = {
  '7 Days':  { visitors:[120,145,98,167,210,188,234], labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  '30 Days': { visitors:[880,1020,940,1150,1300,1100,980,1400,1250,1350], labels:['W1','','W2','','W3','','W4','','W5',''] },
  '90 Days': { visitors:[3200,3800,4100,3600,4500,4200,3900,4800,4300,4600,5100,4700], labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
  '1 Year':  { visitors:[3200,3800,4100,3600,4500,4200,3900,4800,4300,4600,5100,4700], labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
}

const TOP_PAGES = [
  { name: 'Home',              views: 1840, pct: 100 },
  { name: 'About Us',          views: 620,  pct: 34  },
  { name: 'Events / Calendar', views: 510,  pct: 28  },
  { name: 'Contact Us',        views: 380,  pct: 21  },
  { name: 'Youth Ministry',    views: 290,  pct: 16  },
  { name: 'Giving',            views: 210,  pct: 11  },
]

export default function AnalyticsPage() {
  const [filter, setFilter] = useState<Filter>('30 Days')
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [prayers, setPrayers] = useState<PrayerRequest[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [events, setEvents] = useState<AdminEvent[]>([])

  useEffect(() => {
    const unsubSermons = subscribeSermons(items => setSermons(items))
    const unsubPrayers = subscribePrayerRequests(items => setPrayers(items))
    const unsubMessages = subscribeContactMessages(items => setMessages(items))
    const unsubMembers = subscribeMembers(items => setMembers(items))
    const unsubEvents = subscribeEvents(items => setEvents(items))

    return () => {
      unsubSermons?.()
      unsubPrayers?.()
      unsubMessages?.()
      unsubMembers?.()
      unsubEvents?.()
    }
  }, [])

  const d = DATA[filter]
  const maxV = Math.max(...d.visitors)
  const totalSermonViews = sermons.reduce((acc, s) => acc + (s.views || 0), 0)

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Analytics</PageTitle>
          <PageSubtitle>Website performance, engagement metrics, and community reach</PageSubtitle>
        </PageTitleBlock>
        <FilterRow>
          {FILTERS.map(f => (
            <FilterBtn key={f} $active={filter === f} onClick={() => setFilter(f)}>{f}</FilterBtn>
          ))}
        </FilterRow>
      </PageHeader>

      {/* Top metrics */}
      <Grid4 style={{ marginBottom: 28 }}>
        {[
          { label: 'Active Members',   value: members.length.toString(), color: t.colors.accent, bg: t.colors.accentLight, up: true, trend: 'Registered' },
          { label: 'Total Sermons',    value: sermons.length.toString(), color: t.colors.purple, bg: t.colors.purpleLight, up: true, trend: `${totalSermonViews} plays` },
          { label: 'Published Events', value: events.filter(e => e.status === 'published').length.toString(), color: t.colors.primary, bg: t.colors.primaryLight, up: true, trend: 'Scheduled' },
          { label: 'Prayer Petitions', value: prayers.length.toString(), color: t.colors.success, bg: t.colors.successLight, up: true, trend: `${prayers.filter(p => p.status === 'answered').length} Answered` },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: t.radius.lg, padding: '20px', border: `1px solid ${stat.color}20` }}>
            <p style={{ fontFamily: t.fonts.sans, fontSize: 28, fontWeight: 700, color: stat.color, margin: '0 0 4px', letterSpacing: '-0.03em' }}>{stat.value}</p>
            <p style={{ fontFamily: t.fonts.sans, fontSize: 13, color: stat.color, margin: '0 0 4px', opacity: 0.8 }}>{stat.label}</p>
            <span style={{ fontFamily: t.fonts.sans, fontSize: 12, fontWeight: 600, color: stat.up ? t.colors.success : t.colors.danger }}>{stat.trend}</span>
          </div>
        ))}
      </Grid4>

      <Grid2 style={{ marginBottom: 28 }}>
        {/* Visitors chart */}
        <Card>
          <CardHeader><CardTitle>Website Visitors Trend</CardTitle></CardHeader>
          <CardBody>
            <BarChart>
              {d.visitors.map((v, i) => (
                <BarGroup key={i}>
                  <Bar $h={Math.round((v / maxV) * 100)} $color={t.colors.primary} data-label={v.toString()} />
                  <BarLabel>{d.labels[i]}</BarLabel>
                </BarGroup>
              ))}
            </BarChart>
          </CardBody>
        </Card>

        {/* Top pages */}
        <Card>
          <CardHeader><CardTitle>Most Visited Sections</CardTitle></CardHeader>
          <CardBody style={{ paddingTop: 12 }}>
            {TOP_PAGES.map(p => (
              <PageRow key={p.name}>
                <PageName>{p.name}</PageName>
                <PageBar $pct={p.pct} />
                <PageViews>{p.views.toLocaleString()}</PageViews>
              </PageRow>
            ))}
          </CardBody>
        </Card>
      </Grid2>

      {/* Detailed metrics */}
      <Card>
        <CardHeader><CardTitle>Live Community Engagement</CardTitle></CardHeader>
        <CardBody style={{ paddingTop: 12 }}>
          {[
            { label: 'Contact Messages Received', value: messages.length, trend: `${messages.filter(m => m.status === 'new').length} Unread`, up: true },
            { label: 'Prayer Requests In Intercession', value: prayers.filter(p => p.status === 'praying').length, trend: 'Active Prayer Team', up: true },
            { label: 'Total Sermon Views Across Catalog', value: totalSermonViews, trend: 'Media Ministry', up: true },
            { label: 'Active Ministries & Departments', value: 7, trend: 'All Active', up: true },
          ].map(row => (
            <MetricRow key={row.label}>
              <MetricLabel>{row.label}</MetricLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <MetricTrend $up={row.up}>{row.trend}</MetricTrend>
                <MetricValue>{row.value.toLocaleString()}</MetricValue>
              </div>
            </MetricRow>
          ))}
        </CardBody>
      </Card>
    </PageShell>
  )
}

import { useState } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle,
  Card, CardHeader, CardTitle, CardBody, Grid4, Grid2,
} from '../components/ui'

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
  '90 Days': { visitors:[3200,3800,4100,3600,4500,4200,3900,4800,4300,4600,5100,4700], labels:['Jan','','','','','','','','','','',''] },
  '1 Year':  { visitors:[3200,3800,4100,3600,4500,4200,3900,4800,4300,4600,5100,4700], labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
}

const METRICS: Record<Filter, {visitors:number; pageViews:number; sermonViews:number; events:number; prayers:number; messages:number}> = {
  '7 Days':  { visitors:1162, pageViews:4280, sermonViews:342, events:12,  prayers:5,  messages:8  },
  '30 Days': { visitors:4820, pageViews:17600,sermonViews:1240,events:48,  prayers:18, messages:31 },
  '90 Days': { visitors:13400,pageViews:51200,sermonViews:3800,events:130, prayers:52, messages:89 },
  '1 Year':  { visitors:52000,pageViews:198000,sermonViews:14200,events:480,prayers:210,messages:340},
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
  const d = DATA[filter]
  const m = METRICS[filter]
  const maxV = Math.max(...d.visitors)

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Analytics</PageTitle>
          <PageSubtitle>Website performance and engagement overview</PageSubtitle>
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
          { label: 'Website Visitors', value: m.visitors.toLocaleString(),  color: t.colors.primary, bg: t.colors.primaryLight, up: true,  trend: '+12%' },
          { label: 'Page Views',       value: m.pageViews.toLocaleString(), color: t.colors.info,    bg: t.colors.infoLight,    up: true,  trend: '+8%'  },
          { label: 'Sermon Views',     value: m.sermonViews.toLocaleString(),color:t.colors.purple,  bg: t.colors.purpleLight,  up: true,  trend: '+18%' },
          { label: 'Event Reg.',       value: m.events.toLocaleString(),     color: t.colors.success,bg: t.colors.successLight, up: false, trend: '-3%'  },
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
          <CardHeader><CardTitle>Website Visitors</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Most Visited Pages</CardTitle></CardHeader>
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
        <CardHeader><CardTitle>Engagement Metrics</CardTitle></CardHeader>
        <CardBody style={{ paddingTop: 12 }}>
          {[
            { label: 'Contact Form Submissions', value: m.messages, trend: '+5%',  up: true  },
            { label: 'Prayer Requests Submitted', value: m.prayers, trend: '+12%', up: true  },
            { label: 'Sermon Plays',              value: m.sermonViews, trend: '+18%', up: true },
            { label: 'Livestream Views',           value: Math.round(m.visitors * 0.08), trend: '+22%', up: true },
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

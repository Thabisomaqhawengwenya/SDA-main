import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, StatCard, Card, CardHeader, CardTitle, CardBody,
  Badge, statusVariant, Btn, Grid4, fadeIn, Avatar,
} from '../components/ui'
import {
  dashboardStats, mockEvents, mockMessages,
  mockActivityLog, mockPrayerRequests, mockAnnouncements,
} from '../mockData'

// ── Styled ────────────────────────────────────────────────────────────────────

const WelcomeBar = styled.div`
  background: linear-gradient(120deg, ${t.colors.sidebarBg} 0%, #1a2f4a 100%);
  border-radius: ${t.radius.lg}; padding: 28px 32px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap; margin-bottom: 28px;
  animation: ${fadeIn} 0.3s ease both;
`
const WelcomeLeft = styled.div``
const WelcomeGreeting = styled.h1`
  font-family: ${t.fonts.sans}; font-size: 22px; font-weight: 700;
  color: #fff; margin: 0 0 4px; letter-spacing: -0.02em;
`
const WelcomeSub = styled.p`font-family:${t.fonts.sans}; font-size:14px; color:rgba(255,255,255,0.6); margin:0;`
const WelcomeDate = styled.p`font-family:${t.fonts.sans}; font-size:12px; color:rgba(255,255,255,0.35); margin:4px 0 0;`
const WelcomeActions = styled.div`display:flex; gap:10px; flex-wrap:wrap;`
const WelcomeBtn = styled(Link)<{ $primary?: boolean }>`
  display:inline-flex; align-items:center; gap:6px;
  font-family:${t.fonts.sans}; font-size:13px; font-weight:600; color:#fff;
  background:${({ $primary }) => $primary ? t.colors.primary : 'rgba(255,255,255,0.1)'};
  border:1px solid ${({ $primary }) => $primary ? t.colors.primary : 'rgba(255,255,255,0.18)'};
  border-radius:${t.radius.md}; padding:9px 18px; text-decoration:none; transition:0.15s;
  svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
  &:hover{opacity:0.85;}
`

const StatsGrid = styled(Grid4)`margin-bottom:28px;`

const BodyGrid = styled.div`
  display:grid; grid-template-columns:1fr 340px; gap:20px;
  @media(max-width:1100px){grid-template-columns:1fr;}
`
const LeftCol  = styled.div`display:flex; flex-direction:column; gap:20px;`
const RightCol = styled.div`display:flex; flex-direction:column; gap:20px;`

// Quick actions
const QuickGrid = styled.div`
  display:grid; grid-template-columns:repeat(3,1fr); gap:10px;
  @media(max-width:600px){grid-template-columns:repeat(2,1fr);}
`
const QuickBtn = styled(Link)`
  display:flex; flex-direction:column; align-items:center; gap:8px;
  padding:18px 10px; border-radius:${t.radius.md};
  background:${t.colors.surfaceAlt}; border:1px solid ${t.colors.border};
  text-decoration:none; transition:0.15s; text-align:center;
  &:hover{background:${t.colors.primaryLight}; border-color:${t.colors.primary};}
`
const QuickIconWrap = styled.div<{$color:string;$bg:string}>`
  width:38px; height:38px; border-radius:${t.radius.md};
  background:${({$bg})=>$bg}; display:flex; align-items:center; justify-content:center;
  svg{width:17px;height:17px;color:${({$color})=>$color};stroke:currentColor;fill:none;
      stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
`
const QuickLabel = styled.span`font-family:${t.fonts.sans}; font-size:12px; font-weight:600; color:${t.colors.textSecondary};`

// Notification list
const NotifList = styled.div`display:flex; flex-direction:column;`
const NotifItem = styled(Link)`
  display:flex; align-items:flex-start; gap:12px;
  padding:12px 0; border-bottom:1px solid ${t.colors.border};
  text-decoration:none; transition:opacity 0.15s;
  &:last-child{border-bottom:none;}
  &:hover{opacity:0.7;}
`
const NotifDotEl = styled.div<{$color:string}>`
  width:8px; height:8px; border-radius:50%;
  background:${({$color})=>$color}; margin-top:5px; flex-shrink:0;
`
const NotifText = styled.div`
  p:first-child{font-family:${t.fonts.sans};font-size:13px;font-weight:500;color:${t.colors.text};margin:0 0 2px;}
  p:last-child{font-family:${t.fonts.sans};font-size:12px;color:${t.colors.textMuted};margin:0;}
`

// Activity
const ActivityList = styled.div`display:flex; flex-direction:column;`
const ActivityItem = styled.div`
  display:flex; align-items:flex-start; gap:12px;
  padding:11px 0; border-bottom:1px solid ${t.colors.border};
  &:last-child{border-bottom:none;}
`
const ActivityText = styled.div`flex:1;`
const ActivityAction = styled.p`font-family:${t.fonts.sans};font-size:13px;color:${t.colors.text};margin:0; span{font-weight:600;}`
const ActivityTime   = styled.p`font-family:${t.fonts.sans};font-size:11px;color:${t.colors.textMuted};margin:2px 0 0;`

// Event row
const EventRows = styled.div`display:flex; flex-direction:column;`
const EventRow = styled.div`
  display:flex; align-items:center; gap:14px;
  padding:12px 0; border-bottom:1px solid ${t.colors.border};
  &:last-child{border-bottom:none;}
`
const EventDateBox = styled.div`
  width:42px; height:42px; border-radius:${t.radius.md};
  background:${t.colors.primaryLight};
  display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0;
  p:first-child{font-size:16px;font-weight:700;color:${t.colors.primary};line-height:1;}
  p:last-child{font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${t.colors.primary};}
`
const EventInfo  = styled.div`flex:1; min-width:0;`
const EventName  = styled.p`font-family:${t.fonts.sans};font-size:13.5px;font-weight:500;color:${t.colors.text};margin:0 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`
const EventMetaP = styled.p`font-family:${t.fonts.sans};font-size:12px;color:${t.colors.textMuted};margin:0;`

// Message row
const MsgList = styled.div`display:flex; flex-direction:column;`
const MsgItem = styled(Link)`
  display:flex; align-items:flex-start; gap:12px;
  padding:12px 0; border-bottom:1px solid ${t.colors.border};
  text-decoration:none; transition:background 0.12s;
  &:last-child{border-bottom:none;}
  &:hover{opacity:0.75;}
`
const MsgInfo = styled.div`flex:1; min-width:0;`
const MsgSender  = styled.p`font-family:${t.fonts.sans};font-size:13px;font-weight:600;color:${t.colors.text};margin:0 0 2px;`
const MsgSubject = styled.p`font-family:${t.fonts.sans};font-size:12px;color:${t.colors.textMuted};margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`
const MsgTime    = styled.p`font-family:${t.fonts.sans};font-size:11px;color:${t.colors.textMuted};margin:0;white-space:nowrap;`

const SeeAll = styled(Link)`
  display:block; text-align:center; padding:12px;
  font-family:${t.fonts.sans}; font-size:12px; font-weight:600;
  color:${t.colors.primary}; text-decoration:none; border-top:1px solid ${t.colors.border};
  transition:background 0.15s; border-radius:0 0 ${t.radius.lg} ${t.radius.lg};
  &:hover{background:${t.colors.surfaceAlt};}
`

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatActivity(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffH  = Math.floor(diffMs / 3600000)
  const diffD  = Math.floor(diffMs / 86400000)
  if (diffH < 1)  return 'Just now'
  if (diffH < 24) return `${diffH}h ago`
  if (diffD === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

// ── Component ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })

  const upcomingEvents  = mockEvents.slice(0, 4)
  const recentMessages  = mockMessages.slice(0, 4)
  const recentActivity  = mockActivityLog.slice(0, 6)
  const newPrayer       = mockPrayerRequests.filter(p => p.status === 'new').length
  const newMsg          = mockMessages.filter(m => m.status === 'new').length
  const draftEvents     = mockEvents.filter(e => e.status === 'draft').length
  const publishedAnnouncements = mockAnnouncements.filter(a => a.status === 'published').length

  const notifications = [
    ...(newPrayer > 0   ? [{ text:`${newPrayer} new prayer request${newPrayer>1?'s':''}`,      sub:'Needs attention',             color:t.colors.danger,  to:'/admin/prayer-requests' }] : []),
    ...(newMsg > 0      ? [{ text:`${newMsg} new contact message${newMsg>1?'s':''}`,            sub:'Awaiting response',           color:t.colors.primary, to:'/admin/messages'        }] : []),
    ...(draftEvents > 0 ? [{ text:`${draftEvents} event draft${draftEvents>1?'s':''} pending`, sub:'Review and publish',          color:t.colors.warning, to:'/admin/events'          }] : []),
    {  text:'Sabbath stream scheduled for Saturday', sub:'11:30 AM — YouTube & Facebook', color:t.colors.success, to:'/admin/livestreams' },
    {  text:'New sermon draft awaiting review',      sub:'Stewardship and Giving',         color:t.colors.purple,  to:'/admin/sermons'     },
  ]

  const quickActions = [
    { label:'Add Event',        to:'/admin/events',        color:t.colors.primary, bg:t.colors.primaryLight, icon:<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg> },
    { label:'Announcement',     to:'/admin/announcements', color:t.colors.warning, bg:t.colors.warningLight, icon:<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
    { label:'Upload Sermon',    to:'/admin/sermons',       color:t.colors.purple,  bg:t.colors.purpleLight,  icon:<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg> },
    { label:'Schedule Stream',  to:'/admin/livestreams',   color:t.colors.danger,  bg:t.colors.dangerLight,  icon:<svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
    { label:'Add Ministry',     to:'/admin/ministries',    color:t.colors.accent,  bg:t.colors.accentLight,  icon:<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
    { label:'View Messages',    to:'/admin/messages',      color:t.colors.info,    bg:t.colors.infoLight,    icon:<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
  ]

  return (
    <PageShell>
      {/* Welcome */}
      <WelcomeBar>
        <WelcomeLeft>
          <WelcomeGreeting>{greeting}, Admin 👋</WelcomeGreeting>
          <WelcomeSub>Here's what's happening at Emganwini Main SDA Church.</WelcomeSub>
          <WelcomeDate>{dateStr}</WelcomeDate>
        </WelcomeLeft>
        <WelcomeActions>
          <WelcomeBtn to="/admin/events">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Events
          </WelcomeBtn>
          <WelcomeBtn to="/admin/sermons" $primary>
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Upload Sermon
          </WelcomeBtn>
        </WelcomeActions>
      </WelcomeBar>

      {/* Stats */}
      <StatsGrid>
        <StatCard label="Total Members"     value={dashboardStats.totalMembers}   trend="+4 this month" trendUp color={t.colors.accent}  colorLight={t.colors.accentLight}
          icon={<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
        <StatCard label="Upcoming Events"   value={dashboardStats.upcomingEvents} trend="+3 this month" trendUp color={t.colors.primary} colorLight={t.colors.primaryLight}
          icon={<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} />
        <StatCard label="Prayer Requests"   value={dashboardStats.prayerRequests} trend={`${newPrayer} new`} trendUp={false} color={t.colors.danger}  colorLight={t.colors.dangerLight}
          icon={<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>} />
        <StatCard label="Contact Messages"  value={dashboardStats.contactMessages} trend={`${newMsg} unread`} trendUp={false} color={t.colors.info} colorLight={t.colors.infoLight}
          icon={<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
        <StatCard label="Published Sermons" value={dashboardStats.publishedSermons} trend="+2 this month" trendUp color={t.colors.purple} colorLight={t.colors.purpleLight}
          icon={<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>} />
        <StatCard label="Livestreams"       value={dashboardStats.upcomingLivestreams} trend="2 upcoming" trendUp color={t.colors.danger} colorLight={t.colors.dangerLight}
          icon={<svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>} />
        <StatCard label="Announcements"     value={publishedAnnouncements} trend="1 draft" color={t.colors.warning} colorLight={t.colors.warningLight}
          icon={<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>} />
        <StatCard label="Monthly Giving"    value={`$${dashboardStats.totalDonationsMonth}`} trend="This month" trendUp color={t.colors.success} colorLight={t.colors.successLight}
          icon={<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
      </StatsGrid>

      {/* Body */}
      <BodyGrid>
        <LeftCol>
          {/* Quick Actions */}
          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardBody>
              <QuickGrid>
                {quickActions.map(q => (
                  <QuickBtn key={q.label} to={q.to}>
                    <QuickIconWrap $color={q.color} $bg={q.bg}>{q.icon}</QuickIconWrap>
                    <QuickLabel>{q.label}</QuickLabel>
                  </QuickBtn>
                ))}
              </QuickGrid>
            </CardBody>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <Btn as={Link} to="/admin/events" $variant="ghost" $size="sm">View All →</Btn>
            </CardHeader>
            <CardBody style={{paddingTop:8}}>
              <EventRows>
                {upcomingEvents.map(ev => {
                  const d = new Date(ev.date)
                  return (
                    <EventRow key={ev.id}>
                      <EventDateBox>
                        <p>{d.getDate()}</p>
                        <p>{MONTHS[d.getMonth()]}</p>
                      </EventDateBox>
                      <EventInfo>
                        <EventName>{ev.title}</EventName>
                        <EventMetaP>{ev.time} · {ev.location}</EventMetaP>
                      </EventInfo>
                      <Badge $variant={statusVariant(ev.status)}>{ev.status}</Badge>
                    </EventRow>
                  )
                })}
              </EventRows>
            </CardBody>
            <SeeAll to="/admin/events">See all events</SeeAll>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <Btn as={Link} to="/admin/messages" $variant="ghost" $size="sm">View All →</Btn>
            </CardHeader>
            <CardBody style={{paddingTop:8}}>
              <MsgList>
                {recentMessages.map(msg => (
                  <MsgItem key={msg.id} to="/admin/messages">
                    <Avatar $size={36}>{msg.sender.charAt(0)}</Avatar>
                    <MsgInfo>
                      <MsgSender>{msg.sender}</MsgSender>
                      <MsgSubject>{msg.subject}</MsgSubject>
                    </MsgInfo>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                      <MsgTime>{new Date(msg.receivedAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</MsgTime>
                      <Badge $variant={statusVariant(msg.status)}>{msg.status}</Badge>
                    </div>
                  </MsgItem>
                ))}
              </MsgList>
            </CardBody>
            <SeeAll to="/admin/messages">See all messages</SeeAll>
          </Card>
        </LeftCol>

        <RightCol>
          {/* Notifications */}
          <Card>
            <CardHeader><CardTitle>Needs Attention</CardTitle></CardHeader>
            <CardBody style={{paddingTop:8}}>
              <NotifList>
                {notifications.map((n,i) => (
                  <NotifItem key={i} to={n.to}>
                    <NotifDotEl $color={n.color} />
                    <NotifText>
                      <p>{n.text}</p>
                      <p>{n.sub}</p>
                    </NotifText>
                  </NotifItem>
                ))}
              </NotifList>
            </CardBody>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <Btn as={Link} to="/admin/activity-log" $variant="ghost" $size="sm">All →</Btn>
            </CardHeader>
            <CardBody style={{paddingTop:8}}>
              <ActivityList>
                {recentActivity.map(log => (
                  <ActivityItem key={log.id}>
                    <Avatar $size={30}>{log.user.charAt(0)}</Avatar>
                    <ActivityText>
                      <ActivityAction>
                        <span>{log.user}</span> {log.action.toLowerCase()} {log.resource}
                      </ActivityAction>
                      <ActivityTime>{formatActivity(log.timestamp)}</ActivityTime>
                    </ActivityText>
                  </ActivityItem>
                ))}
              </ActivityList>
            </CardBody>
            <SeeAll to="/admin/activity-log">Full activity log</SeeAll>
          </Card>
        </RightCol>
      </BodyGrid>
    </PageShell>
  )
}

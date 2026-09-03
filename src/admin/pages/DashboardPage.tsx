import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, StatCard, Card, CardHeader, CardTitle, CardBody,
  Badge, statusVariant, Btn, Grid4, fadeIn, Avatar,
} from '../components/ui'
import {
  dashboardStats, mockEvents, mockMessages,
  mockActivityLog, mockPrayerRequests, mockSermons, mockMembers,
} from '../mockData'
import type { AdminEvent, ContactMessage, ActivityLog, PrayerRequest, Sermon, Member } from '../adminTypes'
import { subscribeEvents } from '../../services/eventsService'
import { subscribeContactMessages } from '../../services/contactService'
import { subscribePrayerRequests } from '../../services/prayerService'
import { subscribeSermons } from '../../services/sermonsService'
import { subscribeMembers } from '../../services/membersService'
import { subscribeActivityLogs } from '../../services/activityService'
import { useAuth } from '../../context/AuthContext'

// ── Styled ────────────────────────────────────────────────────────────────────

const WelcomeBar = styled.div`
  background: linear-gradient(120deg, ${t.colors.sidebarBg} 0%, #1a2f4a 100%);
  border-radius: ${t.radius.lg}; padding: 24px 28px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; flex-wrap: wrap; margin-bottom: 20px;
  animation: ${fadeIn} 0.3s ease both;

  @media (max-width: 600px) {
    padding: 20px 18px;
    border-radius: ${t.radius.md};
  }
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

const StatsGrid = styled(Grid4)`margin-bottom:20px;`

const BodyGrid = styled.div`
  display:grid; grid-template-columns:1fr 320px; gap:16px;
  @media(max-width:1100px){ grid-template-columns:1fr; }
`
const LeftCol  = styled.div`display:flex; flex-direction:column; gap:16px;`
const RightCol = styled.div`
  display:flex; flex-direction:column; gap:16px;
  @media(max-width:1100px){ flex-direction:row; flex-wrap:wrap; }
  @media(max-width:600px){ flex-direction:column; }
`

// Quick actions
const QuickGrid = styled.div`
  display:grid; grid-template-columns:repeat(3,1fr); gap:10px;
  @media(max-width:600px){ grid-template-columns:repeat(2,1fr); }
`
const QuickBtn = styled(Link)<{ $color:string; $bg:string }>`
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:8px; padding:16px 12px; border-radius:${t.radius.md};
  background:${({$bg})=>$bg}; text-decoration:none; border:1px solid ${({$color})=>$color}25;
  transition:all 0.15s ease;
  svg{width:22px;height:22px;stroke:${({$color})=>$color};fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
  span{font-family:${t.fonts.sans};font-size:12px;font-weight:600;color:${({$color})=>$color};text-align:center;}
  &:hover{transform:translateY(-2px);box-shadow:${t.shadows.sm};}
`

// Notifications list
const NotifList = styled.div`display:flex; flex-direction:column; gap:8px;`
const NotifItem = styled(Link)<{ $color:string }>`
  display:flex; align-items:center; gap:12px; padding:11px 14px;
  border-radius:${t.radius.md}; background:${t.colors.surfaceAlt};
  text-decoration:none; transition:background 0.12s;
  &:hover{background:${t.colors.border};}
`
const NotifDot  = styled.div<{ $color:string }>`width:8px; height:8px; border-radius:50%; background:${({$color})=>$color}; flex-shrink:0;`
const NotifText = styled.div`flex:1; min-width:0;`
const NotifTitle = styled.p`font-family:${t.fonts.sans};font-size:13px;font-weight:500;color:${t.colors.text};margin:0;`
const NotifSub   = styled.p`font-family:${t.fonts.sans};font-size:11px;color:${t.colors.textMuted};margin:1px 0 0;`

// Activity list
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

export default function DashboardPage() {
  const { user, adminProfile } = useAuth()
  const [events, setEvents] = useState<AdminEvent[]>(mockEvents)
  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages)
  const [prayers, setPrayers] = useState<PrayerRequest[]>(mockPrayerRequests)
  const [sermons, setSermons] = useState<Sermon[]>(mockSermons)
  const [members, setMembers] = useState<Member[]>(mockMembers)
  const [activity, setActivity] = useState<ActivityLog[]>(mockActivityLog)

  useEffect(() => {
    const unsubEvents = subscribeEvents(items => items.length > 0 && setEvents(items))
    const unsubMsgs = subscribeContactMessages(items => items.length > 0 && setMessages(items))
    const unsubPrayers = subscribePrayerRequests(items => items.length > 0 && setPrayers(items))
    const unsubSermons = subscribeSermons(items => items.length > 0 && setSermons(items))
    const unsubMembers = subscribeMembers(items => items.length > 0 && setMembers(items))
    const unsubActivity = subscribeActivityLogs(items => items.length > 0 && setActivity(items))

    return () => {
      unsubEvents?.()
      unsubMsgs?.()
      unsubPrayers?.()
      unsubSermons?.()
      unsubMembers?.()
      unsubActivity?.()
    }
  }, [])

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  const displayName = adminProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'Admin'

  const upcomingEvents  = events.slice(0, 4)
  const recentMessages  = messages.slice(0, 4)
  const recentActivity  = activity.slice(0, 6)
  const newPrayer       = prayers.filter(p => p.status === 'new').length
  const newMsg          = messages.filter(m => m.status === 'new').length
  const draftEvents     = events.filter(e => e.status === 'draft').length

  const notifications = [
    ...(newPrayer > 0   ? [{ text:`${newPrayer} new prayer request${newPrayer>1?'s':''}`,      sub:'Needs attention',             color:t.colors.danger,  to:'/admin/prayer-requests' }] : []),
    ...(newMsg > 0      ? [{ text:`${newMsg} new contact message${newMsg>1?'s':''}`,            sub:'Awaiting response',           color:t.colors.primary, to:'/admin/messages'        }] : []),
    ...(draftEvents > 0 ? [{ text:`${draftEvents} event draft${draftEvents>1?'s':''} pending`, sub:'Review and publish',          color:t.colors.warning, to:'/admin/events'          }] : []),
    {  text:'Sabbath stream scheduled for Saturday', sub:'11:30 AM — YouTube & Facebook', color:t.colors.success, to:'/admin/livestreams' },
    {  text:`${sermons.length} sermons synced with Firestore`, sub:'Online Church Audio & Video', color:t.colors.purple, to:'/admin/sermons' },
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
          <WelcomeGreeting>{greeting}, {displayName} 👋</WelcomeGreeting>
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
        <StatCard label="Total Members"     value={members.length || dashboardStats.totalMembers}   trend="Active directory" trendUp color={t.colors.accent}  colorLight={t.colors.accentLight}
          icon={<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
        <StatCard label="Upcoming Events"   value={events.filter(e=>e.status==='published').length || dashboardStats.upcomingEvents}   trend="Next 30 days" trendUp color={t.colors.primary} colorLight={t.colors.primaryLight}
          icon={<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} />
        <StatCard label="Prayer Requests"   value={prayers.length || dashboardStats.prayerRequests}   trend={`${newPrayer} pending prayer`} color={t.colors.purple}  colorLight={t.colors.purpleLight}
          icon={<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>} />
        <StatCard label="New Messages"      value={newMsg || dashboardStats.newMessages}      trend="Awaiting reply" color={t.colors.warning} colorLight={t.colors.warningLight}
          icon={<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
      </StatsGrid>

      {/* Main Grid */}
      <BodyGrid>
        <LeftCol>
          {/* Quick actions */}
          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardBody style={{paddingTop:0}}>
              <QuickGrid>
                {quickActions.map(a => (
                  <QuickBtn key={a.label} to={a.to} $color={a.color} $bg={a.bg}>
                    {a.icon}
                    <span>{a.label}</span>
                  </QuickBtn>
                ))}
              </QuickGrid>
            </CardBody>
          </Card>

          {/* Upcoming events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <Btn as={Link} to="/admin/events" $variant="ghost" $size="sm">Manage Events →</Btn>
            </CardHeader>
            <CardBody style={{paddingTop:0}}>
              <EventRows>
                {upcomingEvents.map(ev => {
                  const evDate = new Date(ev.date)
                  const day = isNaN(evDate.getDate()) ? '1' : evDate.getDate()
                  const month = isNaN(evDate.getMonth()) ? 'JUL' : MONTHS[evDate.getMonth()]
                  return (
                    <EventRow key={ev.id}>
                      <EventDateBox>
                        <p>{day}</p>
                        <p>{month}</p>
                      </EventDateBox>
                      <EventInfo>
                        <EventName>{ev.title}</EventName>
                        <EventMetaP>🕒 {ev.time} &bull; 📍 {ev.location}</EventMetaP>
                      </EventInfo>
                      <Badge $variant={statusVariant(ev.status)}>{ev.status}</Badge>
                    </EventRow>
                  )
                })}
              </EventRows>
            </CardBody>
            <SeeAll to="/admin/events">View All Events</SeeAll>
          </Card>

          {/* Recent messages */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Contact Messages</CardTitle>
              <Btn as={Link} to="/admin/messages" $variant="ghost" $size="sm">All Messages →</Btn>
            </CardHeader>
            <CardBody style={{paddingTop:0}}>
              <MsgList>
                {recentMessages.map(m => (
                  <MsgItem key={m.id} to="/admin/messages">
                    <Avatar style={{width:32,height:32,fontSize:12,flexShrink:0}}>{m.sender.charAt(0)}</Avatar>
                    <MsgInfo>
                      <MsgSender>{m.sender}</MsgSender>
                      <MsgSubject>{m.subject}</MsgSubject>
                    </MsgInfo>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                      <MsgTime>{new Date(m.receivedAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</MsgTime>
                      <Badge $variant={statusVariant(m.status)} style={{fontSize:10,padding:'1px 6px'}}>{m.status}</Badge>
                    </div>
                  </MsgItem>
                ))}
              </MsgList>
            </CardBody>
            <SeeAll to="/admin/messages">Open Inbox</SeeAll>
          </Card>
        </LeftCol>

        {/* Right column */}
        <RightCol>
          {/* Notifications */}
          <Card style={{flex:1}}>
            <CardHeader><CardTitle>Action Items</CardTitle></CardHeader>
            <CardBody style={{paddingTop:0}}>
              <NotifList>
                {notifications.map((n, i) => (
                  <NotifItem key={i} to={n.to} $color={n.color}>
                    <NotifDot $color={n.color} />
                    <NotifText>
                      <NotifTitle>{n.text}</NotifTitle>
                      <NotifSub>{n.sub}</NotifSub>
                    </NotifText>
                  </NotifItem>
                ))}
              </NotifList>
            </CardBody>
          </Card>

          {/* Activity log */}
          <Card style={{flex:1}}>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardBody style={{paddingTop:0}}>
              <ActivityList>
                {recentActivity.map(a => (
                  <ActivityItem key={a.id}>
                    <Avatar style={{width:28,height:28,fontSize:11,flexShrink:0}}>{a.user.charAt(0)}</Avatar>
                    <ActivityText>
                      <ActivityAction>
                        <span>{a.user}</span> {a.action.toLowerCase()} {a.resource}
                      </ActivityAction>
                      <ActivityTime>{formatActivity(a.timestamp)}</ActivityTime>
                    </ActivityText>
                  </ActivityItem>
                ))}
              </ActivityList>
            </CardBody>
          </Card>
        </RightCol>
      </BodyGrid>
    </PageShell>
  )
}

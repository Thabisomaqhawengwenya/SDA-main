import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import { PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, Card } from '../components/ui'
import { mockMessages, mockPrayerRequests, mockEvents, mockSermons } from '../mockData'

const NotifList = styled.div`display:flex; flex-direction:column;`
const NotifItem = styled.div`
  display:flex; align-items:flex-start; gap:14px; padding:16px 20px;
  border-bottom:1px solid ${t.colors.border}; &:last-child{border-bottom:none;}
`
const NotifIcon = styled.div<{$color:string}>`
  width:38px; height:38px; border-radius:${t.radius.md}; flex-shrink:0;
  background:${({$color})=>$color}18; display:flex; align-items:center; justify-content:center;
  svg{width:17px;height:17px;stroke:${({$color})=>$color};fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
`
const NotifContent = styled.div`flex:1;`
const NotifTitle = styled.p`font-family:${t.fonts.sans}; font-size:14px; font-weight:600; color:${t.colors.text}; margin:0 0 3px;`
const NotifDesc  = styled.p`font-family:${t.fonts.sans}; font-size:13px; color:${t.colors.textSecondary}; margin:0 0 6px; line-height:1.5;`
const NotifMeta  = styled.p`font-family:${t.fonts.sans}; font-size:12px; color:${t.colors.textMuted}; margin:0;`
const NotifAction = styled(Link)`
  font-family:${t.fonts.sans}; font-size:12px; font-weight:600;
  color:${t.colors.primary}; text-decoration:none;
  &:hover{text-decoration:underline;}
`

const newPrayer  = mockPrayerRequests.filter(p => p.status === 'new').length
const newMsg     = mockMessages.filter(m => m.status === 'new').length
const draftEv    = mockEvents.filter(e => e.status === 'draft').length
const draftSerm  = mockSermons.filter(s => s.status === 'draft').length

const notifications = [
  {
    color: t.colors.danger,
    icon: <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    title: `${newPrayer} new prayer request${newPrayer !== 1 ? 's' : ''}`,
    desc: 'New prayer requests have been submitted from the website and are waiting to be assigned.',
    meta: 'Just now',
    to: '/admin/prayer-requests',
    cta: 'View Prayer Requests',
  },
  {
    color: t.colors.primary,
    icon: <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    title: `${newMsg} new contact message${newMsg !== 1 ? 's' : ''}`,
    desc: 'New messages from website visitors are waiting for a response.',
    meta: '2 hours ago',
    to: '/admin/messages',
    cta: 'Open Messages',
  },
  {
    color: t.colors.warning,
    icon: <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    title: `${draftEv} event draft${draftEv !== 1 ? 's' : ''} awaiting approval`,
    desc: 'Drafted events need to be reviewed and published before they appear on the website.',
    meta: 'Yesterday',
    to: '/admin/events',
    cta: 'Review Events',
  },
  {
    color: t.colors.success,
    icon: <svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
    title: 'Sabbath livestream scheduled for this Saturday',
    desc: 'The weekly Sabbath morning worship service is scheduled to stream at 11:30 AM on YouTube and Facebook.',
    meta: '2 days ago',
    to: '/admin/livestreams',
    cta: 'View Livestream',
  },
  {
    color: t.colors.purple,
    icon: <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    title: `${draftSerm} sermon draft${draftSerm !== 1 ? 's' : ''} awaiting review`,
    desc: 'Sermon drafts are ready for review before being published to the website.',
    meta: '3 days ago',
    to: '/admin/sermons',
    cta: 'Review Sermons',
  },
]

export default function NotificationsPage() {
  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Notifications</PageTitle>
          <PageSubtitle>Important alerts and actions requiring your attention</PageSubtitle>
        </PageTitleBlock>
      </PageHeader>

      <Card>
        <NotifList>
          {notifications.map((n, i) => (
            <NotifItem key={i}>
              <NotifIcon $color={n.color}>{n.icon}</NotifIcon>
              <NotifContent>
                <NotifTitle>{n.title}</NotifTitle>
                <NotifDesc>{n.desc}</NotifDesc>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <NotifMeta>{n.meta}</NotifMeta>
                  <NotifAction to={n.to}>{n.cta} →</NotifAction>
                </div>
              </NotifContent>
            </NotifItem>
          ))}
        </NotifList>
      </Card>
    </PageShell>
  )
}

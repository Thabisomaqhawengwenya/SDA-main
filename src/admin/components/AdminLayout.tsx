import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import { mockMessages, mockPrayerRequests } from '../mockData'

// ── Nav data ──────────────────────────────────────────────────────────────────

const NAV = [
  {
    group: 'MAIN',
    items: [
      { label: 'Dashboard', path: '/admin', icon: <GridIcon /> },
    ],
  },
  {
    group: 'CONTENT',
    items: [
      { label: 'Announcements', path: '/admin/announcements', icon: <BellIcon /> },
      { label: 'Events',        path: '/admin/events',        icon: <CalendarIcon /> },
      { label: 'Sermons',       path: '/admin/sermons',       icon: <PlayIcon /> },
      { label: 'Livestreams',   path: '/admin/livestreams',   icon: <VideoIcon /> },
      { label: 'Ministries',    path: '/admin/ministries',    icon: <UsersIcon /> },
    ],
  },
  {
    group: 'CHURCH',
    items: [
      { label: 'Services',       path: '/admin/services',        icon: <ClockIcon /> },
      { label: 'Leadership',     path: '/admin/leadership',      icon: <StarIcon /> },
      { label: 'Members',        path: '/admin/members',         icon: <UserIcon /> },
      { label: 'Prayer Requests',path: '/admin/prayer-requests', icon: <HeartIcon />, badge: mockPrayerRequests.filter(p => p.status === 'new').length },
      { label: 'Giving',         path: '/admin/giving',          icon: <DollarIcon /> },
    ],
  },
  {
    group: 'COMMUNICATION',
    items: [
      { label: 'Messages',      path: '/admin/messages',      icon: <MailIcon />, badge: mockMessages.filter(m => m.status === 'new').length },
      { label: 'Notifications', path: '/admin/notifications', icon: <AlertIcon /> },
    ],
  },
  {
    group: 'ANALYTICS',
    items: [
      { label: 'Analytics', path: '/admin/analytics', icon: <ChartIcon /> },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { label: 'Users & Roles', path: '/admin/users',        icon: <ShieldIcon /> },
      { label: 'Activity Log',  path: '/admin/activity-log', icon: <ListIcon /> },
      { label: 'Settings',      path: '/admin/settings',     icon: <SettingsIcon /> },
    ],
  },
]

// ── Styled ────────────────────────────────────────────────────────────────────

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${t.colors.bg};
  font-family: ${t.fonts.sans};
`

// ── Sidebar ───────────────────────────────────────────────────────────────────

const Sidebar = styled.aside<{ $collapsed: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? t.sidebarCollapsed : t.sidebarWidth)};
  min-height: 100vh;
  background: ${t.colors.sidebarBg};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 200;
  transition: width ${t.transition.slow};
  overflow: hidden;

  @media (max-width: 768px) {
    width: ${({ $collapsed }) => ($collapsed ? '0' : t.sidebarWidth)};
    box-shadow: ${({ $collapsed }) => ($collapsed ? 'none' : '0 0 40px rgba(0,0,0,0.4)')};
  }
`

const SidebarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px;
  border-bottom: 1px solid ${t.colors.sidebarBorder};
  flex-shrink: 0;
  min-height: 60px;
`

const LogoWrap = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  overflow: hidden;
  white-space: nowrap;
`

const LogoDot = styled.div`
  width: 30px; height: 30px; border-radius: 8px;
  background: ${t.colors.primary};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  svg { width:16px; height:16px; fill:#fff; }
`

const LogoText = styled.div`
  overflow: hidden;
  p:first-child {
    font-size: 13px; font-weight: 700; color: #fff;
    line-height: 1.2; white-space: nowrap;
  }
  p:last-child {
    font-size: 10px; font-weight: 500; letter-spacing: 0.08em;
    color: rgba(255,255,255,0.4); text-transform: uppercase; white-space: nowrap;
  }
`

const CollapseBtn = styled.button`
  width: 28px; height: 28px; border-radius: 6px;
  background: rgba(255,255,255,0.06); border: none;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5); transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
  svg { width:14px; height:14px; stroke:currentColor; fill:none;
        stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
  &:hover { background: rgba(255,255,255,0.12); color: #fff; }
`

const NavScroll = styled.nav`
  flex: 1; overflow-y: auto; overflow-x: hidden; padding: 12px 0;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
`

const NavGroup = styled.div`margin-bottom: 4px;`

const NavGroupLabel = styled.p<{ $collapsed: boolean }>`
  font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: rgba(255,255,255,0.28);
  padding: 10px 18px 4px;
  overflow: hidden; white-space: nowrap;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition: opacity 0.2s;
`

const NavItem = styled(Link)<{ $active: boolean; $collapsed: boolean }>`
  display: flex; align-items: center; gap: 11px;
  padding: 9px 16px; margin: 1px 8px; border-radius: 8px;
  text-decoration: none; cursor: pointer; white-space: nowrap;
  transition: background 0.15s, color 0.15s;
  color: ${({ $active }) => ($active ? '#fff' : t.colors.sidebarText)};
  background: ${({ $active }) => ($active ? 'rgba(29,161,242,0.18)' : 'transparent')};
  ${({ $active }) => $active && `border-left: 3px solid ${t.colors.sidebarAccent}; padding-left: 13px;`}

  svg { width:17px; height:17px; stroke:currentColor; fill:none;
        stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; flex-shrink:0; }

  span.label {
    font-size: 13.5px; font-weight: ${({ $active }) => ($active ? '600' : '400')};
    overflow: hidden; transition: opacity 0.2s;
    opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
    flex: 1;
  }

  &:hover:not([data-active='true']) {
    background: ${t.colors.sidebarHover}; color: #fff;
  }
`

const NavBadge = styled.span<{ $collapsed: boolean }>`
  background: ${t.colors.danger}; color: #fff;
  font-size: 10px; font-weight: 700;
  min-width: 18px; height: 18px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px; flex-shrink: 0;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition: opacity 0.2s;
`

const SidebarBottom = styled.div`
  border-top: 1px solid ${t.colors.sidebarBorder};
  padding: 12px;
  flex-shrink: 0;
`

const ProfileBtn = styled.div<{ $collapsed: boolean }>`
  display: flex; align-items: center; gap: 10px;
  padding: 10px; border-radius: 8px; cursor: pointer;
  transition: background 0.15s;
  overflow: hidden;
  &:hover { background: rgba(255,255,255,0.06); }
`

const ProfileAvatar = styled.div`
  width: 32px; height: 32px; border-radius: 50%;
  background: ${t.colors.primary};
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0;
`

const ProfileInfo = styled.div<{ $collapsed: boolean }>`
  overflow: hidden; white-space: nowrap;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  transition: opacity 0.2s;
  p:first-child { font-size: 13px; font-weight: 600; color: #fff; }
  p:last-child { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 1px; }
`

// ── Main area ─────────────────────────────────────────────────────────────────

const Main = styled.div<{ $collapsed: boolean }>`
  flex: 1;
  margin-left: ${({ $collapsed }) => ($collapsed ? t.sidebarCollapsed : t.sidebarWidth)};
  transition: margin-left ${t.transition.slow};
  display: flex; flex-direction: column; min-height: 100vh;

  @media (max-width: 768px) { margin-left: 0; }
`

// ── Topbar ────────────────────────────────────────────────────────────────────

const Topbar = styled.header`
  height: ${t.topbarHeight};
  background: ${t.colors.surface};
  border-bottom: 1px solid ${t.colors.border};
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; gap: 16px;
  position: sticky; top: 0; z-index: 100;
  box-shadow: ${t.shadows.xs};
`

const TopbarLeft = styled.div`display: flex; align-items: center; gap: 12px;`

const MobileMenuBtn = styled.button`
  display: none;
  @media (max-width: 768px) { display: flex; }
  width: 36px; height: 36px; border-radius: 8px; border: none;
  background: ${t.colors.surfaceAlt}; cursor: pointer;
  align-items: center; justify-content: center; color: ${t.colors.textSecondary};
  svg { width:18px; height:18px; stroke:currentColor; fill:none;
        stroke-width:2; stroke-linecap:round; }
`

const Breadcrumb = styled.div`
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: ${t.colors.textMuted};
  a { color: inherit; text-decoration: none;
    &:hover { color: ${t.colors.text}; } }
  svg { width:14px; height:14px; stroke:currentColor; fill:none;
        stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
`

const TopbarRight = styled.div`display: flex; align-items: center; gap: 8px;`

const IconBtn = styled.button`
  position: relative;
  width: 36px; height: 36px; border-radius: 8px; border: none;
  background: ${t.colors.surfaceAlt}; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: ${t.colors.textSecondary}; transition: background 0.15s, color 0.15s;
  svg { width:17px; height:17px; stroke:currentColor; fill:none;
        stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
  &:hover { background: ${t.colors.border}; color: ${t.colors.text}; }
`

const NotifDot = styled.span`
  position: absolute; top: 6px; right: 6px;
  width: 8px; height: 8px; border-radius: 50%;
  background: ${t.colors.danger};
  border: 2px solid ${t.colors.surface};
`

const TopbarProfile = styled.div`
  display: flex; align-items: center; gap: 8px; padding: 6px 10px;
  border-radius: 8px; cursor: pointer; transition: background 0.15s;
  &:hover { background: ${t.colors.surfaceAlt}; }
`

const TopbarName = styled.p`
  font-size: 13px; font-weight: 600; color: ${t.colors.text};
  @media (max-width: 600px) { display: none; }
`

const TopbarRole = styled.p`
  font-size: 11px; color: ${t.colors.textMuted};
  @media (max-width: 600px) { display: none; }
`

// ── Content ───────────────────────────────────────────────────────────────────

const Content = styled.main`flex: 1;`

// ── View-site link ────────────────────────────────────────────────────────────

const ViewSiteBtn = styled(Link)`
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600; color: ${t.colors.textSecondary};
  text-decoration: none; padding: 6px 12px; border-radius: 8px;
  border: 1px solid ${t.colors.border}; transition: all 0.15s;
  svg { width:13px; height:13px; stroke:currentColor; fill:none;
        stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
  &:hover { background: ${t.colors.surfaceAlt}; color: ${t.colors.text}; }
`

// ── Mobile overlay ────────────────────────────────────────────────────────────

const MobileOverlay = styled.div<{ $show: boolean }>`
  display: none;
  @media (max-width: 768px) {
    display: ${({ $show }) => ($show ? 'block' : 'none')};
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    z-index: 199;
  }
`

// ── Helper to get breadcrumb label ────────────────────────────────────────────

function getBreadcrumb(pathname: string) {
  const map: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/announcements': 'Announcements',
    '/admin/events': 'Events',
    '/admin/sermons': 'Sermons',
    '/admin/livestreams': 'Livestreams',
    '/admin/ministries': 'Ministries',
    '/admin/services': 'Services',
    '/admin/leadership': 'Leadership',
    '/admin/members': 'Members',
    '/admin/prayer-requests': 'Prayer Requests',
    '/admin/giving': 'Giving',
    '/admin/messages': 'Messages',
    '/admin/notifications': 'Notifications',
    '/admin/analytics': 'Analytics',
    '/admin/users': 'Users & Roles',
    '/admin/activity-log': 'Activity Log',
    '/admin/settings': 'Settings',
  }
  return map[pathname] ?? 'Dashboard'
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const page = getBreadcrumb(location.pathname)
  const newMsgCount = mockMessages.filter(m => m.status === 'new').length
  const newPrayerCount = mockPrayerRequests.filter(p => p.status === 'new').length

  const handleMobileToggle = () => {
    setMobileOpen(v => !v)
    if (collapsed) setCollapsed(false)
  }

  return (
    <Shell>
      {/* ── Sidebar ── */}
      <Sidebar $collapsed={collapsed && !mobileOpen}>
        <SidebarTop>
          <LogoWrap to="/admin">
            <LogoDot>
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </LogoDot>
            {(!collapsed || mobileOpen) && (
              <LogoText>
                <p>Emganwini</p>
                <p>Admin Portal</p>
              </LogoText>
            )}
          </LogoWrap>
          {(!collapsed || mobileOpen) && (
            <CollapseBtn onClick={() => setCollapsed(true)} title="Collapse sidebar">
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </CollapseBtn>
          )}
          {collapsed && !mobileOpen && (
            <CollapseBtn onClick={() => setCollapsed(false)} title="Expand sidebar" style={{ margin: '0 auto' }}>
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </CollapseBtn>
          )}
        </SidebarTop>

        <NavScroll>
          {NAV.map(group => (
            <NavGroup key={group.group}>
              <NavGroupLabel $collapsed={collapsed && !mobileOpen}>{group.group}</NavGroupLabel>
              {group.items.map(item => {
                const active = location.pathname === item.path ||
                  (item.path !== '/admin' && location.pathname.startsWith(item.path))
                return (
                  <NavItem
                    key={item.path}
                    to={item.path}
                    $active={active}
                    $collapsed={collapsed && !mobileOpen}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.icon}
                    <span className="label">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <NavBadge $collapsed={collapsed && !mobileOpen}>{item.badge}</NavBadge>
                    )}
                  </NavItem>
                )
              })}
            </NavGroup>
          ))}
        </NavScroll>

        <SidebarBottom>
          <ProfileBtn $collapsed={collapsed && !mobileOpen}>
            <ProfileAvatar>A</ProfileAvatar>
            <ProfileInfo $collapsed={collapsed && !mobileOpen}>
              <p>Admin</p>
              <p>Super Admin</p>
            </ProfileInfo>
          </ProfileBtn>
        </SidebarBottom>
      </Sidebar>

      {/* Mobile overlay */}
      <MobileOverlay $show={mobileOpen} onClick={() => setMobileOpen(false)} />

      {/* ── Main ── */}
      <Main $collapsed={collapsed}>
        <Topbar>
          <TopbarLeft>
            <MobileMenuBtn onClick={handleMobileToggle}>
              <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </MobileMenuBtn>
            <Breadcrumb>
              <Link to="/admin">Dashboard</Link>
              {page !== 'Dashboard' && (
                <>
                  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  <span style={{ color: t.colors.text, fontWeight: 500 }}>{page}</span>
                </>
              )}
            </Breadcrumb>
          </TopbarLeft>

          <TopbarRight>
            <ViewSiteBtn to="/" target="_blank">
              <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View Site
            </ViewSiteBtn>

            <IconBtn as={Link} to="/admin/messages" title="Messages">
              <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {newMsgCount > 0 && <NotifDot />}
            </IconBtn>

            <IconBtn as={Link} to="/admin/notifications" title="Notifications">
              <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {(newMsgCount + newPrayerCount) > 0 && <NotifDot />}
            </IconBtn>

            <TopbarProfile>
              <ProfileAvatar style={{ width: 32, height: 32, fontSize: 13 }}>A</ProfileAvatar>
              <div>
                <TopbarName>Admin</TopbarName>
                <TopbarRole>Super Admin</TopbarRole>
              </div>
            </TopbarProfile>
          </TopbarRight>
        </Topbar>

        <Content>
          <Outlet />
        </Content>
      </Main>
    </Shell>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function GridIcon()     { return <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> }
function BellIcon()     { return <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> }
function CalendarIcon() { return <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function PlayIcon()     { return <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg> }
function VideoIcon()    { return <svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
function UsersIcon()    { return <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function ClockIcon()    { return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function StarIcon()     { return <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function UserIcon()     { return <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function HeartIcon()    { return <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> }
function DollarIcon()   { return <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function MailIcon()     { return <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> }
function AlertIcon()    { return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> }
function ChartIcon()    { return <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function ShieldIcon()   { return <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
function ListIcon()     { return <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> }
function SettingsIcon() { return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }

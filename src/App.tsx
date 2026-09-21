import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WorldwideChurch from './components/WorldwideChurch'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import EventsPage from './pages/EventsPage'
import YouthMinistryPage from './pages/YouthMinistryPage'
import HealthMinistryPage from './pages/HealthMinistryPage'
import PrayerMinistryPage from './pages/PrayerMinistryPage'
import WomensMinistryPage from './pages/WomensMinistryPage'
import MensMinistryPage from './pages/MensMinistryPage'
import ChildrensMinistryPage from './pages/ChildrensMinistryPage'
import CommunityOutreachPage from './pages/CommunityOutreachPage'
import ContactPage from './pages/ContactPage'
import GivingPage from './pages/GivingPage'
import PublicSermonsPage from './pages/SermonsPage'

// Admin
import AdminLayout from './admin/components/AdminLayout'
import AdminGuard from './admin/components/AdminGuard'
import DashboardPage from './admin/pages/DashboardPage'
import EventsAdminPage from './admin/pages/EventsPage'
import AnnouncementsPage from './admin/pages/AnnouncementsPage'
import SermonsAdminPage from './admin/pages/SermonsPage'
import LivestreamsPage from './admin/pages/LivestreamsPage'
import MinistriesPage from './admin/pages/MinistriesPage'
import ServicesPage from './admin/pages/ServicesPage'
import PrayerRequestsPage from './admin/pages/PrayerRequestsPage'
import MessagesPage from './admin/pages/MessagesPage'
import MembersPage from './admin/pages/MembersPage'
import AdminGivingPage from './admin/pages/GivingPage'
import LeadershipPage from './admin/pages/LeadershipPage'
import AnalyticsPage from './admin/pages/AnalyticsPage'
import UsersPage from './admin/pages/UsersPage'
import ActivityLogPage from './admin/pages/ActivityLogPage'
import NotificationsPage from './admin/pages/NotificationsPage'
import SettingsPage from './admin/pages/SettingsPage'

// Public layout wrapper — renders navbar/footer
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      {children}
      <WorldwideChurch />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public site ── */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/about"                element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/calendar"             element={<PublicLayout><EventsPage /></PublicLayout>} />
            <Route path="/ministries/youth"     element={<PublicLayout><YouthMinistryPage /></PublicLayout>} />
            <Route path="/ministries/health"    element={<PublicLayout><HealthMinistryPage /></PublicLayout>} />
            <Route path="/ministries/prayer"    element={<PublicLayout><PrayerMinistryPage /></PublicLayout>} />
            <Route path="/ministries/women"     element={<PublicLayout><WomensMinistryPage /></PublicLayout>} />
            <Route path="/ministries/men"       element={<PublicLayout><MensMinistryPage /></PublicLayout>} />
            <Route path="/ministries/children"  element={<PublicLayout><ChildrensMinistryPage /></PublicLayout>} />
            <Route path="/ministries/community" element={<PublicLayout><CommunityOutreachPage /></PublicLayout>} />
            <Route path="/contact"              element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/sermons"              element={<PublicLayout><PublicSermonsPage /></PublicLayout>} />
            <Route path="/giving"               element={<PublicLayout><GivingPage /></PublicLayout>} />

            {/* ── Admin dashboard ── */}
            <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
              <Route index                  element={<DashboardPage />} />
              <Route path="announcements"   element={<AnnouncementsPage />} />
              <Route path="events"          element={<EventsAdminPage />} />
              <Route path="sermons"         element={<SermonsAdminPage />} />
              <Route path="livestreams"     element={<LivestreamsPage />} />
              <Route path="ministries"      element={<MinistriesPage />} />
              <Route path="services"        element={<ServicesPage />} />
              <Route path="leadership"      element={<LeadershipPage />} />
              <Route path="members"         element={<MembersPage />} />
              <Route path="prayer-requests" element={<PrayerRequestsPage />} />
              <Route path="giving"          element={<AdminGivingPage />} />
              <Route path="messages"        element={<MessagesPage />} />
              <Route path="notifications"   element={<NotificationsPage />} />
              <Route path="analytics"       element={<AnalyticsPage />} />
              <Route path="users"           element={<UsersPage />} />
              <Route path="activity-log"    element={<ActivityLogPage />} />
              <Route path="settings"        element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

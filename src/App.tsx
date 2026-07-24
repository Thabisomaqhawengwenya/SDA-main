import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
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

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/"                       element={<HomePage />} />
          <Route path="/about"                  element={<AboutPage />} />
          <Route path="/calendar"               element={<EventsPage />} />
          <Route path="/ministries/youth"       element={<YouthMinistryPage />} />
          <Route path="/ministries/health"      element={<HealthMinistryPage />} />
          <Route path="/ministries/prayer"      element={<PrayerMinistryPage />} />
          <Route path="/ministries/women"       element={<WomensMinistryPage />} />
          <Route path="/ministries/men"         element={<MensMinistryPage />} />
          <Route path="/ministries/children"    element={<ChildrensMinistryPage />} />
          <Route path="/ministries/community"   element={<CommunityOutreachPage />} />
          <Route path="/contact"               element={<ContactPage />} />
          <Route path="/giving"                element={<GivingPage />} />
        </Routes>
        <WorldwideChurch />
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  )
}

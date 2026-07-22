import { useState, useMemo } from 'react'
import styled, { keyframes } from 'styled-components'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChurchEvent {
  id: number
  title: string
  date: Date
  endDate?: Date
  time: string
  category: string
  categoryColor: string
  description: string
  location?: string
  isRecurring?: boolean
}

// ── Sample Data ───────────────────────────────────────────────────────────────

const EVENTS: ChurchEvent[] = [
  {
    id: 1,
    title: 'Virtual Bible Studies @ 7pm Tuesday Nights on Zoom',
    date: new Date(2026, 6, 21),
    time: '7:00 pm',
    category: 'Bible Study',
    categoryColor: '#3b82f6',
    description: 'Tuesday Night Virtual Bible Studies is on at 7 PM (BST) by Zoom Video Conference. Join us as we dive deep into Scripture together.',
    location: 'Zoom Video Conference',
    isRecurring: true,
  },
  {
    id: 2,
    title: 'Prayer and Fasting Series for May',
    date: new Date(2026, 6, 23),
    endDate: new Date(2026, 6, 24),
    time: '8:00 pm – 6:00 pm',
    category: 'Prayer & Fasting',
    categoryColor: '#8b5cf6',
    description: 'Our dear church family, as we journey toward heaven, challenges and setbacks are expected. If we are not spiritually watchful, spiritual apathy can set in. There are serious concerns about […]',
    isRecurring: true,
  },
  {
    id: 3,
    title: 'Virtual Bible Studies @ 7pm Tuesday Nights on Zoom',
    date: new Date(2026, 7, 4),
    time: '7:00 pm',
    category: 'Bible Study',
    categoryColor: '#3b82f6',
    description: 'Tuesday Night Virtual Bible Studies is on at 7 PM (BST) by Zoom Video Conference. Join us as we dive deep into Scripture together.',
    location: 'Zoom Video Conference',
    isRecurring: true,
  },
  {
    id: 4,
    title: 'Prayer and Fasting Series for May',
    date: new Date(2026, 7, 6),
    endDate: new Date(2026, 7, 7),
    time: '8:00 pm – 6:00 pm',
    category: 'Prayer & Fasting',
    categoryColor: '#8b5cf6',
    description: 'Our dear church family, as we journey toward heaven, challenges and setbacks are expected. If we are not spiritually watchful, spiritual apathy can set in. There are serious concerns about […]',
    isRecurring: true,
  },
  {
    id: 5,
    title: 'Boundaries Book Group Discussion',
    date: new Date(2026, 7, 8),
    time: '10:00 am – 12:00 pm',
    category: 'Book Group',
    categoryColor: '#10b981',
    description: 'Learn how to set healthy boundaries in all your relationships. Join us to learn "when to say yes and how to say no to take control of your life."',
    location: 'Fellowship Hall',
  },
  {
    id: 6,
    title: 'Virtual Bible Studies @ 7pm Tuesday Nights on Zoom',
    date: new Date(2026, 7, 11),
    time: '7:00 pm',
    category: 'Bible Study',
    categoryColor: '#3b82f6',
    description: 'Tuesday Night Virtual Bible Studies is on at 7 PM (BST) by Zoom Video Conference.',
    location: 'Zoom Video Conference',
    isRecurring: true,
  },
  {
    id: 7,
    title: 'Prayer and Fasting Series for May',
    date: new Date(2026, 7, 13),
    endDate: new Date(2026, 7, 14),
    time: '8:00 pm – 6:00 pm',
    category: 'Prayer & Fasting',
    categoryColor: '#8b5cf6',
    description: 'Our dear church family, as we journey toward heaven, challenges and setbacks are expected. If we are not spiritually watchful, spiritual apathy can set in.',
    isRecurring: true,
  },
  {
    id: 8,
    title: 'Virtual Bible Studies @ 7pm Tuesday Nights on Zoom',
    date: new Date(2026, 7, 18),
    time: '7:00 pm',
    category: 'Bible Study',
    categoryColor: '#3b82f6',
    description: 'Tuesday Night Virtual Bible Studies is on at 7 PM (BST) by Zoom Video Conference.',
    location: 'Zoom Video Conference',
    isRecurring: true,
  },
  {
    id: 9,
    title: 'Youth Sabbath Program',
    date: new Date(2026, 7, 22),
    time: '11:30 am',
    category: 'Youth',
    categoryColor: '#f59e0b',
    description: 'Our young people lead the worship service. Come support and encourage the next generation of faith leaders.',
    location: 'Main Sanctuary',
  },
  {
    id: 10,
    title: 'Community Health Fair',
    date: new Date(2026, 7, 29),
    time: '9:00 am – 2:00 pm',
    category: 'Community',
    categoryColor: '#ef4444',
    description: 'Free health screenings, nutrition consultations, and wellness resources for the entire community. All are welcome.',
    location: 'Church Grounds',
  },
]

// ── Styled Components ────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

const PageWrapper = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.navHeight};
`

const HeroBanner = styled.section`
  position: relative;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(17, 38, 64, 0.85) 0%, rgba(23, 50, 75, 0.75) 100%),
              url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80') center / cover;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  animation: ${fadeUp} 0.7s ease both;
`

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;

  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
    opacity: 0.6;
  }

  span { opacity: 0.5; }
`

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(40px, 5vw, 68px);
  font-weight: 500;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0;
`

const ContentSection = styled.section`
  padding: 56px 32px 96px;
  background: ${({ theme }) => theme.colors.bg};
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 40px 20px 72px;
  }
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    stroke: ${({ theme }) => theme.colors.textMuted};
    fill: none;
    stroke-width: 2;
  }

  input {
    width: 100%;
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 10px 14px 10px 42px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      border-color: ${({ theme }) => theme.colors.accent};
      box-shadow: 0 0 0 3px rgba(74, 103, 65, 0.1);
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: none;
  }
`

const ViewToggles = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ToggleBtn = styled.button<{ $active?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.text)};
  background: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.surface)};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.accentDark : theme.colors.offWhite)};
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

const DateHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const DateNav = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const NavBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.white};
  }
`

const DateRange = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  span {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }

  button {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.accent};
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.accentDark};
    }
  }
`

const FindEventsBtn = styled.button`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 10px 24px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accentDark};
    transform: translateY(-1px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`

const EventsTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;
`

const MonthGroup = styled.div``

const MonthLabel = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 24px;
`

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const EventCard = styled.article`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 60px 1fr;
    gap: 16px;
  }
`

const DayBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px 8px;
  text-align: center;
  flex-shrink: 0;

  span:first-child {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 4px;
  }

  span:last-child {
    font-family: ${({ theme }) => theme.fonts.serif};
    font-size: 28px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.accentDark};
    line-height: 1;
  }
`

const EventContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const EventMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  svg {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
  }
`

const CategoryTag = styled.span<{ $color: string }>`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => `${$color}15`};
  border: 1px solid ${({ $color }) => `${$color}40`};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 3px 10px;
  text-transform: uppercase;
`

const EventTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 21px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accentDark};
  line-height: 1.3;
  margin: 0;
  letter-spacing: -0.01em;
`

const EventDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.7;
  margin: 0;
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState<'list' | 'month' | 'day'>('list')

  // Group events by month
  const groupedEvents = useMemo(() => {
    const filtered = EVENTS.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.date.getTime() - b.date.getTime())

    const grouped: { [key: string]: ChurchEvent[] } = {}
    filtered.forEach((event) => {
      const monthYear = event.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      if (!grouped[monthYear]) grouped[monthYear] = []
      grouped[monthYear].push(event)
    })
    return grouped
  }, [searchTerm])

  const formatDate = (date: Date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'short' })
    const num = date.getDate()
    return { day, num }
  }

  return (
    <PageWrapper>
      {/* Hero Banner */}
      <HeroBanner>
        <HeroContent>
          <Breadcrumb>
            <svg viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>/</span>
            <span>Events</span>
          </Breadcrumb>
          <HeroTitle>Events</HeroTitle>
        </HeroContent>
      </HeroBanner>

      {/* Main Content */}
      <ContentSection>
        {/* Toolbar */}
        <Toolbar>
          <SearchBar>
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search for events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>

          <ViewToggles>
            <FindEventsBtn>Find Events</FindEventsBtn>
            <ToggleBtn $active={view === 'list'} onClick={() => setView('list')}>List</ToggleBtn>
            <ToggleBtn $active={view === 'month'} onClick={() => setView('month')}>Month</ToggleBtn>
            <ToggleBtn $active={view === 'day'} onClick={() => setView('day')}>Day</ToggleBtn>
          </ViewToggles>
        </Toolbar>

        {/* Date Header */}
        <DateHeader>
          <DateNav>
            <NavBtn>
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
            </NavBtn>
            <NavBtn>
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
            </NavBtn>
          </DateNav>

          <DateRange>
            <button>Today</button>
            <span>Now – August 18</span>
          </DateRange>
        </DateHeader>

        {/* Events Timeline */}
        <EventsTimeline>
          {Object.entries(groupedEvents).map(([monthYear, events]) => (
            <MonthGroup key={monthYear}>
              <MonthLabel>{monthYear}</MonthLabel>
              <EventsList>
                {events.map((event) => {
                  const { day, num } = formatDate(event.date)
                  return (
                    <EventCard key={event.id}>
                      <DayBadge>
                        <span>{day}</span>
                        <span>{num}</span>
                      </DayBadge>
                      <EventContent>
                        <EventMeta>
                          <span>
                            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {event.time}
                          </span>
                          <CategoryTag $color={event.categoryColor}>{event.category}</CategoryTag>
                          {event.isRecurring && <span style={{ color: '#888' }}>● Recurring</span>}
                        </EventMeta>
                        <EventTitle>{event.title}</EventTitle>
                        <EventDesc>{event.description}</EventDesc>
                        {event.location && (
                          <EventMeta style={{ marginTop: 4 }}>
                            <span>
                              <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              {event.location}
                            </span>
                          </EventMeta>
                        )}
                      </EventContent>
                    </EventCard>
                  )
                })}
              </EventsList>
            </MonthGroup>
          ))}
        </EventsTimeline>
      </ContentSection>
    </PageWrapper>
  )
}

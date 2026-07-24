import { useState, useMemo } from 'react'
import styled from 'styled-components'

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
    description: 'Our dear church family, as we journey toward heaven, challenges and setbacks are expected. If we are not spiritually watchful, spiritual apathy can set in. There are serious concerns about how we engage our community.',
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
    description: 'Our dear church family, as we journey toward heaven, challenges and setbacks are expected. If we are not spiritually watchful, spiritual apathy can set in.',
    isRecurring: true,
  },
  {
    id: 5,
    title: 'Boundaries Book Group Discussion',
    date: new Date(2026, 7, 8),
    time: '10:00 am – 12:00 pm',
    category: 'Book Group',
    categoryColor: '#10b981',
    description: 'Learn how to set healthy boundaries in all your relationships. Join us to learn when to say yes and how to say no to take control of your life.',
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

// ── Image map ─────────────────────────────────────────────────────────────────

const EVENT_IMAGES: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&q=80',
  2: 'https://images.unsplash.com/photo-1476725994324-6f756b28af53?w=400&q=80',
  3: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&q=80',
  4: 'https://images.unsplash.com/photo-1476725994324-6f756b28af53?w=400&q=80',
  5: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
  6: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&q=80',
  7: 'https://images.unsplash.com/photo-1476725994324-6f756b28af53?w=400&q=80',
  8: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&q=80',
  9: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  10: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80',
}

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

// ── Styled Components ─────────────────────────────────────────────────────────

const PageWrapper = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.navHeight};
`

// ── Hero ──────────────────────────────────────────────────────────────────────

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80');
  background-size: cover;
  background-position: center;
`

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
`

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 24px;
`

const HeroHeading = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #ffffff;
  margin: 0 0 28px;
`

const HeroSubtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 300;
  color: #ffffff;
  opacity: 0.85;
  max-width: 480px;
  line-height: 1.75;
  margin: 0;
`

// ── Content ───────────────────────────────────────────────────────────────────

const ContentSection = styled.section`
  background: #ffffff;
  max-width: 900px;
  margin: 0 auto;
  padding: 64px 32px 96px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 48px 20px 72px;
  }
`

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const ListTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`

const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const ToggleBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: 1px solid ${({ $active }) => ($active ? '#1DA1F2' : '#e8e6e0')};
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.2s ease;

  svg {
    width: 17px;
    height: 17px;
    stroke: ${({ $active }) => ($active ? '#1DA1F2' : '#9a9a9a')};
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke 0.2s ease;
  }

  &:hover {
    border-color: #1DA1F2;
    svg { stroke: #1DA1F2; }
  }
`

const HR = styled.hr`
  border: none;
  border-top: 1px solid #e8e6e0;
  margin: 0;
`

// ── Event Row ─────────────────────────────────────────────────────────────────

const EventRow = styled.article`
  display: grid;
  grid-template-columns: 72px 200px 1fr;
  gap: 28px;
  align-items: start;
  padding: 32px 0;
  border-bottom: 1px solid #e8e6e0;
  transition: opacity 0.2s ease;

  &:hover { opacity: 0.88; }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 72px 1fr;
    grid-template-rows: auto auto;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

const DateCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 20px;
  border-right: 1px solid #e8e6e0;
  padding-top: 4px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    align-items: baseline;
    gap: 6px;
    border-right: none;
    border-bottom: 1px solid #e8e6e0;
    padding-right: 0;
    padding-bottom: 10px;
  }
`

const MonthAbbr = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 4px;
`

const DayNumber = styled.span`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 42px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
`

const ThumbCol = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-column: 2;
    grid-row: 1;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-column: 1;
  }
`

const Thumbnail = styled.img`
  width: 100%;
  height: 130px;
  object-fit: cover;
  border-radius: 4px;
  display: block;
`

const ThumbPlaceholder = styled.div<{ $color: string }>`
  width: 100%;
  height: 130px;
  border-radius: 4px;
  background: ${({ $color }) => `${$color}22`};
`

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-column: 1 / -1;
  }
`

const EventTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.3;
  margin: 0;
`

const EventMeta = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  line-height: 1.5;
`

const EventDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.65;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const ViewLink = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1DA1F2;
  cursor: pointer;
  margin-top: 4px;
  transition: opacity 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover { opacity: 0.7; }
`

// ── Previous Events ───────────────────────────────────────────────────────────

const PrevRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 44px 0 0;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
    stroke: ${({ theme }) => theme.colors.textMuted};
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  span {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:hover { opacity: 0.65; }
`

// ── Closing Banner ────────────────────────────────────────────────────────────

const ClosingBanner = styled.section`
  background: #1a1a1a;
  width: 100%;
  padding: 96px 48px;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 72px 32px;
  }
`

const QuoteText = styled.p`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(28px, 4vw, 52px);
  font-style: italic;
  font-weight: 400;
  color: #ffffff;
  opacity: 0.9;
  margin: 0;
  line-height: 1.3;
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [searchTerm] = useState('')
  const [view, setView] = useState<'list' | 'month'>('list')

  const allEvents = useMemo(() => {
    return EVENTS.filter(
      (e) =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase()),
    ).sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [searchTerm])

  return (
    <PageWrapper>
      {/* Hero */}
      <HeroSection>
        <HeroOverlay />
        <HeroContent>
          <HeroHeading>Events</HeroHeading>
          <HeroSubtitle>
            We seek to actively engage our community with fellowship and love.
            Below you will find a list of upcoming events that you can attend,
            volunteer, and share with others.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      {/* Content */}
      <ContentSection>
        <ListHeader>
          <ListTitle>Upcoming Events</ListTitle>
          <ToggleGroup>
            <ToggleBtn $active={view === 'list'} onClick={() => setView('list')} aria-label="List view">
              <svg viewBox="0 0 24 24">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </ToggleBtn>
            <ToggleBtn $active={view === 'month'} onClick={() => setView('month')} aria-label="Month view">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </ToggleBtn>
          </ToggleGroup>
        </ListHeader>

        <HR />

        {allEvents.map((event) => {
          const imgSrc = EVENT_IMAGES[event.id]
          const meta = [event.location, event.time].filter(Boolean).join(' · ')

          return (
            <EventRow key={event.id}>
              <DateCol>
                <MonthAbbr>{MONTH_ABBR[event.date.getMonth()]}</MonthAbbr>
                <DayNumber>{event.date.getDate()}</DayNumber>
              </DateCol>

              <ThumbCol>
                {imgSrc
                  ? <Thumbnail src={imgSrc} alt={event.title} loading="lazy" />
                  : <ThumbPlaceholder $color={event.categoryColor} />}
              </ThumbCol>

              <InfoCol>
                <EventTitle>{event.title}</EventTitle>
                {meta && <EventMeta>{meta}</EventMeta>}
                <EventDesc>{event.description}</EventDesc>
                <ViewLink tabIndex={0} role="button">View Event Details →</ViewLink>
              </InfoCol>
            </EventRow>
          )
        })}

        <PrevRow tabIndex={0} role="button" aria-label="Previous events">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 8 8 12 12 16" />
            <line x1="16" y1="12" x2="8" y2="12" />
          </svg>
          <span>Previous Events</span>
        </PrevRow>
      </ContentSection>

      {/* Closing Banner */}
      <ClosingBanner>
        <QuoteText>Connecting our community to Christ</QuoteText>
      </ClosingBanner>
    </PageWrapper>
  )
}

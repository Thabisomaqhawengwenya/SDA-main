import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { subscribeEvents } from '../services/eventsService'

// ── Animations ────────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

// ── Data ──────────────────────────────────────────────────────────────────────

const events = [
  {
    id: 1,
    category: 'Bible Study',
    categoryColor: '#3b82f6',
    title: 'Virtual Bible Studies on Zoom',
    date: 'Tuesday, 21 July 2026',
    time: '7:00 pm',
    location: 'Zoom Video Conference',
    description:
      'Join us every Tuesday evening for an in-depth study of Scripture. All are welcome — no prior Bible knowledge required.',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80',
  },
  {
    id: 2,
    category: 'Prayer & Fasting',
    categoryColor: '#8b5cf6',
    title: 'Prayer and Fasting Series',
    date: 'Thursday – Friday, 23–24 July 2026',
    time: '8:00 pm – 6:00 pm',
    location: 'Main Sanctuary',
    description:
      'A dedicated time of corporate prayer and fasting as we seek God together. Come with an open heart and a willing spirit.',
    image: 'https://images.unsplash.com/photo-1476725994324-6f756b28af53?w=800&q=80',
  },
  {
    id: 3,
    category: 'Community',
    categoryColor: '#ef4444',
    title: 'Community Health Fair',
    date: 'Saturday, 29 August 2026',
    time: '9:00 am – 2:00 pm',
    location: 'Church Grounds',
    description:
      'Free health screenings, nutrition consultations, and wellness resources open to the entire Emganwini community.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
  },
]

// ── Styled Components ─────────────────────────────────────────────────────────

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 80px 48px 88px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 64px 24px 72px;
  }
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

// ── Section header ────────────────────────────────────────────────────────────

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 48px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 36px;
  }
`

const HeaderLeft = styled.div``

const SectionLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
  margin-bottom: 10px;
`

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
`

const ViewAllBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1DA1F2;
  text-decoration: none;
  white-space: nowrap;
  transition: gap 0.2s ease, opacity 0.2s ease;
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.2s ease;
  }

  &:hover {
    opacity: 0.75;
    svg { transform: translateX(3px); }
  }
`

// ── Cards grid ────────────────────────────────────────────────────────────────

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`

const Card = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  animation: ${fadeUp} 0.55s ease both;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-4px);
  }
`

// ── Card image ────────────────────────────────────────────────────────────────

const ImageWrap = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 180px;
  }
`

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  ${Card}:hover & {
    transform: scale(1.05);
  }
`

const CategoryBadge = styled.span<{ $color: string }>`
  position: absolute;
  top: 14px;
  left: 14px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
  background: ${({ $color }) => $color};
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.full};
`

// ── Card body ─────────────────────────────────────────────────────────────────

const CardBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin: 0;
`

const MetaList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const MetaItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;

  svg {
    width: 14px;
    height: 14px;
    stroke: ${({ theme }) => theme.colors.accent};
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex-shrink: 0;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0;
`

const Description = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.75;
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const CardFooter = styled.div`
  margin-top: auto;
  padding-top: 4px;
`

const ViewEventBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1DA1F2;
  text-decoration: none;
  transition: gap 0.2s ease, opacity 0.2s ease;

  svg {
    width: 13px;
    height: 13px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.2s ease;
  }

  &:hover {
    opacity: 0.75;
    svg { transform: translateX(3px); }
  }
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function UpcomingEvents() {
  const [displayEvents, setDisplayEvents] = useState(events)

  useEffect(() => {
    const unsub = subscribeEvents((items) => {
      const published = items.filter(e => e.status === 'published')
      if (published.length > 0) {
        const mapped = published.slice(0, 3).map((e, idx) => ({
          id: idx + 1,
          category: e.category,
          categoryColor: e.categoryColor || '#3b82f6',
          title: e.title,
          date: new Date(e.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
          time: e.time,
          location: e.location || 'Main Sanctuary',
          description: e.description,
          image: e.image || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80',
        }))
        setDisplayEvents(mapped)
      }
    })
    return () => unsub?.()
  }, [])

  return (
    <Section>
      <Container>
        <Header>
          <HeaderLeft>
            <SectionLabel>What's On</SectionLabel>
            <SectionTitle>Upcoming Events</SectionTitle>
          </HeaderLeft>
          <ViewAllBtn to="/calendar">
            View All Events
            <svg viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </ViewAllBtn>
        </Header>

        <Grid>
          {displayEvents.map((event, i) => (
            <Card key={event.id} style={{ animationDelay: `${i * 0.1}s` }}>
              <ImageWrap>
                <CardImage
                  src={event.image || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80'}
                  alt={event.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80';
                  }}
                />
                <CategoryBadge $color={event.categoryColor}>
                  {event.category}
                </CategoryBadge>
              </ImageWrap>

              <CardBody>
                <CardTitle>{event.title}</CardTitle>

                <MetaList>
                  <MetaItem>
                    {/* Calendar icon */}
                    <svg viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {event.date}
                  </MetaItem>
                  <MetaItem>
                    {/* Clock icon */}
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {event.time}
                  </MetaItem>
                  <MetaItem>
                    {/* Pin icon */}
                    <svg viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {event.location}
                  </MetaItem>
                </MetaList>

                <Divider />

                <Description>{event.description}</Description>

                <CardFooter>
                  <ViewEventBtn to="/calendar">
                    Learn More
                    <svg viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </ViewEventBtn>
                </CardFooter>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}

import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Section = styled.section`
  background: #ffffff;
  padding: 48px 32px 56px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 32px 20px 40px;
  }
`

const Grid = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`

const Card = styled(Link)`
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 12px;
  height: 420px;
  text-decoration: none;
  cursor: pointer;
  animation: ${fadeUp} 0.55s ease both;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.35s ease, transform 0.35s ease;

  &:hover {
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.22);
    transform: translateY(-4px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 340px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 280px;
  }
`

// ── Background photo fills the card ──────────────────────────────────────────

const CardImage = styled.div<{ $url: string }>`
  position: absolute;
  inset: 0;
  background-image: url('${({ $url }) => $url}');
  background-size: cover;
  background-position: center;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  ${Card}:hover & {
    transform: scale(1.05);
  }
`

// ── Bottom gradient so the label is always legible ────────────────────────────

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.70) 0%,
    rgba(0, 0, 0, 0.20) 35%,
    rgba(0, 0, 0, 0.0) 60%
  );
  border-radius: inherit;
`

// ── Label bottom-left ─────────────────────────────────────────────────────────

const CardLabel = styled.span`
  position: absolute;
  bottom: 22px;
  left: 22px;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
  line-height: 1.1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
  pointer-events: none;
`

// ── Data ──────────────────────────────────────────────────────────────────────

const cards = [
  {
    label: 'Events',
    to: '/calendar',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80',
  },
  {
    label: 'About Us',
    to: '/about',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=900&q=80',
  },
  {
    label: 'Ministries',
    to: '/ministries/youth',
    image: 'https://images.unsplash.com/photo-1476725994324-6f756b28af53?w=900&q=80',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuickLinks() {
  return (
    <Section aria-label="Quick links">
      <Grid>
        {cards.map((card, i) => (
          <Card
            key={card.to}
            to={card.to}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <CardImage $url={card.image} />
            <CardOverlay />
            <CardLabel>{card.label}</CardLabel>
          </Card>
        ))}
      </Grid>
    </Section>
  )
}

import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

// ── Section wraps cards in a padded white container ───────────────────────────

const Section = styled.section`
  background: #ffffff;
  padding: 48px 32px 56px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 32px 20px 40px;
  }
`

const Grid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

// ── Individual card — rounded, overflow hidden, fixed aspect ratio ─────────────

const Card = styled(Link)`
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 16px;
  aspect-ratio: 4 / 3;
  text-decoration: none;
  cursor: pointer;
  animation: ${fadeUp} 0.55s ease both;

  /* Subtle shadow so cards lift off the white bg */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.10);
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
    transform: translateY(-3px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    aspect-ratio: 16 / 9;
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
    rgba(0, 0, 0, 0.62) 0%,
    rgba(0, 0, 0, 0.12) 45%,
    rgba(0, 0, 0, 0.0) 100%
  );
  border-radius: inherit;
`

// ── Label bottom-left, same as the reference image ────────────────────────────

const CardLabel = styled.span`
  position: absolute;
  bottom: 24px;
  left: 24px;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 500;
  color: #ffffff;
  letter-spacing: -0.01em;
  line-height: 1.1;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
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

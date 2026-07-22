import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'

// ── Animations ────────────────────────────────────────────────────────────────

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
`

// ── Styled Components ─────────────────────────────────────────────────────────

const Section = styled.section`
  padding: 0;
  background: ${({ theme }) => theme.colors.bg};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const Card = styled(Link)`
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  text-decoration: none;
  cursor: pointer;
  animation: ${scaleIn} 0.6s ease both;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    aspect-ratio: 16 / 9;
  }
`

const CardImage = styled.div<{ $url: string }>`
  position: absolute;
  inset: 0;
  background-image: url('${({ $url }) => $url}');
  background-size: cover;
  background-position: center;
  transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  ${Card}:hover & {
    transform: scale(1.06);
  }
`

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.68) 0%,
    rgba(0, 0, 0, 0.18) 50%,
    rgba(0, 0, 0, 0.05) 100%
  );
  transition: background 0.35s ease;

  ${Card}:hover & {
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.75) 0%,
      rgba(0, 0, 0, 0.28) 55%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }
`

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px 28px 30px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`

const CardLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 500;
  color: #ffffff;
  letter-spacing: -0.01em;
  line-height: 1.1;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
`

const CardArrow = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  color: #ffffff;
  flex-shrink: 0;
  margin-left: 12px;
  margin-bottom: 2px;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;

  svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  ${Card}:hover & {
    background: rgba(255, 255, 255, 0.18);
    border-color: #ffffff;
    transform: translate(2px, -2px);
  }
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
            <CardContent>
              <CardLabel>{card.label}</CardLabel>
              <CardArrow>
                <svg viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </CardArrow>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Section>
  )
}

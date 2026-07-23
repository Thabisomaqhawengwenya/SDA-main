import styled, { keyframes } from 'styled-components'
import JoinUs from '../components/JoinUs'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

const PageWrapper = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.navHeight};
`

// ── Hero ──────────────────────────────────────────────────────────────────────

const HeroBanner = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(17, 38, 64, 0.88) 0%, rgba(30, 58, 45, 0.82) 100%),
              url('https://images.unsplash.com/photo-1438232992991-995b671e4668?w=1600&q=80') center / cover;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.25) 100%);
  }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  animation: ${fadeUp} 0.65s ease both;
`

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 16px;

  span { opacity: 0.45; }
`

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(38px, 5vw, 64px);
  font-weight: 500;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0;
`

// ── Contact info strip ────────────────────────────────────────────────────────

const InfoStrip = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 64px 48px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 48px 24px;
  }
`

const InfoGrid = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.offWhite};
  }
`

const InfoIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.offWhite};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    stroke: ${({ theme }) => theme.colors.accent};
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`

const InfoLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`

const InfoValue = styled.p`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accentDark};
  line-height: 1.4;
`

const InfoSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <HeroBanner>
        <HeroContent>
          <Breadcrumb>
            <span>Home</span>
            <span>/</span>
            <span style={{ opacity: 1, color: 'rgba(255,255,255,0.85)' }}>Contact Us</span>
          </Breadcrumb>
          <HeroTitle>Contact Us</HeroTitle>
        </HeroContent>
      </HeroBanner>

      {/* Contact info cards */}
      <InfoStrip>
        <InfoGrid>
          <InfoCard>
            <InfoIcon>
              <svg viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </InfoIcon>
            <InfoLabel>Location</InfoLabel>
            <InfoValue>Emganwini, Bulawayo</InfoValue>
            <InfoSub>Zimbabwe</InfoSub>
          </InfoCard>

          <InfoCard>
            <InfoIcon>
              <svg viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </InfoIcon>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>
              <a href="mailto:Connect@Emganwinisda.org" style={{ color: 'inherit', textDecoration: 'none' }}>
                Connect@Emganwinisda.org
              </a>
            </InfoValue>
            <InfoSub>We'll respond as soon as possible</InfoSub>
          </InfoCard>

          <InfoCard>
            <InfoIcon>
              <svg viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </InfoIcon>
            <InfoLabel>Service Times</InfoLabel>
            <InfoValue>Every Saturday</InfoValue>
            <InfoSub>Sabbath School 10:30 am · Worship 11:30 am</InfoSub>
          </InfoCard>
        </InfoGrid>
      </InfoStrip>

      {/* Join Us section (moved from home) */}
      <JoinUs />
    </PageWrapper>
  )
}

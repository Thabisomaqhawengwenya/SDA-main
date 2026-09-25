import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import heroBg from '../images/emganwini-hero.jpeg'
import HeroCanvas from './HeroCanvas'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
`

const HeroSection = styled.section`
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  padding-top: 96px; /* pt-24 rule: ~6rem */
  padding-bottom: 40px;
  background-color: #070d14;
`

const BgImageLayer = styled.div`
  position: absolute;
  inset: 0;
  background-image: url('${heroBg}');
  background-size: cover;
  background-position: center 38%;
  filter: brightness(0.68) saturate(1.1);
  transform: scale(1.02);
  transition: transform 12s cubic-bezier(0.25, 1, 0.5, 1);
`

const GradientScrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(6, 12, 19, 0.78) 0%,
    rgba(7, 14, 22, 0.42) 40%,
    rgba(6, 11, 18, 0.82) 80%,
    #070d14 100%
  );
  pointer-events: none;
`

const RadialGlow = styled.div`
  position: absolute;
  top: 25%;
  left: 15%;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(74, 103, 65, 0.22) 0%, rgba(6, 12, 19, 0) 70%);
  pointer-events: none;
  filter: blur(40px);
`

const CanvasWrapper = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.55;
  pointer-events: none;
`

const Container = styled.div`
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.25fr 0.85fr;
  align-items: center;
  gap: 48px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 36px;
    padding: 0 24px;
  }
`

const TextStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  animation: ${fadeIn} 0.7s cubic-bezier(0.23, 1, 0.32, 1) both;
`

const EyebrowPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(12px);
  padding: 6px 14px;
  border-radius: 9999px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 20px;
`

const PulseDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 8px #4ade80;
  animation: ${pulse} 2s infinite ease-in-out;
`

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(34px, 4.4vw, 58px);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.12;
  letter-spacing: -0.025em;
  margin: 0 0 16px;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.6);

  span {
    color: #89cff0;
    font-weight: 700;
  }
`

const Subtext = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(15px, 1.2vw, 17px);
  font-weight: 300;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.82);
  margin: 0 0 28px;
  max-width: 520px;
`

const CtaGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.accent};
  color: #ffffff;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 12px 26px;
  border-radius: 8px;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 4px 18px rgba(74, 103, 65, 0.35);
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accentLight};
    box-shadow: 0 6px 22px rgba(74, 103, 65, 0.45);
  }

  &:active {
    transform: scale(0.97);
  }
`

const SecondaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14.5px;
  font-weight: 500;
  padding: 12px 22px;
  border-radius: 8px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;

  svg {
    width: 15px;
    height: 15px;
    fill: currentColor;
    opacity: 0.9;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: scale(0.97);
  }
`

/* ── Service Times Glance Card ── */
const ServiceCard = styled.div`
  background: rgba(13, 24, 38, 0.65);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 28px 28px 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  animation: ${fadeIn} 0.9s cubic-bezier(0.23, 1, 0.32, 1) both;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 520px;
    padding: 20px 22px;
  }
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
  margin: 0;
`

const CardTag = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 500;
  color: #89cff0;
  background: rgba(137, 207, 240, 0.12);
  padding: 3px 9px;
  border-radius: 9999px;
`

const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
`

const ServiceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 10px 14px;
`

const ServiceMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const ServiceName = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13.5px;
  font-weight: 600;
  color: #ffffff;
`

const ServiceSub = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.55);
`

const ServiceTime = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 600;
  color: #89cff0;
  font-variant-numeric: tabular-nums;
  background: rgba(137, 207, 240, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
`

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);

  a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.15s ease;

    &:hover {
      color: #89cff0;
      text-decoration: underline;
    }
  }
`

export default function Hero() {
  return (
    <HeroSection>
      <BgImageLayer />
      <GradientScrim />
      <RadialGlow />
      <CanvasWrapper>
        <HeroCanvas />
      </CanvasWrapper>

      <Container>
        {/* ── Left Column: 4-element Text Stack ── */}
        <TextStack>
          {/* Element 1: Eyebrow */}
          <EyebrowPill>
            <PulseDot />
            Sabbath Worship · Every Saturday
          </EyebrowPill>

          {/* Element 2: Headline (2 lines max at desktop) */}
          <Headline>
            Connecting Our Community <span>To Christ</span>
          </Headline>

          {/* Element 3: Subtext (Max 20 words) */}
          <Subtext>
            Welcome to Emganwini Main Seventh-day Adventist Church. Experience warm fellowship, heartfelt worship, and transformative biblical truth.
          </Subtext>

          {/* Element 4: CTAs (1-2 words per button, never wrap) */}
          <CtaGroup>
            <PrimaryBtn to="/contact">Plan Visit</PrimaryBtn>
            <SecondaryBtn to="/sermons">
              <svg viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Watch Sermons
            </SecondaryBtn>
          </CtaGroup>
        </TextStack>

        {/* ── Right Column: Interactive Sabbath Card ── */}
        <ServiceCard>
          <CardHeader>
            <CardTitle>This Saturday</CardTitle>
            <CardTag>All Welcome</CardTag>
          </CardHeader>

          <ServiceList>
            <ServiceRow>
              <ServiceMeta>
                <ServiceName>Sabbath School</ServiceName>
                <ServiceSub>Interactive Bible Study</ServiceSub>
              </ServiceMeta>
              <ServiceTime>09:00 AM</ServiceTime>
            </ServiceRow>

            <ServiceRow>
              <ServiceMeta>
                <ServiceName>Divine Worship</ServiceName>
                <ServiceSub>Sermon, Praise &amp; Prayer</ServiceSub>
              </ServiceMeta>
              <ServiceTime>11:30 AM</ServiceTime>
            </ServiceRow>
          </ServiceList>

          <CardFooter>
            <span>Emganwini, Bulawayo</span>
            <Link to="/calendar">View Full Calendar →</Link>
          </CardFooter>
        </ServiceCard>
      </Container>
    </HeroSection>
  )
}


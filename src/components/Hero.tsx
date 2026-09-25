import { Link } from 'react-router-dom'
import styled from 'styled-components'
import heroBg from '../images/emganwini-hero.jpeg'

const HeroSection = styled.section`
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  box-sizing: border-box;
  padding-top: 100px;
  background-color: #0b1219;
`

const BgLayer = styled.div`
  position: absolute;
  inset: 0;
  background-image: url('${heroBg}');
  background-size: cover;
  background-position: center 35%;
  transform: scale(1.01);
`

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(9, 16, 23, 0.72) 0%,
    rgba(9, 16, 23, 0.45) 45%,
    rgba(9, 16, 23, 0.85) 85%,
    #0b1219 100%
  );
  pointer-events: none;
`

const MainContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: auto auto;
  padding: 40px 32px;
  position: relative;
  z-index: 2;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 24px 20px;
  }
`

const Eyebrow = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
  margin: 0 0 16px;
`

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(34px, 4.8vw, 64px);
  font-weight: 500;
  color: #ffffff;
  line-height: 1.12;
  letter-spacing: -0.01em;
  margin: 0 0 20px;
  max-width: 820px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 32px;
    line-height: 1.18;
  }
`

const Motto = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(16px, 1.3vw, 19px);
  font-weight: 300;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 32px;
  max-width: 620px;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
`

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #111111;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 13px 28px;
  border-radius: 4px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    background: #e6e6e6;
  }

  &:active {
    transform: scale(0.97);
  }
`

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  padding: 13px 26px;
  border-radius: 4px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.7);
  }

  &:active {
    transform: scale(0.97);
  }
`

/* ── Grounded Architectural Service Bar ── */
const BottomStrip = styled.div`
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(8, 14, 20, 0.85);
  backdrop-filter: blur(8px);
  width: 100%;
`

const StripInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 22px 32px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 18px 20px;
  }
`

const StripItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StripLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
`

const StripValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
`

export default function Hero() {
  return (
    <HeroSection>
      <BgLayer />
      <Vignette />

      <MainContainer>
        <Eyebrow>Seventh-day Adventist Church · Bulawayo, Zimbabwe</Eyebrow>

        <Headline>
          Welcome to Emganwini Main
        </Headline>

        <Motto>
          Connecting our community to Christ through teaching, preaching, and healing.
        </Motto>

        <ActionRow>
          <PrimaryButton to="/contact">
            Join Us This Sabbath
          </PrimaryButton>
          <SecondaryButton to="/sermons">
            Watch Sermons
          </SecondaryButton>
        </ActionRow>
      </MainContainer>

      <BottomStrip>
        <StripInner>
          <StripItem>
            <StripLabel>Sabbath School</StripLabel>
            <StripValue>Every Saturday · 09:00 AM</StripValue>
          </StripItem>

          <StripItem>
            <StripLabel>Divine Worship</StripLabel>
            <StripValue>Every Saturday · 11:30 AM</StripValue>
          </StripItem>

          <StripItem>
            <StripLabel>Church Location</StripLabel>
            <StripValue>Emganwini, Bulawayo</StripValue>
          </StripItem>
        </StripInner>
      </BottomStrip>
    </HeroSection>
  )
}


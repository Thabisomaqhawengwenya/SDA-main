import { Link } from 'react-router-dom'
import styled from 'styled-components'
import heroBg from '../images/emganwini-hero.jpeg'
import youthsImg from '../images/youths in lesson.jpeg'
import worshipImg from '../images/hero-worship-sunset.jpeg'
import ambassadorsImg from '../images/ambassadors-ministry.jpeg'

const HeroSection = styled.section`
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  box-sizing: border-box;
  padding-top: 104px;
  background-color: #0d141c;
`

const BgLayer = styled.div`
  position: absolute;
  inset: 0;
  background-image: url('${heroBg}');
  background-size: cover;
  background-position: center 32%;
  transform: scale(1.02);
  filter: brightness(0.72) saturate(1.08);
`

/* Warm natural ambient tone: feels like golden morning fellowship, not cold dark void */
const WarmVignette = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(12, 19, 28, 0.74) 0%,
    rgba(22, 26, 32, 0.44) 40%,
    rgba(14, 19, 26, 0.88) 85%,
    #0c131a 100%
  );
  pointer-events: none;
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: auto auto;
  padding: 44px 32px 32px;
  position: relative;
  z-index: 2;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 24px 20px;
  }
`

const CommunityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  padding: 6px 14px;
  border-radius: 9999px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 20px;

  span {
    color: #ffd166;
    font-size: 13px;
  }
`

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(36px, 5.2vw, 68px);
  font-weight: 500;
  color: #ffffff;
  line-height: 1.12;
  letter-spacing: -0.015em;
  margin: 0 0 16px;
  max-width: 820px;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.55);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 34px;
    line-height: 1.16;
  }
`

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(16px, 1.35vw, 19px);
  font-weight: 300;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 28px;
  max-width: 620px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
`

/* Real community stack: real people worshiping together */
const CommunityProof = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`

const AvatarStack = styled.div`
  display: flex;
  align-items: center;
`

const Avatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  object-fit: cover;
  margin-left: -10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:first-child {
    margin-left: 0;
  }
`

const ProofText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const ProofTitle = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13.5px;
  font-weight: 600;
  color: #ffffff;
`

const ProofSub = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.65);
`

const ButtonRow = styled.div`
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
  background: #ffffff;
  color: #111111;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 13px 28px;
  border-radius: 6px;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    background: #f0f0f0;
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
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  padding: 13px 24px;
  border-radius: 6px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.6);
  }

  &:active {
    transform: scale(0.97);
  }
`

/* ── Grounded Human Service Bar ── */
const ServiceBar = styled.div`
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(10, 16, 23, 0.88);
  backdrop-filter: blur(12px);
  width: 100%;
`

const ServiceBarInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 32px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 18px 20px;
  }
`

const ServiceBarItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

const ServiceBarLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
`

const ServiceBarValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
`

export default function Hero() {
  return (
    <HeroSection>
      <BgLayer />
      <WarmVignette />

      <ContentWrapper>
        <CommunityBadge>
          <span>✦</span> Emganwini, Bulawayo · Seventh-day Adventist Church
        </CommunityBadge>

        <Headline>
          There is a place for you here.
        </Headline>

        <Subtitle>
          Whether you are visiting for the first time, seeking God, or looking for a church family to call home, we warmly welcome you to worship with us this Sabbath.
        </Subtitle>

        {/* Real faces of our church community */}
        <CommunityProof>
          <AvatarStack>
            <Avatar src={youthsImg} alt="Youth Bible Lesson" />
            <Avatar src={worshipImg} alt="Worship in Emganwini" />
            <Avatar src={ambassadorsImg} alt="Church Ambassadors" />
          </AvatarStack>
          <ProofText>
            <ProofTitle>A thriving church family</ProofTitle>
            <ProofSub>Worshiping, growing, and serving together in Bulawayo</ProofSub>
          </ProofText>
        </CommunityProof>

        <ButtonRow>
          <PrimaryBtn to="/contact">
            Plan Your Visit
          </PrimaryBtn>
          <SecondaryBtn to="/about">
            Our Story &amp; Beliefs
          </SecondaryBtn>
        </ButtonRow>
      </ContentWrapper>

      <ServiceBar>
        <ServiceBarInner>
          <ServiceBarItem>
            <ServiceBarLabel>Sabbath School</ServiceBarLabel>
            <ServiceBarValue>Saturdays · 09:00 AM</ServiceBarValue>
          </ServiceBarItem>

          <ServiceBarItem>
            <ServiceBarLabel>Divine Worship</ServiceBarLabel>
            <ServiceBarValue>Saturdays · 11:30 AM</ServiceBarValue>
          </ServiceBarItem>

          <ServiceBarItem>
            <ServiceBarLabel>Where to Find Us</ServiceBarLabel>
            <ServiceBarValue>Stand 1542, Emganwini, Bulawayo</ServiceBarValue>
          </ServiceBarItem>
        </ServiceBarInner>
      </ServiceBar>
    </HeroSection>
  )
}


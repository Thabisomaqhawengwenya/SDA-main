import styled, { keyframes } from 'styled-components'
import HeroCanvas from './HeroCanvas'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(
    160deg,
    #f0f4ee 0%,
    #fafaf8 50%,
    #f5f3ed 100%
  );
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 70% 60% at 65% 50%,
    rgba(74, 103, 65, 0.06) 0%,
    transparent 70%
  );
  pointer-events: none;
`

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 680px;
  padding: 0 24px;
`

const Eyebrow = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
  margin-bottom: 20px;
  animation: ${fadeUp} 0.7s ease both;
  animation-delay: 0.1s;
`

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(40px, 6vw, 76px);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accentDark};
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
  animation: ${fadeUp} 0.7s ease both;
  animation-delay: 0.25s;

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.accent};
  }
`

const SubText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(15px, 1.8vw, 18px);
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.75;
  max-width: 500px;
  margin: 0 auto 40px;
  animation: ${fadeUp} 0.7s ease both;
  animation-delay: 0.4s;
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.7s ease both;
  animation-delay: 0.55s;
`

const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.accent};
  padding: 14px 32px;
  border-radius: ${({ theme }) => theme.radius.full};
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 20px rgba(74, 103, 65, 0.28);

  &:hover {
    background: ${({ theme }) => theme.colors.accentDark};
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(74, 103, 65, 0.36);
  }
`

const SecondaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  padding: 14px 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.accent};
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accentDark};
    border-color: ${({ theme }) => theme.colors.accentDark};
  }
`

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: ${fadeUp} 0.7s ease both;
  animation-delay: 0.9s;

  span {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.7;
  }
`

const scrollBounce = keyframes`
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(6px); opacity: 1; }
`

const ScrollArrow = styled.div`
  width: 20px;
  height: 20px;
  border-right: 1.5px solid ${({ theme }) => theme.colors.textMuted};
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.textMuted};
  transform: rotate(45deg);
  animation: ${scrollBounce} 1.6s ease-in-out infinite;
  opacity: 0.5;
`

export default function Hero() {
  return (
    <HeroSection>
      <HeroCanvas />
      <Overlay />

      <Content>
        <Eyebrow>Emganwini, Bulawayo</Eyebrow>
        <Headline>
          Welcome to <em>Emganwini Main</em>
          <br />SDA Church
        </Headline>
        <SubText>
          A Christian community transforming lives by connecting
          our neighbors to Christ — through teaching, preaching, and healing.
        </SubText>
        <ButtonGroup>
          <PrimaryBtn href="#join-us">Join Us This Saturday</PrimaryBtn>
          <SecondaryBtn href="#about-section">Learn more</SecondaryBtn>
        </ButtonGroup>
      </Content>

      <ScrollIndicator>
        <span>Scroll</span>
        <ScrollArrow />
      </ScrollIndicator>
    </HeroSection>
  )
}

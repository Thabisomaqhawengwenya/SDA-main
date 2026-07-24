import styled, { keyframes } from 'styled-components'
import heroBg from '../images/emganwini-hero.jpeg'

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
  background-image: url('${heroBg}');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.45) 50%,
    rgba(0, 0, 0, 0.60) 100%
  );
  pointer-events: none;
`

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 680px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
  animation: ${fadeUp} 0.7s ease both;
  animation-delay: 0.25s;

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.gold};
  }
`

const SubText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(15px, 1.8vw, 18px);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.75;
  max-width: 500px;
  margin: 0 auto 40px;
  animation: ${fadeUp} 0.7s ease both;
  animation-delay: 0.4s;
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
  background: #1DA1F2;
  padding: 14px 32px;
  border-radius: ${({ theme }) => theme.radius.full};
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 20px rgba(29, 161, 242, 0.35);
  animation: ${fadeUp} 0.7s ease both;
  animation-delay: 0.55s;

  &:hover {
    background: #1a8fd1;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(29, 161, 242, 0.45);
  }
`

export default function Hero() {
  return (
    <HeroSection>
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
        <PrimaryBtn href="/contact">Join Us This Saturday</PrimaryBtn>
      </Content>
    </HeroSection>
  )
}

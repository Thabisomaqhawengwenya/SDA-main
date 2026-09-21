import styled, { keyframes } from 'styled-components'
import heroBg from '../images/emganwini-hero.jpeg'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  height: 100dvh;
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
  background-image: url('${heroBg}');
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background-attachment: scroll;
    background-position: center center;
  }
`

const DarkScrim = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(10, 16, 26, 0.32);
  pointer-events: none;
`

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
    justify-content: flex-start;
  }
`

const Content = styled.div`
  max-width: 820px;
  width: 100%;
  text-align: left;
`

const Headline = styled.h1`
  font-family: 'Montserrat', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(32px, 5vw, 62px);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin: 0;
  text-align: left;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.75), 0 1px 3px rgba(0, 0, 0, 0.9);
  animation: ${fadeUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
`

export default function Hero() {
  return (
    <HeroSection>
      <DarkScrim />
      <Container>
        <Content>
          <Headline>
            Welcome to
            <br />
            Seventh-day Adventist
            <br />
            Emganwini Main
          </Headline>
        </Content>
      </Container>
    </HeroSection>
  )
}


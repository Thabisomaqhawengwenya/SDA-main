import styled, { keyframes } from 'styled-components'
import heroBg from '../images/emganwini-hero.jpeg'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
  background-image: url('${heroBg}');
  background-size: cover;
  background-position: center 38%;
  background-attachment: fixed;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background-attachment: scroll;
    background-position: 65% center;
  }
`

const DarkScrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    95deg,
    rgba(8, 12, 22, 0.90) 0%,
    rgba(8, 12, 22, 0.76) 42%,
    rgba(8, 12, 22, 0.45) 75%,
    rgba(8, 12, 22, 0.30) 100%
  );
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background: linear-gradient(
      180deg,
      rgba(8, 12, 22, 0.75) 0%,
      rgba(8, 12, 22, 0.85) 60%,
      rgba(8, 12, 22, 0.95) 100%
    );
  }
`

const Container = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 100px 48px 40px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 85px 24px 30px;
  }
`

const Content = styled.div`
  text-align: left;
  max-width: 780px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const BadgeTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 40px;
  padding: 6px 18px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 24px;
  animation: ${fadeUp} 0.65s ease both;
  animation-delay: 0.1s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);

  span.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #1DA1F2;
    display: inline-block;
  }
`

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(38px, 6.2vw, 74px);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.08;
  letter-spacing: -0.025em;
  margin: 0 0 32px;
  text-align: left;
  text-shadow: 0 4px 28px rgba(0, 0, 0, 0.75), 0 1px 3px rgba(0, 0, 0, 0.9);
  animation: ${fadeUp} 0.65s ease both;
  animation-delay: 0.2s;

  em {
    font-style: normal;
    color: #ffffff;
    font-weight: 700;
  }
`

const CtaGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  animation: ${fadeUp} 0.65s ease both;
  animation-delay: 0.45s;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    width: 100%;
  }
`

const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
  background: #1DA1F2;
  padding: 14px 34px;
  border-radius: 40px;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 6px 24px rgba(29, 161, 242, 0.45);

  svg {
    width: 15px;
    height: 15px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.2s ease;
  }

  &:hover {
    background: #1890d9;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(29, 161, 242, 0.6);
    svg {
      transform: translateX(3px);
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    justify-content: center;
    box-sizing: border-box;
  }
`

const SocialRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

const SocialDivider = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
`

const SocialBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 40px;
  padding: 8px 18px 8px 14px;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;

  svg {
    width: 15px;
    height: 15px;
    fill: currentColor;
    flex-shrink: 0;
  }

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 11px;
    padding: 7px 14px 7px 11px;
  }
`

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

export default function Hero() {
  return (
    <HeroSection>
      <DarkScrim />
      <Container>
        <Content>
          <BadgeTag>
            <span className="dot" />
            Emganwini, Bulawayo
          </BadgeTag>

          <Headline>
            Welcome to
            <br />
            Seventh-day Adventist
            <br />
            <em>Emganwini Main</em>
          </Headline>

          <CtaGroup>
            <PrimaryBtn href="/contact">
              Join Us This Saturday
              <svg viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </PrimaryBtn>

            <SocialRow>
              <SocialDivider>Follow Us</SocialDivider>
              <SocialBtn
                href="https://www.tiktok.com/@emganwinisda"
                target="_blank"
                rel="noreferrer"
                aria-label="Join us on TikTok"
              >
                <TikTokIcon />
                TikTok
              </SocialBtn>
              <SocialBtn
                href="https://www.youtube.com/@emganwinisda"
                target="_blank"
                rel="noreferrer"
                aria-label="Join us on YouTube"
              >
                <YouTubeIcon />
                YouTube
              </SocialBtn>
            </SocialRow>
          </CtaGroup>
        </Content>
      </Container>
    </HeroSection>
  )
}

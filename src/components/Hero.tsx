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

// ── CTA group ─────────────────────────────────────────────────────────────────

const CtaGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
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
  background: #1DA1F2;
  padding: 14px 32px;
  border-radius: ${({ theme }) => theme.radius.full};
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 20px rgba(29, 161, 242, 0.35);

  &:hover {
    background: #1a8fd1;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(29, 161, 242, 0.45);
  }
`

const SocialRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const SocialDivider = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
`

const SocialBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 9px 18px 9px 14px;
  text-decoration: none;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  white-space: nowrap;

  svg {
    width: 15px;
    height: 15px;
    fill: currentColor;
    flex-shrink: 0;
  }

  &:hover {
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 11px;
    padding: 8px 14px 8px 11px;
  }
`

// ── TikTok icon ───────────────────────────────────────────────────────────────

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  )
}

// ── YouTube icon ──────────────────────────────────────────────────────────────

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

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

        <CtaGroup>
          <PrimaryBtn href="/contact">Join Us This Saturday</PrimaryBtn>

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
    </HeroSection>
  )
}

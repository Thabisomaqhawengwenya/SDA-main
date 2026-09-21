import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import heroBg from '../images/emganwini-hero.jpeg'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(29, 161, 242, 0.7); }
  70%  { transform: scale(1);    box-shadow: 0 0 0 8px rgba(29, 161, 242, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(29, 161, 242, 0); }
`

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
    98deg,
    rgba(6, 11, 22, 0.94) 0%,
    rgba(6, 11, 22, 0.82) 42%,
    rgba(6, 11, 22, 0.50) 75%,
    rgba(6, 11, 22, 0.35) 100%
  );
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background: linear-gradient(
      180deg,
      rgba(6, 11, 22, 0.80) 0%,
      rgba(6, 11, 22, 0.88) 55%,
      rgba(6, 11, 22, 0.96) 100%
    );
  }
`

const AmbientGlow = styled.div`
  position: absolute;
  bottom: -120px;
  left: -80px;
  width: 460px;
  height: 460px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(29, 161, 242, 0.18) 0%, rgba(29, 161, 242, 0) 70%);
  filter: blur(40px);
  pointer-events: none;
`

const MainContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 120px 48px 0;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 95px 24px 0;
  }
`

const Content = styled.div`
  text-align: left;
  max-width: 840px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const TopBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 40px;
  padding: 6px 16px;
  margin-bottom: 20px;
  animation: ${fadeUp} 0.5s ease both;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  span.live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #1DA1F2;
    animation: ${pulse} 2s infinite;
  }

  span.badge-text {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #ffffff;
  }

  span.badge-divider {
    color: rgba(255, 255, 255, 0.3);
    font-size: 11px;
  }

  span.badge-sub {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 11px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.75);
    letter-spacing: 0.05em;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      display: none;
    }
  }
`

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(36px, 5.8vw, 70px);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin: 0 0 24px;
  text-align: left;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.8), 0 1px 4px rgba(0, 0, 0, 0.9);
  animation: ${fadeUp} 0.6s ease both;
  animation-delay: 0.15s;

  span.highlight {
    color: #ffffff;
    position: relative;
    display: inline-block;
  }
`

const QuickInfoRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 28px;
  animation: ${fadeUp} 0.6s ease both;
  animation-delay: 0.25s;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 8px;
    margin-bottom: 24px;
  }
`

const InfoChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 6px 14px;
  border-radius: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);

  svg {
    width: 14px;
    height: 14px;
    stroke: #1DA1F2;
    fill: none;
    stroke-width: 2;
    flex-shrink: 0;
  }

  strong {
    color: #ffffff;
    font-weight: 600;
  }
`

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  animation: ${fadeUp} 0.6s ease both;
  animation-delay: 0.35s;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 12px;
  }
`

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
  background: #1DA1F2;
  padding: 13px 28px;
  border-radius: 40px;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 6px 24px rgba(29, 161, 242, 0.45);

  svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.5;
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
`

const SecondaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.24);
  padding: 13px 24px;
  border-radius: 40px;
  text-decoration: none;
  transition: all 0.25s ease;

  svg {
    width: 15px;
    height: 15px;
    fill: currentColor;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`

const SocialGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 6px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-left: 0;
    justify-content: center;
    margin-top: 4px;
  }
`

const SocialBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 30px;
  padding: 7px 14px;
  text-decoration: none;
  transition: all 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
    flex-shrink: 0;
  }

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-1px);
  }
`

// ── Floating Bottom Bar ────────────────────────────────────────────────────────

const BottomBar = styled.div`
  width: 100%;
  position: relative;
  z-index: 2;
  background: rgba(10, 16, 28, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  padding: 14px 48px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 12px 20px;
  }
`

const BottomBarInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`

const BottomItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.fonts.sans};

  svg {
    width: 18px;
    height: 18px;
    stroke: #1DA1F2;
    fill: none;
    stroke-width: 1.8;
    flex-shrink: 0;
  }

  div {
    display: flex;
    flex-direction: column;
  }

  span.item-title {
    font-size: 12px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.02em;
  }

  span.item-desc {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    &:nth-child(2),
    &:nth-child(3) {
      display: none;
    }
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
      <AmbientGlow />

      <MainContainer>
        <Content>
          <TopBadge>
            <span className="live-dot" />
            <span className="badge-text">Emganwini, Bulawayo</span>
            <span className="badge-divider">•</span>
            <span className="badge-sub">Sabbath Worship: Every Saturday</span>
          </TopBadge>

          <Headline>
            Welcome to
            <br />
            Seventh-day Adventist
            <br />
            <span className="highlight">Emganwini Main</span>
          </Headline>

          <QuickInfoRow>
            <InfoChip>
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span><strong>Sabbath School:</strong> 08:30 AM</span>
            </InfoChip>

            <InfoChip>
              <svg viewBox="0 0 24 24">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span><strong>Divine Service:</strong> 11:00 AM</span>
            </InfoChip>

            <InfoChip>
              <svg viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Bulawayo, Zimbabwe</span>
            </InfoChip>
          </QuickInfoRow>

          <ActionRow>
            <PrimaryBtn to="/contact">
              Join Us This Saturday
              <svg viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </PrimaryBtn>

            <SecondaryBtn to="/sermons">
              <svg viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Watch Sermons
            </SecondaryBtn>

            <SocialGroup>
              <SocialBtn
                href="https://www.tiktok.com/@emganwinisda"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                <TikTokIcon />
                TikTok
              </SocialBtn>
              <SocialBtn
                href="https://www.youtube.com/@emganwinisda"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <YouTubeIcon />
                YouTube
              </SocialBtn>
            </SocialGroup>
          </ActionRow>
        </Content>
      </MainContainer>

      <BottomBar>
        <BottomBarInner>
          <BottomItem>
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <div>
              <span className="item-title">Christ-Centered Community</span>
              <span className="item-desc">Transforming lives through teaching, preaching &amp; healing</span>
            </div>
          </BottomItem>

          <BottomItem>
            <svg viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <div>
              <span className="item-title">7 Active Ministries</span>
              <span className="item-desc">Youth, Women, Men, Prayer, Health &amp; Community</span>
            </div>
          </BottomItem>

          <BottomItem>
            <svg viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <span className="item-title">Emganwini, Bulawayo</span>
              <span className="item-desc">All are welcome to fellowship with us</span>
            </div>
          </BottomItem>
        </BottomBarInner>
      </BottomBar>
    </HeroSection>
  )
}

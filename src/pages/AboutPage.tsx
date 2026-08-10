import styled, { keyframes } from 'styled-components'
import AboutCanvas from '../components/AboutCanvas'
import { Icon } from '@iconify/react'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`

const PageWrapper = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.navHeight};
`

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #ffffff;
`

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 80px 24px;
  animation: ${fadeUp} 0.7s ease both;
`

const Label = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
  margin-bottom: 16px;
`

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 500;
  color: #1DA1F2;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 20px;
`

const HeroSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 17px;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.72);
  line-height: 1.75;
  max-width: 480px;
  margin: 0 auto;
`

// ── Content sections ───────────────────────────────────────────────

const ContentSection = styled.section<{ $alt?: boolean }>`
  padding: 96px 48px;
  background: ${({ $alt, theme }) =>
    $alt ? theme.colors.surface : theme.colors.bg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 64px 24px;
  }
`

const Container = styled.div`
  max-width: 860px;
  margin: 0 auto;
`

const SectionLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
  margin-bottom: 16px;
`

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accentDark};
  letter-spacing: -0.02em;
  margin-bottom: 32px;
`

const Body = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.9;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`

const Divider = styled.div`
  width: 48px;
  height: 2px;
  background: ${({ theme }) => theme.colors.gold};
  border-radius: 2px;
  margin: 40px 0;
`

const BeliefsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  margin-top: 48px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const BeliefCard = styled.div`
  background: #111111;
  padding: 40px;
  transition: background 0.25s ease;

  &:hover {
    background: #1a1a1a;
  }
`

const BeliefIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: #222222;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
    color: #1DA1F2;
  }
`

const BeliefTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
`

const BeliefText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
`

const beliefs = [
  {
    icon: 'ph:cross-bold',
    title: 'The Trinity',
    text: 'Adventists believe a Trinity of three persons — the Father, the Son, and the Holy Spirit — make up one God.',
  },
  {
    icon: 'ph:hands-praying-bold',
    title: 'Salvation',
    text: 'Jesus came to earth, lived a sinless life, and was crucified for the sins of the world, winning victory for everyone through His resurrection.',
  },
  {
    icon: 'ph:bible-bold',
    title: 'Scripture',
    text: 'The Bible is the inspired word of God and the rule of faith and practice for Seventh-day Adventists.',
  },
  {
    icon: 'ph:cloud-sun-bold',
    title: 'Second Coming',
    text: 'Jesus promised to return to earth a second time to complete His plan of salvation and take His people to heaven.',
  },
  {
    icon: 'ph:moon-stars-bold',
    title: 'Sabbath',
    text: "Adventists observe the seventh-day Sabbath (Saturday) as a day of rest, worship, and celebration of God's creation.",
  },
  {
    icon: 'ph:heart-bold',
    title: 'Wholeness',
    text: 'God is concerned with the quality of human life — how we live, eat, speak, think, and treat one another.',
  },
]

export default function AboutPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <HeroSection>
        <AboutCanvas />
        <HeroContent>
          <Label>Who We Are</Label>
          <HeroTitle>About Us</HeroTitle>
          <HeroSub>
            Learn about the Seventh-day Adventist Church, our beliefs,
            and what draws us together as a community of faith.
          </HeroSub>
        </HeroContent>
      </HeroSection>

      {/* About SDA */}
      <ContentSection>
        <Container>
          <SectionLabel>Our Church</SectionLabel>
          <SectionTitle>About Seventh-day Adventists</SectionTitle>
          <Body>
            The Seventh-day Adventist Church is a mainstream Protestant church
            with approximately 19 million members worldwide, including more than
            one million members in North America. The Seventh-day Adventist
            Church seeks to enhance quality of life for people everywhere and
            to let people know that Jesus is coming again soon.
          </Body>
          <Body>
            Adventists believe that God is concerned with the quality of human
            life, and that everything — the way we live, eat, speak, think,
            treat each other, and care for the world around us — is part of
            His plan. Our families, our children, our jobs, our talents, our
            money, and our time are all important to Him.
          </Body>
          <Divider />
          <Body>
            When He returned to heaven following the resurrection, Jesus left
            the Holy Spirit to serve as our Comforter and Counselor. He
            promised to return to earth a second time to complete His plan of
            salvation and take His people to heaven. Adventists are among the
            believers who look forward to that day.
          </Body>
        </Container>
      </ContentSection>

      {/* Beliefs */}
      <ContentSection $alt>
        <Container>
          <SectionLabel>What We Believe</SectionLabel>
          <SectionTitle>Core Beliefs</SectionTitle>
          <Body>
            Our faith is grounded in Scripture and expressed through how we
            live together — in worship, service, and care for one another and
            the broader community.
          </Body>

          <BeliefsGrid>
            {beliefs.map((b) => (
              <BeliefCard key={b.title}>
                <BeliefIcon>
                  <Icon icon={b.icon} width={24} height={24} color="#1DA1F2" />
                </BeliefIcon>
                <BeliefTitle>{b.title}</BeliefTitle>
                <BeliefText>{b.text}</BeliefText>
              </BeliefCard>
            ))}
          </BeliefsGrid>
        </Container>
      </ContentSection>
    </PageWrapper>
  )
}

import styled from 'styled-components'
import { Link } from 'react-router-dom'

// ── Section ───────────────────────────────────────────────────────────────────

const Section = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  padding: 72px 48px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 56px 24px;
  }
`

const Container = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`

// ── Left column ───────────────────────────────────────────────────────────────

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Intro = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.85;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const PastorName = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`

const PastorChurch = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textMuted};
`

const ServiceBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ServiceHeading = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

const ServiceLine = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text};

  strong {
    font-weight: 600;
  }
`

const EmailLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`

// ── Right column ──────────────────────────────────────────────────────────────

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.15;
  letter-spacing: -0.01em;
`

const Body = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.85;

  a {
    color: #1da1f2;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

const LearnMoreBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
  background: #1da1f2;
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 14px 32px;
  text-decoration: none;
  width: fit-content;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #1a8fd1;
    transform: translateY(-1px);
  }
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function WorldwideChurch() {
  return (
    <Section>
      <Container>
        {/* Left */}
        <Left>
          <Intro>
            We are a Christian community and would love to have you join our
            family. To learn more about what we believe you can visit our About
            Us page. Please join us for Bible study, worship, and prayer.
          </Intro>

          <Divider />

          <div>
            <PastorName>Pastor Ngwenya</PastorName>
            <PastorChurch>Emganwini Main SDA Church</PastorChurch>
          </div>

          <Divider />

          <p style={{ fontFamily: 'inherit', fontSize: '14px', fontWeight: 400 }}>
            <Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>
              Join Us This Saturday
            </Link>
          </p>

          <ServiceBlock>
            <ServiceHeading>Service times:</ServiceHeading>
            <ServiceLine><strong>Sabbath School:</strong> 09:00 am</ServiceLine>
            <ServiceLine><strong>Worship Service:</strong> 11:30 am</ServiceLine>
          </ServiceBlock>

          <EmailLink href="mailto:Connect@Emganwinisda.org">
            Connect@Emganwinisda.org
          </EmailLink>
        </Left>

        {/* Right */}
        <Right>
          <Title>A Worldwide<br />Church Family</Title>
          <Body>
            The Seventh-day Adventist Church is a mainstream Protestant church
            with approximately{' '}
            <a href="https://www.adventist.org" target="_blank" rel="noreferrer">
              19 million members worldwide
            </a>
            , including more than one million members in North America. The
            Adventist Church operates{' '}
            <a href="https://www.adventist.org" target="_blank" rel="noreferrer">
              173 hospitals and sanitariums
            </a>{' '}
            and more than{' '}
            <a href="https://www.adventist.org" target="_blank" rel="noreferrer">
              7,500 schools around the world
            </a>
            . The Adventist Development and Relief Agency (ADRA) works within
            communities in more than 130 countries to provide community
            development and disaster relief.
          </Body>
          <LearnMoreBtn to="/about">Learn More</LearnMoreBtn>
        </Right>
      </Container>
    </Section>
  )
}

import styled from 'styled-components'

const Section = styled.section`
  padding: 112px 48px;
  background: ${({ theme }) => theme.colors.bg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 72px 24px;
  }
`

const Container = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 56px;
  }
`

const Left = styled.div``

const Label = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
  margin-bottom: 16px;
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(28px, 3.2vw, 42px);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accentDark};
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 28px;
`

const Body = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.85;
  margin-bottom: 20px;
`

const LearnMore = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.accent};
  padding-bottom: 2px;
  margin-top: 16px;
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accentDark};
    border-color: ${({ theme }) => theme.colors.accentDark};
  }
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const StatCard = styled.div`
  padding: 36px 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: flex-start;
  gap: 24px;
  background: ${({ theme }) => theme.colors.surface};
  margin-bottom: 12px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accentLight};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.offWhite};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
`

const StatBody = styled.div``

const StatNumber = styled.p`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accentDark};
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`

const StatLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`

const stats = [
  {
    icon: '🌍',
    number: '19 Million',
    label: 'Members worldwide, including 1M+ in North America',
  },
  {
    icon: '🏥',
    number: '173',
    label: 'Hospitals and sanitariums operated globally',
  },
  {
    icon: '🎓',
    number: '7,500+',
    label: 'Schools around the world',
  },
  {
    icon: '🤝',
    number: '130+',
    label: 'Countries served by ADRA for community development & disaster relief',
  },
]

export default function WorldwideChurch() {
  return (
    <Section id="about-section">
      <Container>
        <Grid>
          <Left>
            <Label>A Worldwide Family</Label>
            <Title>A Global Community of Faith</Title>
            <Body>
              The Seventh-day Adventist Church is a mainstream Protestant church
              with members across every continent. Adventists believe that God is
              concerned with the quality of human life — the way we live, eat,
              speak, think, treat each other, and care for the world around us.
            </Body>
            <Body>
              When Jesus returned to heaven following the resurrection, He left
              the Holy Spirit to serve as our Comforter and Counselor. He
              promised to return to earth a second time to complete His plan of
              salvation and take His people to heaven.
            </Body>
            <LearnMore href="/about">
              Read about our beliefs →
            </LearnMore>
          </Left>

          <Right>
            {stats.map((s) => (
              <StatCard key={s.number}>
                <StatIcon>{s.icon}</StatIcon>
                <StatBody>
                  <StatNumber>{s.number}</StatNumber>
                  <StatLabel>{s.label}</StatLabel>
                </StatBody>
              </StatCard>
            ))}
          </Right>
        </Grid>
      </Container>
    </Section>
  )
}

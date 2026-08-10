import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const Section = styled.section`
  padding: 112px 48px;
  background: ${({ theme }) => theme.colors.accentDark};
  position: relative;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 72px 24px;
  }
`

const BgShape = styled.div`
  position: absolute;
  top: -120px;
  right: -120px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  pointer-events: none;
`

const BgShape2 = styled.div`
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: rgba(184, 151, 58, 0.07);
  pointer-events: none;
`

const Container = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 1;

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
  font-size: clamp(30px, 3.5vw, 46px);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
`

const Body = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.8;
  margin-bottom: 40px;
`

const PastorTag = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`

const PastorAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.accentLight});
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.white};
  flex-shrink: 0;
`

const PastorInfo = styled.div`
  p:first-child {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.white};
    margin-bottom: 2px;
  }
  p:last-child {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
  }
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const ServiceCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 32px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.25s ease, border-color 0.25s ease;
  margin-bottom: 12px;

  &:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(184, 151, 58, 0.3);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 24px;
  }
`

const ServiceName = styled.div`
  p:first-child {
    font-family: ${({ theme }) => theme.fonts.serif};
    font-size: 20px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.white};
    margin-bottom: 4px;
  }
  p:last-child {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
  }
`

const ServiceTime = styled.div`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 24px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gold};
  text-align: right;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    text-align: left;
  }
`

const ConnectCard = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    120deg,
    ${({ theme }) => theme.colors.gold} 0%,
    #d4a843 50%,
    ${({ theme }) => theme.colors.gold} 100%
  );
  background-size: 200% auto;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 24px 36px;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: ${shimmer} 4s linear infinite;
  margin-top: 4px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(184, 151, 58, 0.4);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 24px;
  }
`

const ConnectText = styled.div`
  p:first-child {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(45, 64, 40, 0.7);
    margin-bottom: 4px;
  }
  p:last-child {
    font-family: ${({ theme }) => theme.fonts.serif};
    font-size: 19px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.accentDark};
  }
`

const Arrow = styled.span`
  font-size: 22px;
  color: ${({ theme }) => theme.colors.accentDark};
  opacity: 0.7;
`

const services = [
  { name: 'Sabbath School', day: 'Every Saturday', time: '09:00 am' },
  { name: 'Worship Service', day: 'Every Saturday', time: '11:30 am' },
]

export default function JoinUs() {
  return (
    <Section id="join-us">
      <BgShape />
      <BgShape2 />
      <Container>
        <Left>
          <Label>Come as you are</Label>
          <Title>Join Us This Saturday</Title>
          <Body>
            We are a Christian community and would love to have you join our
            family. Please join us for Bible study, worship, and prayer.
          </Body>
          <PastorTag>
            <PastorAvatar>N</PastorAvatar>
            <PastorInfo>
              <p>Pastor Ngwenya</p>
              <p>Emganwini Main SDA Church</p>
            </PastorInfo>
          </PastorTag>
        </Left>

        <Right>
          {services.map((s) => (
            <ServiceCard key={s.name}>
              <ServiceName>
                <p>{s.name}</p>
                <p>{s.day}</p>
              </ServiceName>
              <ServiceTime>{s.time}</ServiceTime>
            </ServiceCard>
          ))}

          <ConnectCard href="mailto:Connect@Emganwinisda.org">
            <ConnectText>
              <p>Get in touch</p>
              <p>Connect@Emganwinisda.org</p>
            </ConnectText>
            <Arrow>→</Arrow>
          </ConnectCard>
        </Right>
      </Container>
    </Section>
  )
}

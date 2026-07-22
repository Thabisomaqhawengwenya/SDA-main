import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Section = styled.section`
  padding: 112px 48px;
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 72px 24px;
  }
`

const Container = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
`

const SectionLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
  text-align: center;
  margin-bottom: 16px;
`

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accentDark};
  text-align: center;
  margin-bottom: 72px;
  letter-spacing: -0.02em;
`

const MissionBlock = styled.div`
  max-width: 760px;
  margin: 0 auto 96px;
  text-align: center;
  animation: ${fadeUp} 0.7s ease both;
`

const MissionText = styled.p`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(20px, 2.4vw, 27px);
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.65;
  letter-spacing: -0.01em;

  strong {
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 600;
  }
`

const Divider = styled.div`
  width: 48px;
  height: 2px;
  background: ${({ theme }) => theme.colors.gold};
  margin: 40px auto;
  border-radius: 2px;
`

const QuotesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  background: ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const QuoteCard = styled.blockquote`
  background: ${({ theme }) => theme.colors.bg};
  padding: 56px 48px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: background 0.25s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.offWhite};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 40px 24px;
  }
`

const QuoteMark = styled.span`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 80px;
  line-height: 0.6;
  color: ${({ theme }) => theme.colors.accent};
  opacity: 0.2;
  display: block;
  height: 32px;
`

const QuoteTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accentDark};
  letter-spacing: -0.01em;
`

const QuoteText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.8;
  flex: 1;
`

const QuoteAttrib = styled.cite`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
  font-style: normal;
`

const quotes = [
  {
    title: 'True Progress',
    text: 'We all want progress, but if you\'re on the wrong road, progress means doing an about-turn and walking back to the right road; in that case, the man who turns back soonest is the most progressive.',
    author: '— C. S. Lewis',
  },
  {
    title: 'Courage',
    text: 'Courage is what it takes to stand up and speak; courage is also what it takes to sit down and listen.',
    author: '— Winston Churchill',
  },
]

export default function Mission() {
  return (
    <Section>
      <Container>
        <SectionLabel>Our Mission</SectionLabel>
        <SectionTitle>Jesus Saves</SectionTitle>

        <MissionBlock>
          <MissionText>
            Through <strong>teaching</strong>, <strong>preaching</strong>, and{' '}
            <strong>healing</strong>, we as the Emganwini Main SDA Church
            transform lives by connecting our community to Christ.
          </MissionText>
          <Divider />
        </MissionBlock>

        <QuotesGrid>
          {quotes.map((q) => (
            <QuoteCard key={q.title}>
              <QuoteMark aria-hidden="true">"</QuoteMark>
              <QuoteTitle>{q.title}</QuoteTitle>
              <QuoteText>{q.text}</QuoteText>
              <QuoteAttrib>{q.author}</QuoteAttrib>
            </QuoteCard>
          ))}
        </QuotesGrid>
      </Container>
    </Section>
  )
}

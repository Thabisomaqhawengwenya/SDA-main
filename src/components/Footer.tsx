import styled from 'styled-components'
import { Link } from 'react-router-dom'

const FooterEl = styled.footer`
  background: ${({ theme }) => theme.colors.text};
  padding: 64px 48px 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 48px 24px 32px;
  }
`

const Container = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
`

const Top = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 64px;
  padding-bottom: 48px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`

const Brand = styled.div``

const BrandName = styled.p`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 4px;
`

const BrandSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
  margin-bottom: 20px;
`

const BrandDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.8;
  max-width: 300px;
`

const Col = styled.div``

const ColTitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 20px;
`

const ColLinks = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ColLink = styled.li`
  a {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 14px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`

const Bottom = styled.div`
  padding-top: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`

const Copyright = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.3);
`

const BottomLinks = styled.div`
  display: flex;
  gap: 24px;

  a {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 13px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.3);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: rgba(255, 255, 255, 0.7);
    }
  }
`

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <FooterEl>
      <Container>
        <Top>
          <Brand>
            <BrandName>Emganwini Main</BrandName>
            <BrandSub>Seventh-day Adventist Church</BrandSub>
            <BrandDesc>
              A Christian community in Emganwini, Bulawayo — transforming lives
              by connecting our community to Christ through teaching, preaching,
              and healing.
            </BrandDesc>
          </Brand>

          <Col>
            <ColTitle>Navigate</ColTitle>
            <ColLinks>
              <ColLink><Link to="/">Home</Link></ColLink>
              <ColLink><Link to="/about">About Us</Link></ColLink>
              <ColLink><a href="#join-us">Service Times</a></ColLink>
              <ColLink><a href="#about-section">Our Beliefs</a></ColLink>
            </ColLinks>
          </Col>

          <Col>
            <ColTitle>Connect</ColTitle>
            <ColLinks>
              <ColLink>
                <a href="mailto:Connect@Emganwinisda.org">
                  Connect@Emganwinisda.org
                </a>
              </ColLink>
              <ColLink>
                <a
                  href="https://www.adventist.org"
                  target="_blank"
                  rel="noreferrer"
                >
                  Adventist.org
                </a>
              </ColLink>
              <ColLink>
                <a
                  href="https://adra.org"
                  target="_blank"
                  rel="noreferrer"
                >
                  ADRA
                </a>
              </ColLink>
            </ColLinks>
          </Col>
        </Top>

        <Bottom>
          <Copyright>
            © {year} Emganwini Main SDA Church. All rights reserved.
          </Copyright>
          <BottomLinks>
            <Link to="/about">About</Link>
            <a href="mailto:Connect@Emganwinisda.org">Contact</a>
            <Link to="/admin" style={{ opacity: 0.35, fontSize: '11px' }}>Admin</Link>
          </BottomLinks>
        </Bottom>
      </Container>
    </FooterEl>
  )
}

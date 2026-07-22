import styled, { keyframes } from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

// ── Animations ────────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

// ── Shared Styled Components ──────────────────────────────────────────────────

export const PageWrapper = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.navHeight};
`

export const HeroBanner = styled.section`
  position: relative;
  height: 420px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 300px;
  }
`

export const HeroImage = styled.div<{ $url: string }>`
  position: absolute;
  inset: 0;
  background-image: url('${({ $url }) => $url}');
  background-size: cover;
  background-position: center;
  filter: brightness(0.6);
`

export const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.08) 0%,
    rgba(0,0,0,0.52) 65%,
    rgba(0,0,0,0.72) 100%
  );
`

export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 0 48px 44px;
  animation: ${fadeUp} 0.65s ease both;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px 32px;
  }
`

export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255,255,255,0.72);
  margin-bottom: 14px;
  flex-wrap: wrap;

  a {
    color: rgba(255,255,255,0.72);
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover { color: #fff; }
  }

  svg {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: rgba(255,255,255,0.45);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex-shrink: 0;
  }

  span { color: rgba(255,255,255,0.45); }
`

export const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 500;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
`

export const BodySection = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  padding: 56px 48px 88px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 40px 24px 64px;
  }
`

export const BodyGrid = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 80px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`

export const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
`

export const Scripture = styled.blockquote`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.85;

  cite {
    display: block;
    font-style: normal;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: 6px;
    font-size: 14px;
  }
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0;
`

export const ProgramList = styled.div`
  display: flex;
  flex-direction: column;
`

export const ProgramItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 15px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:first-child { padding-top: 0; }
  &:last-child  { border-bottom: none; }
`

export const ProgramDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
  margin-top: 8px;
`

export const ProgramText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.65;
  margin: 0;
`

export const Sidebar = styled.aside``

export const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

export const SidebarLink = styled(Link)<{ $active: boolean }>`
  display: block;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.text)};
  text-decoration: none;
  padding: 11px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: color 0.18s ease;

  &:hover { color: ${({ theme }) => theme.colors.accent}; }
  &:last-child { border-bottom: none; }
`

// ── Shared data ───────────────────────────────────────────────────────────────

export const MINISTRY_LINKS = [
  { label: 'Health Ministry',     path: '/ministries/health' },
  { label: 'Prayer Ministry',     path: '/ministries/prayer' },
  { label: 'Youth Ministry',      path: '/ministries/youth' },
  { label: "Women's Ministry",    path: '/ministries/women' },
  { label: "Men's Ministry",      path: '/ministries/men' },
  { label: 'Children',            path: '/ministries/children' },
  { label: 'Community Outreach',  path: '/ministries/community' },
]

// ── Shared chevron + home icons ───────────────────────────────────────────────

export function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
  )
}

export function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

// ── MinistryPage compound component ──────────────────────────────────────────

interface Props {
  title: string
  imageUrl: string
  scripture: string
  scriptureRef: string
  programs: string[]
}

export default function MinistryLayout({ title, imageUrl, scripture, scriptureRef, programs }: Props) {
  const location = useLocation()

  return (
    <PageWrapper>
      {/* Hero */}
      <HeroBanner>
        <HeroImage $url={imageUrl} />
        <HeroOverlay />
        <HeroContent>
          <Breadcrumb>
            <Link to="/"><HomeIcon /></Link>
            <ChevronRight />
            <Link to="/ministries/youth">Ministries</Link>
            <ChevronRight />
            <span>{title}</span>
          </Breadcrumb>
          <HeroTitle>{title}</HeroTitle>
        </HeroContent>
      </HeroBanner>

      {/* Body */}
      <BodySection>
        <BodyGrid>
          <LeftCol>
            <Scripture>
              {scripture}
              <cite>{scriptureRef}</cite>
            </Scripture>

            <Divider />

            <ProgramList>
              {programs.map((p) => (
                <ProgramItem key={p}>
                  <ProgramDot />
                  <ProgramText>{p}</ProgramText>
                </ProgramItem>
              ))}
            </ProgramList>
          </LeftCol>

          <Sidebar>
            <SidebarList>
              {MINISTRY_LINKS.map((m) => (
                <li key={m.path}>
                  <SidebarLink to={m.path} $active={location.pathname === m.path}>
                    {m.label}
                  </SidebarLink>
                </li>
              ))}
            </SidebarList>
          </Sidebar>
        </BodyGrid>
      </BodySection>
    </PageWrapper>
  )
}

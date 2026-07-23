import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import sdaLogo from '../images/sdalogo-white.png'

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 20px;
  }
`

// ── Logo (left) ───────────────────────────────────────────────────────────────

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  padding: 14px 0;
  flex-shrink: 0;
`

const LogoImg = styled.img`
  width: 44px;
  height: 44px;
  object-fit: contain;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 36px;
    height: 36px;
  }
`

const LogoTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`

const LogoLine1 = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.01em;
  line-height: 1.2;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
  }
`

const LogoLine2 = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.2;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 10px;
  }
`

// ── Right column (top util row + bottom nav row) ──────────────────────────────

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`

// Top util row: Giving + social icons
const UtilRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 8px 0 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const GivingBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #ffffff;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  border-radius: 999px;
  padding: 4px 14px 4px 10px;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: #ffffff;
  }

  svg {
    width: 13px;
    height: 13px;
    fill: #e05555;
    flex-shrink: 0;
  }
`

const SocialBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`

// Bottom nav row: page links + search
const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: 6px 0 8px;
`

const NavItem = styled(Link)<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: ${({ $active }) => ($active ? '#ffffff' : 'rgba(255,255,255,0.82)')};
  text-decoration: none;
  padding: 4px 12px;
  border-radius: 4px;
  white-space: nowrap;
  transition: color 0.2s ease, background 0.2s ease;
  position: relative;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }

  ${({ $active }) =>
    $active &&
    css`
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 12px;
        right: 12px;
        height: 2px;
        background: #ffffff;
        border-radius: 2px;
      }
    `}
`

const DropdownWrapper = styled.div`
  position: relative;

  &:hover > div {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
`

const DropdownTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.82);
  background: none;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s ease, background 0.2s ease;

  svg {
    width: 11px;
    height: 11px;
    fill: currentColor;
    margin-top: 1px;
  }

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: rgba(18, 40, 65, 0.97);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 6px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`

const DropdownItem = styled(Link)`
  display: block;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  padding: 9px 14px;
  border-radius: 5px;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
`

const SearchBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
  margin-left: 4px;

  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
  }

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`

// ── Mobile hamburger ──────────────────────────────────────────────────────────

const MobileRight = styled.div`
  display: none;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`

const Hamburger = styled.button<{ $open: boolean }>`
  background: none;
  border: none;
  width: 34px;
  height: 34px;
  position: relative;
  z-index: 101;
  cursor: pointer;
  padding: 0;

  span {
    display: block;
    width: 22px;
    height: 1.5px;
    background: #ffffff;
    position: absolute;
    left: 6px;
    transition: all 0.25s ease;

    &:nth-child(1) {
      top: ${({ $open }) => ($open ? '50%' : '11px')};
      transform: ${({ $open }) => ($open ? 'translateY(-50%) rotate(45deg)' : 'none')};
    }
    &:nth-child(2) {
      top: 50%;
      transform: translateY(-50%);
      opacity: ${({ $open }) => ($open ? 0 : 1)};
    }
    &:nth-child(3) {
      bottom: ${({ $open }) => ($open ? 'auto' : '11px')};
      top: ${({ $open }) => ($open ? '50%' : 'auto')};
      transform: ${({ $open }) => ($open ? 'translateY(-50%) rotate(-45deg)' : 'none')};
    }
  }
`

const MobileMenu = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
    background: rgba(18, 40, 65, 0.98);
    backdrop-filter: blur(20px);
    padding: ${({ $open }) => ($open ? '16px 20px 24px' : '0 20px')};
    max-height: ${({ $open }) => ($open ? '400px' : '0')};
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      padding 0.35s ease;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
`

const MobileNavItem = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 12px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  transition: color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: #ffffff;
  }
`

const MobileGiving = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  padding: 8px 18px;
  text-decoration: none;
  margin-top: 16px;
  width: fit-content;

  svg {
    width: 13px;
    height: 13px;
    fill: #e05555;
  }
`



// ── Component ─────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const isActive = (path: string) => location.pathname === path

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
      {/* Styled wrapper — background handled inline so we can keep typed Nav */}
      <NavBg $scrolled={scrolled || menuOpen}>
        <Inner>
          {/* ── Logo ── */}
          <LogoLink to="/">
            <LogoImg src={sdaLogo} alt="SDA Church logo" />
            <LogoTextWrap>
              <LogoLine1>Emganwini Main</LogoLine1>
              <LogoLine2>SDA Church</LogoLine2>
            </LogoTextWrap>
          </LogoLink>

          {/* ── Desktop right column ── */}
          <RightCol>
            {/* Top row: Giving + socials */}
            <UtilRow>
              <GivingBtn href="#giving">
                <svg viewBox="0 0 16 16">
                  <path d="M8 14s-6-3.5-6-7.5A4.5 4.5 0 0 1 8 3.07 4.5 4.5 0 0 1 14 6.5C14 10.5 8 14 8 14z" />
                </svg>
                Giving
              </GivingBtn>

              <SocialBtn
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </SocialBtn>

              <SocialBtn
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </SocialBtn>
            </UtilRow>

            {/* Bottom row: nav links + search */}
            <NavRow>
              <NavItem to="/about" $active={isActive('/about')}>
                About Us
              </NavItem>

              <NavItem to="/calendar" $active={isActive('/calendar')}>
                Calendar
              </NavItem>

              <DropdownWrapper>
                <DropdownTrigger>
                  Ministries
                  <svg viewBox="0 0 12 12">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </DropdownTrigger>
                <Dropdown>
                  <DropdownItem to="/ministries/youth">Youth</DropdownItem>
                  <DropdownItem to="/ministries/women">Women's Ministry</DropdownItem>
                  <DropdownItem to="/ministries/men">Men's Ministry</DropdownItem>
                  <DropdownItem to="/ministries/children">Children</DropdownItem>
                  <DropdownItem to="/ministries/community">Community Outreach</DropdownItem>
                </Dropdown>
              </DropdownWrapper>

              <NavItem to="/contact" $active={isActive('/contact')}>
                Contact Us
              </NavItem>

              <SearchBtn aria-label="Search">
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg>
              </SearchBtn>
            </NavRow>
          </RightCol>

          {/* ── Mobile right — hamburger only ── */}
          <MobileRight>
            <Hamburger
              $open={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </Hamburger>
          </MobileRight>
        </Inner>

        {/* ── Mobile menu ── */}
        <MobileMenu $open={menuOpen}>
          <MobileNavItem to="/" onClick={() => setMenuOpen(false)}>Home</MobileNavItem>
          <MobileNavItem to="/about" onClick={() => setMenuOpen(false)}>About Us</MobileNavItem>
          <MobileNavItem to="/calendar" onClick={() => setMenuOpen(false)}>Calendar</MobileNavItem>
          <MobileNavItem to="/ministries/youth" onClick={() => setMenuOpen(false)}>Ministries</MobileNavItem>
          <MobileNavItem to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</MobileNavItem>
          <MobileGiving href="#giving" onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 16 16" style={{ width: 13, height: 13, fill: '#e05555' }}>
              <path d="M8 14s-6-3.5-6-7.5A4.5 4.5 0 0 1 8 3.07 4.5 4.5 0 0 1 14 6.5C14 10.5 8 14 8 14z" />
            </svg>
            Giving
          </MobileGiving>
        </MobileMenu>
      </NavBg>
    </nav>
  )
}

// Separate styled nav background so the ref can stay typed as HTMLElement
const NavBg = styled.div<{ $scrolled: boolean }>`
  transition: background 0.35s ease, box-shadow 0.35s ease;

  ${({ $scrolled }) =>
    $scrolled
      ? css`
          background: rgba(18, 40, 65, 0.97);
          backdrop-filter: blur(14px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.28);
        `
      : css`
          background: rgba(18, 40, 65, 0.52);
          backdrop-filter: blur(6px);
        `}
`

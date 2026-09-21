import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { subscribeChurchSettings, defaultChurchSettings } from '../services/settingsService'
import type { ChurchSettings } from '../services/settingsService'

const Section = styled.section`
  padding: 32px 32px 32px;
  background: ${({ theme }) => theme.colors.bg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 24px 20px 24px;
  }
`

const Card = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background: #111111;
  border-radius: 16px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 56px 1fr auto;
  min-height: 200px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    border-radius: 12px;
  }
`

// ── Vertical "Find Us" tab ────────────────────────────────────────────────────

const FindUsTab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  padding: 24px 0;

  span {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    user-select: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    writing-mode: horizontal-tb;
    transform: none;
    padding: 20px 24px 12px;
    justify-content: flex-start;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);

    span {
      writing-mode: horizontal-tb;
      transform: none;
    }
  }
`

// ── Centre info area ──────────────────────────────────────────────────────────

const InfoArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const InfoBlock = styled.div`
  padding: 36px 40px;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:last-child {
    border-right: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 24px 28px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  }
`

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;

  svg {
    width: 17px;
    height: 17px;
    stroke: rgba(255, 255, 255, 0.5);
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex-shrink: 0;
  }
`

const BlockTitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`

const BlockText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.65;
`

const DirectionsLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  margin-top: 8px;
  transition: color 0.2s ease;

  svg {
    width: 13px;
    height: 13px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    color: #ffffff;
  }
`

const EmailLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`

// ── Map on the right ──────────────────────────────────────────────────────────

const MapWrapper = styled.div`
  width: 320px;
  min-height: 200px;
  position: relative;
  flex-shrink: 0;

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function FindUs() {
  const [settings, setSettings] = useState<ChurchSettings>(defaultChurchSettings)

  useEffect(() => {
    const unsub = subscribeChurchSettings((data) => {
      setSettings(data)
    })
    return () => unsub?.()
  }, [])

  return (
    <Section>
      <Card>
        {/* Vertical label */}
        <FindUsTab>
          <span>Find Us</span>
        </FindUsTab>

        {/* Info columns */}
        <InfoArea>
          {/* Address */}
          <InfoBlock>
            <BlockHeader>
              <svg viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <BlockTitle>We're in Emganwini, Bulawayo</BlockTitle>
            </BlockHeader>
            <BlockText>
              {settings.address || 'Emganwini, Bulawayo, Zimbabwe'}
            </BlockText>
            <DirectionsLink
              href="https://maps.app.goo.gl/ZtEBkLJjLnEhuKHs5"
              target="_blank"
              rel="noreferrer"
            >
              Get Directions
              <svg viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </DirectionsLink>
          </InfoBlock>

          {/* Phone */}
          <InfoBlock>
            <BlockHeader>
              <svg viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l1.85-1.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <BlockTitle>Call Us</BlockTitle>
            </BlockHeader>
            <BlockText>{settings.phone || '+263 77 123 4567'}</BlockText>
          </InfoBlock>

          {/* Email */}
          <InfoBlock>
            <BlockHeader>
              <svg viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <BlockTitle>Email Us</BlockTitle>
            </BlockHeader>
            <EmailLink href={`mailto:${settings.email || 'Connect@Emganwinisda.org'}`}>
              {settings.email || 'Connect@Emganwinisda.org'}
            </EmailLink>
          </InfoBlock>
        </InfoArea>

        {/* Map */}
        <MapWrapper>
          <iframe
            title="Emganwini SDA Church location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3797.2!2d28.5234!3d-20.1847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1938316b5a5a5a5b%3A0x0!2sEmganwini%2C+Bulawayo%2C+Zimbabwe!5e0!3m2!1sen!2szw!4v1700000000000!5m2!1sen!2szw"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </MapWrapper>
      </Card>
    </Section>
  )
}

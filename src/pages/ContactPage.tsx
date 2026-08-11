import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import JoinUs from '../components/JoinUs'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

const PageWrapper = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.navHeight};
`

// ── Hero ──────────────────────────────────────────────────────────────────────

const HeroBanner = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(17, 38, 64, 0.88) 0%, rgba(30, 58, 45, 0.82) 100%),
              url('https://images.unsplash.com/photo-1438232992991-995b671e4668?w=1600&q=80') center / cover;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.25) 100%);
  }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  animation: ${fadeUp} 0.65s ease both;
`

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 16px;

  span { opacity: 0.45; }
`

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(38px, 5vw, 64px);
  font-weight: 500;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0;
`

// ── Contact info strip ────────────────────────────────────────────────────────

const InfoStrip = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 64px 48px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 48px 24px;
  }
`

const InfoGrid = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`

const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.offWhite};
  }
`

const InfoIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.offWhite};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    stroke: ${({ theme }) => theme.colors.accent};
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`

const InfoLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`

const InfoValue = styled.p`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accentDark};
  line-height: 1.4;
`

const InfoSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
`

// ── Contact Form Styled Components ───────────────────────────────────────────
const FormSection = styled.section`
  padding: 64px 48px 96px;
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 48px 24px 72px;
  }
`

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 48px;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 28px 24px;
  }
`

const FormTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 26px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accentDark};
  margin: 0 0 8px;
  text-align: center;
`

const FormSubtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 32px;
  text-align: center;
  line-height: 1.5;
`

const FormFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
`

const FormLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`

const FormInput = styled.input`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 12px 16px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

const FormTextArea = styled.textarea`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 12px 16px;
  outline: none;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

const SubmitButton = styled.button`
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 14px 28px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.accentLight};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const ErrorMessage = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: #d32f2f;
  margin: 2px 0 0;
`

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 32px 0;
`

const SuccessCheck = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #e8f5e9;
  color: #2e7d32;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  svg {
    width: 28px;
    height: 28px;
  }
`

const SuccessHeading = styled.h3`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 22px;
  color: ${({ theme }) => theme.colors.accentDark};
  margin: 0 0 10px;
`

const SuccessText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  margin: 0;
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
    } else {
      setIsSubmitted(true)
    }
  }

  return (
    <PageWrapper>
      {/* Hero */}
      <HeroBanner>
        <HeroContent>
          <Breadcrumb>
            <span>Home</span>
            <span>/</span>
            <span style={{ opacity: 1, color: 'rgba(255,255,255,0.85)' }}>Contact Us</span>
          </Breadcrumb>
          <HeroTitle>Contact Us</HeroTitle>
        </HeroContent>
      </HeroBanner>

      {/* Contact info cards */}
      <InfoStrip>
        <InfoGrid>
          <InfoCard>
            <InfoIcon>
              <svg viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </InfoIcon>
            <InfoLabel>Location</InfoLabel>
            <InfoValue>Emganwini, Bulawayo</InfoValue>
            <InfoSub>Zimbabwe</InfoSub>
          </InfoCard>

          <InfoCard>
            <InfoIcon>
              <svg viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </InfoIcon>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>
              <a href="mailto:Connect@Emganwinisda.org" style={{ color: 'inherit', textDecoration: 'none' }}>
                Connect@Emganwinisda.org
              </a>
            </InfoValue>
            <InfoSub>We'll respond as soon as possible</InfoSub>
          </InfoCard>

          <InfoCard>
            <InfoIcon>
              <svg viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </InfoIcon>
            <InfoLabel>Service Times</InfoLabel>
            <InfoValue>Every Saturday</InfoValue>
            <InfoSub>Sabbath School 09:00 am · Worship 11:30 am</InfoSub>
          </InfoCard>
        </InfoGrid>
      </InfoStrip>

      {/* Contact Form Section */}
      <FormSection>
        <FormContainer>
          {isSubmitted ? (
            <SuccessContainer>
              <SuccessCheck>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </SuccessCheck>
              <SuccessHeading>Message Sent!</SuccessHeading>
              <SuccessText>
                Thank you for reaching out to us. We have received your message and will respond as soon as possible.
              </SuccessText>
            </SuccessContainer>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <FormTitle>Send a Message</FormTitle>
              <FormSubtitle>
                Have a question or want to get in touch? Fill out the form below and our team will get back to you.
              </FormSubtitle>
              
              <FormFieldGroup>
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormInput
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </FormFieldGroup>

              <FormFieldGroup>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </FormFieldGroup>

              <FormFieldGroup>
                <FormLabel htmlFor="subject">Subject</FormLabel>
                <FormInput
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && <ErrorMessage>{errors.subject}</ErrorMessage>}
              </FormFieldGroup>

              <FormFieldGroup>
                <FormLabel htmlFor="message">Message</FormLabel>
                <FormTextArea
                  id="message"
                  name="message"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
              </FormFieldGroup>

              <SubmitButton type="submit">Submit Message</SubmitButton>
            </form>
          )}
        </FormContainer>
      </FormSection>

      {/* Join Us section (moved from home) */}
      <JoinUs />
    </PageWrapper>
  )
}

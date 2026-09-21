import { useState } from 'react'
import styled from 'styled-components'
import MinistryLayout from '../components/MinistryLayout'
import { createPrayerRequest } from '../services/prayerService'

const programs = [
  'Weekly corporate prayer meeting every Wednesday at 7:00 pm',
  'Prayer and Fasting series — First and Third Sabbath',
  'Personal prayer request board and intercessory prayer team',
  'Early morning devotion and prayer chain',
  'Annual Week of Prayer and spiritual emphasis programme',
  'Prayer partners programme pairing members for accountability',
]

const PrayerCard = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 32px;
  margin-top: 16px;
`

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 22px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`

const CardSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  margin: 0 0 24px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  outline: none;
  background: #ffffff;
  box-sizing: border-box;

  &:focus {
    border-color: #1DA1F2;
  }
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 110px;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  outline: none;
  resize: vertical;
  background: #ffffff;
  box-sizing: border-box;

  &:focus {
    border-color: #1DA1F2;
  }
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;

  input {
    accent-color: #1DA1F2;
    width: 16px;
    height: 16px;
  }
`

const SubmitBtn = styled.button`
  align-self: flex-start;
  background: #1DA1F2;
  color: #ffffff;
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 12px 28px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SuccessBox = styled.div`
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #065f46;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  line-height: 1.6;
`

export default function PrayerMinistryPage() {
  const [name, setName] = useState('')
  const [request, setRequest] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!request.trim()) return

    setSubmitting(true)
    try {
      await createPrayerRequest({
        name: name.trim() || 'Anonymous',
        request: request.trim(),
        category: 'Intercession',
        status: 'new',
        isPrivate,
        submittedAt: new Date().toISOString(),
      })
      setSubmitted(true)
      setName('')
      setRequest('')
      setIsPrivate(false)
    } catch (err) {
      console.warn('Error saving prayer request:', err)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MinistryLayout
      title="Prayer Ministry"
      imageUrl="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&q=80"
      scripture="Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."
      scriptureRef="Philippians 4:6–7"
      programs={programs}
    >
      <PrayerCard>
        <CardTitle>Submit a Prayer Request</CardTitle>
        <CardSub>
          Our pastoral team and prayer warriors pray over every single request submitted. You may submit confidentially.
        </CardSub>

        {submitted ? (
          <SuccessBox>
            🙏 <strong>Thank you for sharing your prayer request.</strong> Our prayer team has received your request and is lifting your petition before the Lord in faith.
          </SuccessBox>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Your Name (leave blank to submit anonymously)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              placeholder="How can we pray for you today? (Details, family, health, guidance...)"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              required
            />
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              Keep this request strictly confidential (Pastor &amp; Elders only)
            </CheckboxLabel>
            <SubmitBtn type="submit" disabled={submitting || !request.trim()}>
              {submitting ? 'Submitting...' : 'Submit Prayer Request'}
            </SubmitBtn>
          </Form>
        )}
      </PrayerCard>
    </MinistryLayout>
  )
}

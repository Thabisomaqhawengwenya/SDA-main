import MinistryLayout from '../components/MinistryLayout'

const programs = [
  'Weekly corporate prayer meeting every Wednesday at 7:00 pm',
  'Prayer and Fasting series — First and Third Sabbath',
  'Personal prayer request board and intercessory prayer team',
  'Early morning devotion and prayer chain',
  'Annual Week of Prayer and spiritual emphasis programme',
  'Prayer partners programme pairing members for accountability',
]

export default function PrayerMinistryPage() {
  return (
    <MinistryLayout
      title="Prayer Ministry"
      imageUrl="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&q=80"
      scripture="Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."
      scriptureRef="Philippians 4:6–7"
      programs={programs}
    />
  )
}

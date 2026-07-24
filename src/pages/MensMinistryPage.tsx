import MinistryLayout from '../components/MinistryLayout'

const programs = [
  "Men's Bible study every first Sabbath after the worship service",
  'Annual Men\'s Retreat and leadership development weekend',
  'Father–son discipleship and mentorship programme',
  'Community service projects — home repairs for the elderly',
  'Monthly men\'s fellowship breakfast and devotional',
  'Financial stewardship and family leadership seminars',
  'Accountability groups for spiritual growth',
]

export default function MensMinistryPage() {
  return (
    <MinistryLayout
      title="AMO – Adventist Men's Organisation"
      imageUrl="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&q=80"
      scripture="Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love."
      scriptureRef="1 Corinthians 16:13–14"
      programs={programs}
    />
  )
}

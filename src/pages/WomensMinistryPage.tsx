import MinistryLayout from '../components/MinistryLayout'

const programs = [
  "Women's Bible study every second Sabbath after service",
  'Annual Women\'s Retreat and spiritual enrichment weekend',
  'Mentorship programme pairing young women with mature sisters',
  'Community service projects — visiting the sick and elderly',
  'Sewing and crafts circle meeting every Friday evening',
  'Mother–daughter fellowship events and seminars',
  'Leadership development and devotional workshops',
]

export default function WomensMinistryPage() {
  return (
    <MinistryLayout
      title="Women's Ministry"
      imageUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&q=80"
      scripture="She is clothed with strength and dignity; she can laugh at the days to come. She speaks with wisdom, and faithful instruction is on her tongue."
      scriptureRef="Proverbs 31:25–26"
      programs={programs}
    />
  )
}

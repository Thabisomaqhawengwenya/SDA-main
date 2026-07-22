import MinistryLayout from '../components/MinistryLayout'

const programs = [
  'Food and clothing distribution every second Saturday',
  'Hospital and prison visitation programme',
  'Back-to-school stationery drive for underprivileged children',
  'Community clean-up days in partnership with local councils',
  'Free tutoring and homework help for neighbourhood students',
  'ADRA partnership projects — disaster relief and development',
  'Door-to-door evangelism and Bible studies in the community',
  'Annual community health and wellness fair',
]

export default function CommunityOutreachPage() {
  return (
    <MinistryLayout
      title="Community Outreach"
      imageUrl="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&q=80"
      scripture="For I was hungry and you gave me food, I was thirsty and you gave me drink, I was a stranger and you welcomed me, I was naked and you clothed me, I was sick and you visited me."
      scriptureRef="Matthew 25:35–36"
      programs={programs}
    />
  )
}

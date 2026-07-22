import MinistryLayout from '../components/MinistryLayout'

const programs = [
  'Youth Program and events',
  'Youth Bible Class Fridays at 6:30 pm',
  'AYS First and Third Sabbath an hour before Sunset',
  "Emganwini Main SDA Youth Reacher's Pathfinder and Adventure Club",
  'Youth leadership development workshops',
  'Annual youth camp and spiritual retreat',
]

export default function YouthMinistryPage() {
  return (
    <MinistryLayout
      title="Youth Ministry"
      imageUrl="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80"
      scripture="But you are a chosen people, a royal priesthood, a holy nation, God's special possession, that you may declare the praises of him who called you out of darkness into his wonderful light."
      scriptureRef="1 Peter 2:9"
      programs={programs}
    />
  )
}

import MinistryLayout from '../components/MinistryLayout'

const programs = [
  'Free blood pressure and diabetes screenings every first Sabbath',
  'Nutrition and healthy living seminars',
  'CHIP (Complete Health Improvement Program) classes',
  'Cooking demonstrations and plant-based diet workshops',
  'Health fairs open to the entire community',
  'Mental wellness and stress management sessions',
]

export default function HealthMinistryPage() {
  return (
    <MinistryLayout
      title="Health Ministry"
      imageUrl="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80"
      scripture="Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God? You are not your own; you were bought at a price. Therefore honor God with your bodies."
      scriptureRef="1 Corinthians 6:19–20"
      programs={programs}
    />
  )
}

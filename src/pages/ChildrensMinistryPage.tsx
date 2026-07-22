import MinistryLayout from '../components/MinistryLayout'

const programs = [
  'Cradle Roll — nurturing infants and toddlers in the faith',
  'Kindergarten Sabbath School every Saturday at 10:30 am',
  'Primary division Bible lessons and Scripture memorisation',
  'Junior Sabbath School for ages 10–13',
  'Vacation Bible School held annually during school holidays',
  'Children\'s choir and praise team',
  'Pathfinder Club — character building and outdoor activities',
  'Family worship resources distributed to parents monthly',
]

export default function ChildrensMinistryPage() {
  return (
    <MinistryLayout
      title="Children's Ministry"
      imageUrl="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80"
      scripture="Train up a child in the way he should go; even when he is old he will not depart from it."
      scriptureRef="Proverbs 22:6"
      programs={programs}
    />
  )
}

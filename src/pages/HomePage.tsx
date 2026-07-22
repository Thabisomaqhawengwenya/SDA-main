import styled from 'styled-components'
import Hero from '../components/Hero'
import Mission from '../components/Mission'
import JoinUs from '../components/JoinUs'
import QuickLinks from '../components/QuickLinks'

const Main = styled.main`
  flex: 1;
`

export default function HomePage() {
  return (
    <Main>
      <Hero />
      <Mission />
      <JoinUs />
      <QuickLinks />
    </Main>
  )
}

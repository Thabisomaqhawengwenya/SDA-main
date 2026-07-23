import styled from 'styled-components'
import Hero from '../components/Hero'
import FindUs from '../components/FindUs'
import Mission from '../components/Mission'
import QuickLinks from '../components/QuickLinks'

const Main = styled.main`
  flex: 1;
`

export default function HomePage() {
  return (
    <Main>
      <Hero />
      <FindUs />
      <Mission />
      <QuickLinks />
    </Main>
  )
}

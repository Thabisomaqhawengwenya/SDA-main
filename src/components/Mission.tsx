import { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import missionBg from '../images/our mission.jpeg'
import visionBg from '../images/hero-worship-sunset.jpeg'
import storyBg from '../images/our story.png'

// ── Animations ────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`

// ── Slide data ────────────────────────────────────────────────────────────────

const slides = [
  {
    title: 'Our Mission',
    body: 'Jesus Saves. Through teaching, preaching, and healing, we as the Emganwini Main SDA Church transform lives by connecting our community to Christ.',
    bg: missionBg,
    bgPos: 'center',
  },
  {
    title: 'Our Vision',
    body: "To be a spiritually vibrant church where families flourish, young people are valued, and every person is invited into God's purpose.",
    bg: visionBg,
    bgPos: 'center',
  },
  {
    title: 'Our Story',
    body: 'This website is being prepared as a clear and welcoming place to introduce the church, share worship life, and help first-time visitors know what to expect.',
    bg: storyBg,
    bgPos: 'center 25%',
  },
]

// ── Styled Components ─────────────────────────────────────────────────────────

const Section = styled.section`
  position: relative;
  width: 100%;
  height: 520px;
  overflow: hidden;
  display: flex;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 420px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 360px;
  }
`

const BgImage = styled.div<{ $url: string; $pos: string }>`
  position: absolute;
  inset: 0;
  background-image: url('${({ $url }) => $url}');
  background-size: cover;
  background-position: ${({ $pos }) => $pos};
  transition: background-position 0.4s ease;
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.70) 0%,
    rgba(0, 0, 0, 0.40) 55%,
    rgba(0, 0, 0, 0.12) 100%
  );
`

const Content = styled.div<{ $key: number }>`
  position: relative;
  z-index: 2;
  padding: 0 80px;
  max-width: 600px;
  animation: ${fadeIn} 1s ease both;

  /* Re-trigger animation on slide change via key prop */
  ${({ $key }) => css`animation-key: ${$key};`}

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 72px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 56px;
  }
`

const SlideLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 12px;
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(30px, 4vw, 52px);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.05;
  margin-bottom: 20px;
  letter-spacing: -0.01em;
`

const Body = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(14px, 1.5vw, 17px);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.8;
  max-width: 460px;
`

// ── Arrow buttons ─────────────────────────────────────────────────────────────

const ArrowBtn = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  ${({ $side }) => ($side === 'left' ? 'left: 20px;' : 'right: 20px;')}
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(29, 161, 242, 0.85);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: #ffffff;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    background: rgba(29, 161, 242, 1);
    transform: translateY(-50%) scale(1.08);
  }
`

// ── Dot indicators ────────────────────────────────────────────────────────────

const Dots = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 8px;
`

const Dot = styled.div<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? '24px' : '8px')};
  height: 8px;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? 'rgba(29,161,242,1)' : 'rgba(255,255,255,0.4)'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(29, 161, 242, 0.7);
  }
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function Mission() {
  const [active, setActive] = useState(0)

  const prev = () => setActive((i) => (i === 0 ? slides.length - 1 : i - 1))
  const next = () => setActive((i) => (i === slides.length - 1 ? 0 : i + 1))

  // Auto-advance every 5 seconds, resets if user interacts manually
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i === slides.length - 1 ? 0 : i + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [active])

  const slide = slides[active]

  return (
    <Section>
      <BgImage $url={slide.bg} $pos={slide.bgPos} />
      <Overlay />

      <Content key={active} $key={active}>
        <SlideLabel>{`0${active + 1} / 0${slides.length}`}</SlideLabel>
        <Title>{slide.title}</Title>
        <Body>{slide.body}</Body>
      </Content>

      <ArrowBtn $side="left" onClick={prev} aria-label="Previous slide">
        <svg viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </ArrowBtn>

      <ArrowBtn $side="right" onClick={next} aria-label="Next slide">
        <svg viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </ArrowBtn>

      <Dots>
        {slides.map((_, i) => (
          <Dot
            key={i}
            $active={i === active}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </Dots>
    </Section>
  )
}

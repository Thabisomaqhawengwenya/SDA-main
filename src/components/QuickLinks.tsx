import { useState, useEffect, useRef, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import ministriesImg from '../images/Ministries.jpeg'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Section = styled.section`
  background: #ffffff;
  padding: 48px 32px 56px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 32px 16px 40px;
    background: ${({ theme }) => theme.colors.bg};
  }
`

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
`

// ═══════════════════════════════════════════════════════════════════════════════
// 1. DESKTOP / TABLET GRID (Visible on screens > 768px)
// ═══════════════════════════════════════════════════════════════════════════════

const DesktopGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`

const GridCard = styled(Link)`
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 12px;
  height: 420px;
  text-decoration: none;
  cursor: pointer;
  animation: ${fadeUp} 0.55s ease both;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.35s ease, transform 0.35s ease;

  &:hover {
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.22);
    transform: translateY(-4px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: 360px;
  }
`

const GridCardImage = styled.div<{ $url: string }>`
  position: absolute;
  inset: 0;
  background-image: url('${({ $url }) => $url}');
  background-size: cover;
  background-position: center;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  ${GridCard}:hover & {
    transform: scale(1.05);
  }
`

const GridCardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.25) 35%,
    rgba(0, 0, 0, 0.0) 60%
  );
  border-radius: inherit;
`

const GridCardLabel = styled.span`
  position: absolute;
  bottom: 24px;
  left: 24px;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
  line-height: 1.1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
  pointer-events: none;
`

// ═══════════════════════════════════════════════════════════════════════════════
// 2. MOBILE CAROUSEL (Visible on screens <= 768px)
// ═══════════════════════════════════════════════════════════════════════════════

const MobileCarouselWrapper = styled.div`
  display: none;
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background: #111111;
  height: 360px;
  user-select: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 330px;
    border-radius: 12px;
  }
`

const Track = styled.div<{ $currentIndex: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  transform: translateX(-${({ $currentIndex }) => $currentIndex * 100}%);
`

const Slide = styled.div`
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const SlideImage = styled.div<{ $url: string }>`
  position: absolute;
  inset: 0;
  background-image: url('${({ $url }) => $url}');
  background-size: cover;
  background-position: center;
`

const SlideOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 15, 25, 0.92) 0%,
    rgba(10, 15, 25, 0.55) 45%,
    rgba(10, 15, 25, 0.20) 100%
  );
`

const SlideContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 20px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  animation: ${fadeIn} 0.4s ease both;
`

const SlideTag = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.25);
`

const SlideTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.15;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
`

const SlideDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  margin: 0 0 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const SlideBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
  background: #1DA1F2;
  padding: 8px 18px;
  border-radius: 30px;
  text-decoration: none;
  transition: background 0.2s ease;
  box-shadow: 0 4px 14px rgba(29, 161, 242, 0.35);

  svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`

const NavBtn = styled.button<{ $direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  ${({ $direction }) => ($direction === 'prev' ? 'left: 10px;' : 'right: 10px;')}
  transform: translateY(-50%);
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`

const DotsContainer = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
`

const Dot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? '22px' : '7px')};
  height: 7px;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? '#1DA1F2' : 'rgba(255, 255, 255, 0.4)')};
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  padding: 0;
`

// ── Data ──────────────────────────────────────────────────────────────────────

const cards = [
  {
    tag: 'Church Life',
    label: 'Events',
    fullTitle: 'Events & Calendar',
    desc: 'Join our Sabbath worship, youth conventions, and fellowship gatherings.',
    to: '/calendar',
    cta: 'View Calendar',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80',
  },
  {
    tag: 'Our Heritage',
    label: 'About Us',
    fullTitle: 'About Emganwini Main',
    desc: 'Discover our church history, biblical beliefs, leadership, and mission.',
    to: '/about',
    cta: 'Learn More',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=900&q=80',
  },
  {
    tag: 'Active Ministries',
    label: 'Ministries',
    fullTitle: 'Church Ministries',
    desc: 'Get involved in Youth, Pathfinders, Women’s, Men’s, and Prayer ministries.',
    to: '/ministries/youth',
    cta: 'Explore Ministries',
    image: ministriesImg,
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuickLinks() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused]         = useState(false)
  const touchStartX                     = useRef<number | null>(null)
  const touchEndX                       = useRef<number | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }, [])

  // Auto advance every 5.5s on mobile unless paused
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(nextSlide, 5500)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.targetTouches[0].clientX
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX
  }

  function handleTouchEnd() {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    const minSwipeDistance = 45

    if (diff > minSwipeDistance) {
      nextSlide()
    } else if (diff < -minSwipeDistance) {
      prevSlide()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <Section aria-label="Events, About, and Ministries">
      <Container>
        {/* 1. Desktop & Tablet: 3-column side-by-side grid */}
        <DesktopGrid>
          {cards.map((card, i) => (
            <GridCard
              key={card.to}
              to={card.to}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <GridCardImage $url={card.image} />
              <GridCardOverlay />
              <GridCardLabel>{card.label}</GridCardLabel>
            </GridCard>
          ))}
        </DesktopGrid>

        {/* 2. Mobile Only: Touch-enabled swipeable carousel */}
        <MobileCarouselWrapper
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Track $currentIndex={currentIndex}>
            {cards.map((card) => (
              <Slide key={card.to}>
                <SlideImage $url={card.image} />
                <SlideOverlay />
                <SlideContent>
                  <SlideTag>{card.tag}</SlideTag>
                  <SlideTitle>{card.fullTitle}</SlideTitle>
                  <SlideDesc>{card.desc}</SlideDesc>
                  <SlideBtn to={card.to}>
                    {card.cta}
                    <svg viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </SlideBtn>
                </SlideContent>
              </Slide>
            ))}
          </Track>

          <NavBtn
            $direction="prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </NavBtn>

          <NavBtn
            $direction="next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </NavBtn>

          <DotsContainer>
            {cards.map((_, i) => (
              <Dot
                key={i}
                $active={currentIndex === i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </DotsContainer>
        </MobileCarouselWrapper>
      </Container>
    </Section>
  )
}

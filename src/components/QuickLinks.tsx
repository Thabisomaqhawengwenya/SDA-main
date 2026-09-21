import { useState, useEffect, useRef, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import ministriesImg from '../images/Ministries.jpeg'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 48px 32px 64px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 32px 16px 48px;
  }
`

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
`

const CarouselWrapper = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  background: #111111;
  height: 480px;
  user-select: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 400px;
    border-radius: 14px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 350px;
    border-radius: 12px;
  }
`

const Track = styled.div<{ $currentIndex: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.55s cubic-bezier(0.25, 1, 0.5, 1);
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
  transition: transform 0.8s ease;

  ${Slide}:hover & {
    transform: scale(1.04);
  }
`

const SlideOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 15, 25, 0.92) 0%,
    rgba(10, 15, 25, 0.60) 45%,
    rgba(10, 15, 25, 0.25) 100%
  );
`

const SlideContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 44px 48px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  animation: ${fadeIn} 0.5s ease both;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 28px 24px;
    gap: 8px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 22px 18px;
  }
`

const SlideTag = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.25);
`

const SlideTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.15;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
`

const SlideDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
  max-width: 580px;
  line-height: 1.6;
  margin: 0 0 6px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 13px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`

const SlideBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
  background: #1DA1F2;
  padding: 10px 22px;
  border-radius: 30px;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 16px rgba(29, 161, 242, 0.35);

  svg {
    width: 15px;
    height: 15px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.2s ease;
  }

  &:hover {
    background: #1a8fd1;
    transform: translateY(-2px);
    box-shadow: 0 6px 22px rgba(29, 161, 242, 0.5);

    svg {
      transform: translateX(3px);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 12px;
    padding: 8px 18px;
  }
`

// ── Navigation Buttons ─────────────────────────────────────────────────────────

const NavBtn = styled.button<{ $direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  ${({ $direction }) => ($direction === 'prev' ? 'left: 18px;' : 'right: 18px;')}
  transform: translateY(-50%);
  z-index: 10;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(10px);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    background: rgba(29, 161, 242, 0.85);
    border-color: rgba(29, 161, 242, 1);
    transform: translateY(-50%) scale(1.08);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 36px;
    height: 36px;
    ${({ $direction }) => ($direction === 'prev' ? 'left: 10px;' : 'right: 10px;')}

    svg {
      width: 16px;
      height: 16px;
    }
  }
`

// ── Pagination Indicators ─────────────────────────────────────────────────────

const DotsContainer = styled.div`
  position: absolute;
  bottom: 24px;
  right: 32px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    bottom: 20px;
    right: 20px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    bottom: 16px;
    right: 16px;
  }
`

const Dot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? '28px' : '8px')};
  height: 8px;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? '#1DA1F2' : 'rgba(255, 255, 255, 0.4)')};
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  padding: 0;

  &:hover {
    background: ${({ $active }) => ($active ? '#1DA1F2' : 'rgba(255, 255, 255, 0.75)')};
  }
`

// ── Data ──────────────────────────────────────────────────────────────────────

const slides = [
  {
    tag: 'Church Life',
    label: 'Upcoming Events & Calendar',
    desc: 'Join our vibrant Sabbath worship, youth conventions, evangelistic campaigns, and community fellowship.',
    to: '/calendar',
    cta: 'View Calendar',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
  },
  {
    tag: 'Our Heritage',
    label: 'About Emganwini Main SDA',
    desc: 'Learn about our church history, biblical beliefs, leadership team, and mission to transform lives for Christ.',
    to: '/about',
    cta: 'Learn More',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=80',
  },
  {
    tag: 'Active Ministries',
    label: 'Ministries & Departments',
    desc: 'Get involved in Adventist Youth, Pathfinders, Ambassadors, Women’s, Men’s, Prayer, and Health ministries.',
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
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  // Auto advance every 5.5 seconds unless paused
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(nextSlide, 5500)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  // Touch handlers for swipe support
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.targetTouches[0].clientX
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX
  }

  function handleTouchEnd() {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (diff > minSwipeDistance) {
      nextSlide() // swipe left -> next
    } else if (diff < -minSwipeDistance) {
      prevSlide() // swipe right -> prev
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <Section aria-label="Events, About, and Ministries Carousel">
      <Container>
        <CarouselWrapper
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides track */}
          <Track $currentIndex={currentIndex}>
            {slides.map((slide) => (
              <Slide key={slide.to}>
                <SlideImage $url={slide.image} />
                <SlideOverlay />
                <SlideContent>
                  <SlideTag>{slide.tag}</SlideTag>
                  <SlideTitle>{slide.label}</SlideTitle>
                  <SlideDesc>{slide.desc}</SlideDesc>
                  <SlideBtn to={slide.to}>
                    {slide.cta}
                    <svg viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </SlideBtn>
                </SlideContent>
              </Slide>
            ))}
          </Track>

          {/* Prev / Next controls */}
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

          {/* Dots */}
          <DotsContainer>
            {slides.map((_, i) => (
              <Dot
                key={i}
                $active={currentIndex === i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </DotsContainer>
        </CarouselWrapper>
      </Container>
    </Section>
  )
}

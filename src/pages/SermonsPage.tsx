import { useState, useMemo, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { subscribeSermons, updateSermon } from '../services/sermonsService'
import type { Sermon } from '../admin/adminTypes'
import { mockSermons } from '../admin/mockData'

// ── Animations ────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

// ── Layout ────────────────────────────────────────────────────────────────────

const PageWrapper = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.navHeight};
  background: ${({ theme }) => theme.colors.bg};
  min-height: 100vh;
`

// ── Hero Banner ───────────────────────────────────────────────────────────────

const HeroBanner = styled.section`
  position: relative;
  min-height: 52vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(17, 38, 64, 0.90) 0%, rgba(30, 58, 45, 0.88) 100%),
              url('https://images.unsplash.com/photo-1438232992991-995b671e4668?w=1600&q=80') center / cover;
  padding: 80px 24px 70px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%);
  }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 860px;
  animation: ${fadeIn} 0.6s ease both;
`

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 16px;
  span { opacity: 0.5; }
`

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(36px, 5vw, 58px);
  font-weight: 500;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
  line-height: 1.15;
`

const HeroSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(15px, 2vw, 18px);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  max-width: 640px;
  margin: 0 auto;
`

const ScriptureQuote = styled.div`
  display: inline-block;
  margin-top: 24px;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 13px;
  font-style: italic;
  color: ${({ theme }) => theme.colors.gold};
`

// ── Content Area ──────────────────────────────────────────────────────────────

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px 90px;
`

// ── Filter & Search Toolbar ───────────────────────────────────────────────────

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 36px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
`

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 280px;
  max-width: 440px;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    stroke: #94a3b8;
    fill: none;
    stroke-width: 2;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 42px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #1DA1F2;
    box-shadow: 0 0 0 3px rgba(29, 161, 242, 0.15);
  }
`

const FilterChips = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const FilterChip = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 999px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ $active }) => ($active ? '#1DA1F2' : '#cbd5e1')};
  background: ${({ $active }) => ($active ? '#1DA1F2' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#475569')};

  &:hover {
    border-color: #1DA1F2;
    color: ${({ $active }) => ($active ? '#ffffff' : '#1DA1F2')};
  }
`

// ── Featured Banner ───────────────────────────────────────────────────────────

const FeaturedBanner = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  border-radius: 16px;
  padding: 32px 36px;
  margin-bottom: 48px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 32px;
  align-items: center;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);

  @media (max-width: 868px) {
    grid-template-columns: 1fr;
    padding: 24px 20px;
  }
`

const FeaturedLeft = styled.div``
const FeaturedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  background: #f59e0b;
  color: #ffffff;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 14px;
`
const FeaturedTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 26px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px;
  line-height: 1.25;
`
const FeaturedPreacher = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 16px;
  strong { color: #ffffff; }
`
const FeaturedDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0 0 20px;
`
const FeaturedBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1DA1F2;
  color: #ffffff;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  svg { width: 16px; height: 16px; fill: currentColor; }

  &:hover {
    background: #1a8fd1;
    transform: translateY(-2px);
  }
`

const FeaturedVideoPreview = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  aspect-ratio: 16 / 9;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.85;
    transition: opacity 0.3s;
  }

  &:hover img {
    opacity: 0.7;
  }
`

const BigPlayBtn = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(29, 161, 242, 0.9);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s;

  svg { width: 24px; height: 24px; fill: currentColor; margin-left: 2px; }

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }
`

// ── Sermon Grid ───────────────────────────────────────────────────────────────

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
`

const Card = styled.div`
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }
`

const ThumbWrap = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  background: #0f172a;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`

const PlayOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;

  ${ThumbWrap}:hover & {
    opacity: 1;
  }
`

const PlayCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #1DA1F2;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  svg { width: 18px; height: 18px; fill: currentColor; margin-left: 2px; }
`

const DurationBadge = styled.span`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: #ffffff;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
`

const CardBody = styled.div`
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
`

const CardSeries = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1DA1F2;
  margin-bottom: 6px;
`

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 10px;
  line-height: 1.35;
`

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: #64748b;
  margin-bottom: 12px;

  span { display: flex; align-items: center; gap: 4px; }
  svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; }
`

const CardScripture = styled.p`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 13px;
  font-style: italic;
  color: #4a6741;
  margin: 0 0 14px;
`

const CardFooter = styled.div`
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const WatchBtn = styled.button`
  background: none;
  border: none;
  color: #1DA1F2;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;

  svg { width: 14px; height: 14px; fill: currentColor; }

  &:hover {
    color: #1a8fd1;
    text-decoration: underline;
  }
`

const PreacherName = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: #334155;
  font-weight: 500;
`

// ── Modal Player ──────────────────────────────────────────────────────────────

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease;
`

const ModalBox = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
`

const ModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #e2e8f0;
`

const ModalTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-size: 20px;
  padding: 4px;
  &:hover { color: #0f172a; }
`

const VideoEmbedWrap = styled.div`
  aspect-ratio: 16 / 9;
  background: #000;
  iframe { width: 100%; height: 100%; border: none; }
`

const ModalContent = styled.div`
  padding: 24px;
`

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>(mockSermons)
  const [search, setSearch] = useState('')
  const [selectedSeries, setSelectedSeries] = useState<string>('All')
  const [activeModalSermon, setActiveModalSermon] = useState<Sermon | null>(null)

  useEffect(() => {
    const unsub = subscribeSermons((items) => {
      const published = items.filter(s => s.status === 'published')
      if (published.length > 0) setSermons(published)
    })
    return () => unsub?.()
  }, [])

  const handleOpenSermon = (sermon: Sermon) => {
    setActiveModalSermon(sermon)
    if (sermon.id) {
      const newViews = (sermon.views || 0) + 1
      updateSermon(sermon.id, { views: newViews }).catch((err) => {
        console.warn('Could not update sermon views:', err)
      })
    }
  }

  // Extract unique categories / series
  const categoryList = useMemo(() => {
    const set = new Set<string>()
    sermons.forEach(s => {
      if (s.category) set.add(s.category)
    })
    return ['All', ...Array.from(set)]
  }, [sermons])

  // Filtered sermons
  const filtered = useMemo(() => {
    return sermons.filter(s => {
      const matchSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.speaker.toLowerCase().includes(search.toLowerCase()) ||
        (s.scripture && s.scripture.toLowerCase().includes(search.toLowerCase())) ||
        (s.category && s.category.toLowerCase().includes(search.toLowerCase()))
      const matchCategory = selectedSeries === 'All' || s.category === selectedSeries
      return matchSearch && matchCategory
    })
  }, [sermons, search, selectedSeries])

  const featured = sermons[0]

  return (
    <PageWrapper>
      {/* Hero Banner */}
      <HeroBanner>
        <HeroContent>
          <Breadcrumb>
            <span>Home</span>
            <span>/</span>
            <span style={{ opacity: 1, color: '#ffffff' }}>Sermons &amp; Media</span>
          </Breadcrumb>
          <HeroTitle>Sermons &amp; Messages</HeroTitle>
          <HeroSub>
            Feed your soul with life-changing messages of hope, biblical truths, and spiritual growth from Emganwini Main SDA Church.
          </HeroSub>
          <ScriptureQuote>
            "Consequently, faith comes from hearing the message, and the message is heard through the word about Christ." — Romans 10:17
          </ScriptureQuote>
        </HeroContent>
      </HeroBanner>

      <Container>
        {/* Featured Sermon */}
        {featured && (
          <FeaturedBanner>
            <FeaturedLeft>
              <FeaturedBadge>★ Latest Message</FeaturedBadge>
              <FeaturedTitle>{featured.title}</FeaturedTitle>
              <FeaturedPreacher>
                By <strong>{featured.speaker}</strong> &bull; {new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </FeaturedPreacher>
              <FeaturedDesc>{featured.description || 'Listen to this powerful presentation grounded in God’s Word.'}</FeaturedDesc>
              <FeaturedBtn onClick={() => handleOpenSermon(featured)}>
                <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Watch Now
              </FeaturedBtn>
            </FeaturedLeft>

            <FeaturedVideoPreview onClick={() => handleOpenSermon(featured)}>
              <img
                src={featured.thumbnail || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80'}
                alt={featured.title}
              />
              <BigPlayBtn>
                <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </BigPlayBtn>
            </FeaturedVideoPreview>
          </FeaturedBanner>
        )}

        {/* Toolbar & Filters */}
        <Toolbar>
          <SearchBox>
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <SearchInput
              type="text"
              placeholder="Search by title, speaker, Scripture, or topic..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </SearchBox>

          <FilterChips>
            {categoryList.map(cat => (
              <FilterChip
                key={cat}
                $active={selectedSeries === cat}
                onClick={() => setSelectedSeries(cat)}
              >
                {cat}
              </FilterChip>
            ))}
          </FilterChips>
        </Toolbar>

        {/* Sermon Grid */}
        {filtered.length === 0 ? (
          <EmptyMessage>
            <p>No sermons found matching your search criteria.</p>
          </EmptyMessage>
        ) : (
          <Grid>
            {filtered.map(sermon => (
              <Card key={sermon.id}>
                <ThumbWrap onClick={() => handleOpenSermon(sermon)}>
                  <img
                    src={sermon.thumbnail || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80'}
                    alt={sermon.title}
                    loading="lazy"
                  />
                  <PlayOverlay>
                    <PlayCircle>
                      <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </PlayCircle>
                  </PlayOverlay>
                  {sermon.duration && <DurationBadge>{sermon.duration}</DurationBadge>}
                </ThumbWrap>

                <CardBody>
                  {sermon.category && <CardSeries>{sermon.category}</CardSeries>}
                  <CardTitle>{sermon.title}</CardTitle>
                  
                  <CardMeta>
                    <span>
                      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {new Date(sermon.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {sermon.views !== undefined && (
                      <span>
                        <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        {sermon.views} views
                      </span>
                    )}
                  </CardMeta>

                  {sermon.scripture && (
                    <CardScripture>📖 {sermon.scripture}</CardScripture>
                  )}

                  <CardFooter>
                    <PreacherName>👤 {sermon.speaker}</PreacherName>
                    <WatchBtn onClick={() => handleOpenSermon(sermon)}>
                      <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      Watch
                    </WatchBtn>
                  </CardFooter>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </Container>

      {/* Sermon Player Modal */}
      {activeModalSermon && (
        <ModalOverlay onClick={() => setActiveModalSermon(null)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHead>
              <ModalTitle>{activeModalSermon.title}</ModalTitle>
              <CloseBtn onClick={() => setActiveModalSermon(null)}>✕</CloseBtn>
            </ModalHead>

            <VideoEmbedWrap>
              {activeModalSermon.videoUrl && activeModalSermon.videoUrl.includes('youtube.com') ? (
                <iframe
                  src={activeModalSermon.videoUrl.replace('watch?v=', 'embed/')}
                  title={activeModalSermon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeModalSermon.videoUrl ? (
                <iframe src={activeModalSermon.videoUrl} title={activeModalSermon.title} allowFullScreen />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                  <p>Audio recording &amp; media player</p>
                </div>
              )}
            </VideoEmbedWrap>

            <ModalContent>
              <p style={{ margin: '0 0 6px', color: '#1DA1F2', fontWeight: 600, fontSize: 13 }}>
                Speaker: {activeModalSermon.speaker} {activeModalSermon.scripture && `• Passage: ${activeModalSermon.scripture}`}
              </p>
              <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 13 }}>
                Date: {new Date(activeModalSermon.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <p style={{ color: '#334155', lineHeight: 1.6, fontSize: 14 }}>
                {activeModalSermon.description || 'Join us in studying God’s Word with this inspiring sermon.'}
              </p>
            </ModalContent>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageWrapper>
  )
}

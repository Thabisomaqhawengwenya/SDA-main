import { useState } from 'react'
import styled from 'styled-components'
import { Icon } from '@iconify/react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface GivingItem {
  id: string
  label: string
  info?: boolean
  link?: string
}

interface GivingCategory {
  id: string
  label: string
  icon: string
  accentColor: string
  items: GivingItem[]
}

// ── Data ──────────────────────────────────────────────────────────────────────

const CATEGORIES: GivingCategory[] = [
  {
    id: 'tithe',
    label: 'Tithe',
    icon: 'ph:arrow-up-bold',
    accentColor: '#5b8dd9',
    items: [
      { id: 'tithe-main', label: 'Tithe', info: true },
    ],
  },
  {
    id: 'local',
    label: 'Local Offerings',
    icon: 'ph:users-three-bold',
    accentColor: '#5b8dd9',
    items: [
      { id: 'church-roofing', label: 'Church Roofing Pool – Prepaid', info: true },
      { id: 'church-license', label: 'Church License' },
      { id: 'building-fund', label: 'Building Fund', link: 'Building Fund' },
      { id: 'personal-ministries', label: 'Personal Ministries' },
      { id: 'window-resource', label: 'Window Resource Fund', info: true },
      { id: 'religious-liberty', label: 'Religious Liberty Signature', link: 'Religious Liberty' },
      { id: 'camp-cherokee', label: 'Camp Cherokee Love Day Weekend Retreat 2026', info: true },
    ],
  },
  {
    id: 'conference',
    label: 'Conference/Union Offerings',
    icon: 'ph:buildings-bold',
    accentColor: '#5b8dd9',
    items: [
      { id: 'ny-panel', label: 'New York Panel' },
      { id: 'campmeeting-evangelism', label: 'Campmeeting Evangelism Offering' },
      { id: 'daher-springs-financial', label: 'Daher Springs Academy-Student Financial Aid' },
      { id: 'daher-springs-operation', label: 'Daher Springs Academy Operation' },
      { id: 'camp-cherokee-conf', label: 'Camp Cherokee' },
      { id: 'camp-cherokee-weekly', label: 'Camp Cherokee – Weekly Camper' },
      { id: 'daher-renovation', label: 'Daher Springs Academy – Renovation' },
      { id: 'camp-meeting-facility', label: 'Camp Meeting Facility' },
      { id: 'hurricane-jamaica', label: 'Hurricane Relief Jamaica' },
    ],
  },
  {
    id: 'world',
    label: 'World Offerings',
    icon: 'ph:globe-western-hemisphere-bold',
    accentColor: '#5b8dd9',
    items: [
      { id: 'world-budget', label: 'World Budget – Presupuesto mundial / Budget mondial', link: 'World Budget' },
      { id: 'pennies-beyond', label: 'Pennies and Beyond', info: true },
    ],
  },
]

// ── Page wrapper ──────────────────────────────────────────────────────────────

const PageWrapper = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.navHeight};
  background: #ffffff;
  min-height: 100vh;
`



// ── Church name header ────────────────────────────────────────────────────────

const ChurchHeader = styled.div`
  text-align: center;
  padding: 28px 24px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #ffffff;
`

const ChurchName = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 22px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 4px;
`

const ChurchAddress = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: #888888;
  margin: 0;
  letter-spacing: 0.02em;
`

// ── Offering of the week banner ───────────────────────────────────────────────

const OfferingBanner = styled.div`
  background: #f7f9fc;
  border-top: 1px solid #e0e8f0;
  border-bottom: 1px solid #e0e8f0;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const OfferingLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;

  svg { color: #5b8dd9; flex-shrink: 0; }
`

const OfferingText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: #444;
  margin: 0;
  line-height: 1.5;

  strong { font-weight: 700; color: #333; }
`

const OfferingBtn = styled.button`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
  background: #5b8dd9;
  border: none;
  border-radius: 3px;
  padding: 7px 14px;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background 0.2s;

  &:hover { background: #4a7bc5; }
`

// ── Main layout ───────────────────────────────────────────────────────────────

const Layout = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 28px 20px 80px;
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 24px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`

// ── Left: category cards ──────────────────────────────────────────────────────

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const CatCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #ffffff;
  overflow: hidden;
`

const CatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 18px;
  background: #f7f9fc;
  border-bottom: 1px solid #e0e0e0;
`

const CatIcon = styled.div`
  color: #5b8dd9;
  display: flex;
  align-items: center;
`

const CatLabel = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #444;
  margin: 0;
`

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 18px;
  border-bottom: 1px solid #f0f0f0;

  &:last-of-type { border-bottom: none; }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
`

const ItemLabelWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`

const ItemLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 400;
  color: #333;
  cursor: pointer;
  line-height: 1.4;
`

const ItemLink = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: #5b8dd9;
  cursor: pointer;
  text-decoration: underline;

  &:hover { color: #4a7bc5; }
`

const InfoCircle = styled.button`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid #aaaaaa;
  background: none;
  cursor: pointer;
  color: #aaaaaa;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s, color 0.15s;

  &:hover { border-color: #5b8dd9; color: #5b8dd9; }
`

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #cccccc;
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
  width: 100px;
  background: #ffffff;
  transition: border-color 0.15s;

  &:focus-within {
    border-color: #5b8dd9;
  }
`

const DollarSign = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: #888;
  padding: 7px 6px 7px 8px;
  user-select: none;
`

const NumInput = styled.input`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: #333;
  border: none;
  outline: none;
  padding: 7px 7px 7px 2px;
  width: 100%;
  background: transparent;
  text-align: right;

  /* hide number spinners */
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

  &::placeholder { color: #bbbbbb; }
`

const AddCatRow = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  color: #5b8dd9;
  background: none;
  border: none;
  padding: 12px 18px;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: opacity 0.15s;

  &:hover { opacity: 0.7; }
`

// ── Right: sidebar summary cards ──────────────────────────────────────────────

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: calc(${({ theme }) => theme.navHeight} + 28px);

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: static;
  }
`

const SummaryCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #ffffff;
  overflow: hidden;
`

const SummaryTitle = styled.div`
  padding: 10px 16px 8px;
  background: #f7f9fc;
  border-bottom: 1px solid #e8e8e8;

  p {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #888;
    margin: 0;
  }
`

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 16px;
  border-bottom: 1px solid #f0f0f0;

  &:last-of-type { border-bottom: none; }
`

const SummaryRowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const SummaryIcon = styled.div`
  color: #5b8dd9;
  display: flex;
  align-items: center;
`

const SummaryLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: #444;
`

const SummaryAmt = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 500;
  color: #333;
`

const TotalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #f7f9fc;
  border-top: 1px solid #e8e8e8;

  p {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #888;
    margin: 0;
  }

  strong {
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 14px;
    font-weight: 700;
    color: #333;
  }
`

const ContinueBtn = styled.button`
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
  background: #5b8dd9;
  border: none;
  padding: 13px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.2s;

  &:hover { background: #4a7bc5; }
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function GivingPage() {
  const [amounts, setAmounts] = useState<Record<string, string>>({})

  const set = (id: string, val: string) =>
    setAmounts((prev) => ({ ...prev, [id]: val }))

  const num = (id: string) => parseFloat(amounts[id] || '0') || 0

  const catTotal = (cat: GivingCategory) =>
    cat.items.reduce((s, i) => s + num(i.id), 0)

  const fmt = (n: number) => n.toFixed(2)

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <PageWrapper>

      {/* Church name */}
      <ChurchHeader>
        <ChurchName>Emganwini Main SDA Church</ChurchName>
        <ChurchAddress>Emganwini, Bulawayo, Zimbabwe</ChurchAddress>
      </ChurchHeader>

      {/* Offering of the week */}
      <OfferingBanner>
        <OfferingLeft>
          <Icon icon="ph:calendar-blank-bold" width={16} />
          <OfferingText>
            <strong>Offering of the Week:</strong> Supporting evangelism, education, and camp ministry — and more.
          </OfferingText>
        </OfferingLeft>
        <OfferingBtn onClick={() => scrollTo('conference')}>
          Go to Conference / Union Budget
          <Icon icon="ph:caret-right-bold" width={11} />
        </OfferingBtn>
      </OfferingBanner>

      <Layout>
        {/* ── Left column ── */}
        <LeftCol>
          {CATEGORIES.map((cat) => (
            <CatCard key={cat.id} id={cat.id}>
              <CatHeader>
                <CatIcon><Icon icon={cat.icon} width={16} /></CatIcon>
                <CatLabel>{cat.label}</CatLabel>
              </CatHeader>

              {cat.items.map((item) => (
                <ItemRow key={item.id}>
                  <ItemLabelWrap>
                    {item.link
                      ? <ItemLink>{item.label}</ItemLink>
                      : <ItemLabel htmlFor={item.id}>{item.label}</ItemLabel>
                    }
                    {item.info && <InfoCircle title="More info" aria-label="Info">i</InfoCircle>}
                  </ItemLabelWrap>
                  <InputWrap>
                    <DollarSign>$</DollarSign>
                    <NumInput
                      id={item.id}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={amounts[item.id] || ''}
                      onChange={(e) => set(item.id, e.target.value)}
                    />
                  </InputWrap>
                </ItemRow>
              ))}

              <AddCatRow type="button">
                ADD CATEGORIES →
              </AddCatRow>
            </CatCard>
          ))}
        </LeftCol>

        {/* ── Right sidebar — one summary card per category ── */}
        <RightCol>
          {CATEGORIES.map((cat, idx) => {
            // sidebar shows categories from current down
            const visible = CATEGORIES.slice(idx)
            const total = visible.reduce((s, c) => s + catTotal(c), 0)

            return (
              <SummaryCard key={cat.id}>
                <SummaryTitle><p>Jump to Category</p></SummaryTitle>

                {visible.map((c) => (
                  <SummaryRow key={c.id} onClick={() => scrollTo(c.id)}
                    style={{ cursor: 'pointer' }}>
                    <SummaryRowLeft>
                      <SummaryIcon><Icon icon={c.icon} width={14} /></SummaryIcon>
                      <SummaryLabel>{c.label}</SummaryLabel>
                    </SummaryRowLeft>
                    <SummaryAmt>${fmt(catTotal(c))}</SummaryAmt>
                  </SummaryRow>
                ))}

                <TotalRow>
                  <p>Current Total (USD):</p>
                  <strong>${fmt(total)}</strong>
                </TotalRow>

                <ContinueBtn type="button">
                  Continue →
                </ContinueBtn>
              </SummaryCard>
            )
          })}
        </RightCol>
      </Layout>
    </PageWrapper>
  )
}

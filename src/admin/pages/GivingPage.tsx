import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle,
  Card, CardHeader, CardTitle, CardBody, Grid3,
  TableWrap, Table, Thead, Th, Tbody, Tr, Td, SectionLabel,
} from '../components/ui'
import { mockDonations } from '../mockData'
import type { Donation } from '../adminTypes'
import { subscribeDonations } from '../../services/givingService'

const PrivacyBanner = styled.div`
  background:${t.colors.warningLight}; border:1px solid ${t.colors.warning}30;
  border-radius:${t.radius.md}; padding:12px 16px; margin-bottom:20px;
  display:flex; align-items:center; gap:10px;
  font-family:${t.fonts.sans}; font-size:13px; color:${t.colors.warning};
  svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;flex-shrink:0;}
`

const CampaignCard = styled(Card)`padding:20px;`
const CampaignName = styled.h3`font-family:${t.fonts.sans}; font-size:14px; font-weight:600; color:${t.colors.text}; margin:0 0 8px;`
const ProgressBar = styled.div<{$pct:number}>`
  height:8px; border-radius:${t.radius.full}; background:${t.colors.border}; overflow:hidden; margin-bottom:8px;
  &::after{content:''; display:block; height:100%; width:${({$pct})=>$pct}%;
    background:${t.colors.success}; border-radius:${t.radius.full}; transition:width 0.4s ease;}
`
const ProgressLabel = styled.div`display:flex; justify-content:space-between; font-family:${t.fonts.sans}; font-size:12px; color:${t.colors.textMuted};`

const campaigns = [
  { name: 'Church Roofing Project', raised: 4250, goal: 10000 },
  { name: 'Building Fund',          raised: 8700, goal: 25000 },
  { name: 'Community Outreach',     raised: 1200, goal: 3000  },
]

export default function AdminGivingPage() {
  const [donations, setDonations] = useState<Donation[]>(mockDonations)

  useEffect(() => {
    const unsub = subscribeDonations((items) => {
      if (items.length > 0) setDonations(items)
    })
    return () => unsub?.()
  }, [])

  const categoryTotals = donations.reduce<Record<string, number>>((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + d.amount
    return acc
  }, {})

  const totalMonthly = donations.reduce((s, d) => s + d.amount, 0)

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Giving & Donations</PageTitle>
          <PageSubtitle>Financial overview, online giving records, and special building projects</PageSubtitle>
        </PageTitleBlock>
      </PageHeader>

      <PrivacyBanner>
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Donor information is confidential. Access is restricted to authorized finance administrators only.
      </PrivacyBanner>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Recorded',   value: `$${totalMonthly.toLocaleString()}`, color: t.colors.success, bg: t.colors.successLight },
          { label: 'Tithe',            value: `$${(categoryTotals['Tithe'] || 0).toLocaleString()}`,         color: t.colors.primary, bg: t.colors.primaryLight },
          { label: 'Building Fund',    value: `$${(categoryTotals['Building Fund'] || 0).toLocaleString()}`, color: t.colors.purple,  bg: t.colors.purpleLight },
          { label: 'Outreach & Misc',  value: `$${(categoryTotals['Community Outreach'] || 0).toLocaleString()}`, color: t.colors.warning, bg: t.colors.warningLight },
        ].map(s => (
          <Card key={s.label} style={{ padding: '20px' }}>
            <p style={{ fontFamily: t.fonts.sans, fontSize: 12, color: t.colors.textMuted, margin: '0 0 6px' }}>{s.label}</p>
            <p style={{ fontFamily: t.fonts.sans, fontSize: 24, fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Campaigns */}
      <SectionLabel>Special Projects & Campaigns</SectionLabel>
      <Grid3 style={{ marginBottom: 32 }}>
        {campaigns.map(c => {
          const pct = Math.min(100, Math.round((c.raised / c.goal) * 100))
          return (
            <CampaignCard key={c.name}>
              <CampaignName>{c.name}</CampaignName>
              <ProgressBar $pct={pct} />
              <ProgressLabel>
                <span>${c.raised.toLocaleString()} raised ({pct}%)</span>
                <span>Goal: ${c.goal.toLocaleString()}</span>
              </ProgressLabel>
            </CampaignCard>
          )
        })}
      </Grid3>

      {/* Recent Donations */}
      <Card>
        <CardHeader><CardTitle>Recent Online Transactions ({donations.length})</CardTitle></CardHeader>
        <CardBody style={{ paddingTop: 0 }}>
          <TableWrap style={{ borderRadius: 0, border: 'none' }}>
            <Table>
              <Thead>
                <tr>
                  <Th>Donor</Th><Th>Category</Th><Th>Amount</Th>
                  <Th>Payment Method</Th><Th>Date</Th>
                </tr>
              </Thead>
              <Tbody>
                {donations.map(d => (
                  <Tr key={d.id}>
                    <Td style={{ fontWeight: 500 }}>{d.isAnonymous ? 'Anonymous' : d.donor}</Td>
                    <Td>{d.category}</Td>
                    <Td style={{ fontWeight: 700, color: t.colors.success }}>${d.amount.toFixed(2)}</Td>
                    <Td>{d.method}</Td>
                    <Td>{new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrap>
        </CardBody>
      </Card>
    </PageShell>
  )
}

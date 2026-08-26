import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle,
  Card, CardHeader, CardTitle, CardBody, Grid3,
  TableWrap, Table, Thead, Th, Tbody, Tr, Td, SectionLabel,
} from '../components/ui'
import { mockDonations } from '../mockData'

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

const categoryTotals = mockDonations.reduce<Record<string, number>>((acc, d) => {
  acc[d.category] = (acc[d.category] || 0) + d.amount
  return acc
}, {})

const totalMonthly = mockDonations.reduce((s, d) => s + d.amount, 0)

export default function AdminGivingPage() {
  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Giving & Donations</PageTitle>
          <PageSubtitle>Financial overview and donation management</PageSubtitle>
        </PageTitleBlock>
      </PageHeader>

      <PrivacyBanner>
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Donor information is confidential. Access is restricted to authorized finance administrators only.
      </PrivacyBanner>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total This Month', value: `$${totalMonthly}`, color: t.colors.success, bg: t.colors.successLight },
          { label: 'Tithe',            value: `$${categoryTotals['Tithe'] || 0}`,         color: t.colors.primary, bg: t.colors.primaryLight },
          { label: 'Building Fund',    value: `$${categoryTotals['Building Fund'] || 0}`, color: t.colors.purple,  bg: t.colors.purpleLight },
          { label: 'Outreach',         value: `$${categoryTotals['Community Outreach'] || 0}`, color: t.colors.accent, bg: t.colors.accentLight },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: t.radius.md, padding: '16px 20px', border: `1px solid ${c.color}20` }}>
            <p style={{ fontFamily: t.fonts.sans, fontSize: 24, fontWeight: 700, color: c.color, margin: '0 0 4px' }}>{c.value}</p>
            <p style={{ fontFamily: t.fonts.sans, fontSize: 13, color: c.color, margin: 0, opacity: 0.8 }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Campaigns */}
      <SectionLabel style={{ marginBottom: 16 }}>Giving Campaigns</SectionLabel>
      <Grid3 style={{ marginBottom: 28 }}>
        {campaigns.map(c => {
          const pct = Math.min(100, Math.round((c.raised / c.goal) * 100))
          return (
            <CampaignCard key={c.name}>
              <CampaignName>{c.name}</CampaignName>
              <ProgressBar $pct={pct} />
              <ProgressLabel>
                <span style={{ fontWeight: 600, color: t.colors.text }}>${c.raised.toLocaleString()} raised</span>
                <span>{pct}% of ${c.goal.toLocaleString()}</span>
              </ProgressLabel>
            </CampaignCard>
          )
        })}
      </Grid3>

      {/* Recent donations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardBody style={{ padding: 0 }}>
          <TableWrap style={{ border: 'none', borderRadius: 0 }}>
            <Table>
              <Thead><tr>
                <Th>Donor</Th><Th>Amount</Th><Th>Category</Th><Th>Method</Th><Th>Date</Th>
              </tr></Thead>
              <Tbody>
                {mockDonations.map(d => (
                  <Tr key={d.id}>
                    <Td>{d.isAnonymous ? <span style={{ color: t.colors.textMuted }}>Anonymous</span> : d.donor}</Td>
                    <Td style={{ fontWeight: 600, color: t.colors.success }}>${d.amount}</Td>
                    <Td>{d.category}</Td>
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

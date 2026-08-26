import { useState } from 'react'
import styled from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import {
  PageShell, PageHeader, PageTitleBlock, PageTitle, PageSubtitle, PageActions,
  Card, CardHeader, CardTitle, CardBody, Btn, FormGroup, FormGrid, Label, Input, Select,
} from '../components/ui'

const Section = styled.div`margin-bottom:32px;`
const Toggle = styled.label`
  display:flex; align-items:center; gap:12px; cursor:pointer;
  font-family:${t.fonts.sans}; font-size:14px; color:${t.colors.text};
  input{accent-color:${t.colors.primary}; width:16px; height:16px;}
`
const SaveBar = styled.div`
  position:fixed; bottom:24px; right:32px; z-index:50;
  background:${t.colors.sidebarBg}; border-radius:${t.radius.lg};
  padding:12px 20px; display:flex; align-items:center; gap:12px;
  box-shadow:0 8px 32px rgba(0,0,0,0.2);
  p{font-family:${t.fonts.sans}; font-size:13px; color:rgba(255,255,255,0.75); margin:0;}
`

export default function SettingsPage() {
  const [saved, setSaved]   = useState(false)
  const [form, setForm]     = useState({
    churchName:    'Emganwini Main SDA Church',
    tagline:       'Connecting our community to Christ',
    email:         'Connect@Emganwinisda.org',
    phone:         '+263 XXX XXX XXX',
    address:       'Emganwini, Bulawayo, Zimbabwe',
    youtubeUrl:    'https://youtube.com/@emganwinisda',
    facebookUrl:   'https://facebook.com/emganwinisda',
    tiktokUrl:     'https://tiktok.com/@emganwinisda',
    sabbathSchool: '09:00',
    worship:       '11:30',
    timezone:      'Africa/Harare',
    emailNotifs:   true,
    prayerNotifs:  true,
    messageNotifs: true,
  })

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  return (
    <PageShell>
      <PageHeader>
        <PageTitleBlock>
          <PageTitle>Settings</PageTitle>
          <PageSubtitle>Configure church website and dashboard settings</PageSubtitle>
        </PageTitleBlock>
        <PageActions>
          <Btn onClick={handleSave}>Save All Changes</Btn>
        </PageActions>
      </PageHeader>

      <Card style={{ marginBottom: 20 }}>
        <CardHeader><CardTitle>Church Information</CardTitle></CardHeader>
        <CardBody>
          <Section>
            <FormGroup><Label>Church Name</Label>
              <Input value={form.churchName} onChange={e => set('churchName', e.target.value)} />
            </FormGroup>
            <FormGroup><Label>Tagline</Label>
              <Input value={form.tagline} onChange={e => set('tagline', e.target.value)} />
            </FormGroup>
            <FormGrid>
              <FormGroup><Label>Contact Email</Label>
                <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} />
              </FormGroup>
              <FormGroup><Label>Phone</Label>
                <Input value={form.phone} onChange={e => set('phone', e.target.value)} />
              </FormGroup>
            </FormGrid>
            <FormGroup><Label>Address</Label>
              <Input value={form.address} onChange={e => set('address', e.target.value)} />
            </FormGroup>
          </Section>
        </CardBody>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <CardHeader><CardTitle>Service Times</CardTitle></CardHeader>
        <CardBody>
          <FormGrid>
            <FormGroup><Label>Sabbath School Time</Label>
              <Input type="time" value={form.sabbathSchool} onChange={e => set('sabbathSchool', e.target.value)} />
            </FormGroup>
            <FormGroup><Label>Worship Service Time</Label>
              <Input type="time" value={form.worship} onChange={e => set('worship', e.target.value)} />
            </FormGroup>
          </FormGrid>
          <FormGroup><Label>Timezone</Label>
            <Select value={form.timezone} onChange={e => set('timezone', e.target.value)}>
              <option value="Africa/Harare">Africa/Harare (CAT)</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
              <option value="UTC">UTC</option>
            </Select>
          </FormGroup>
        </CardBody>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader>
        <CardBody>
          <FormGroup><Label>YouTube</Label>
            <Input placeholder="https://youtube.com/@handle" value={form.youtubeUrl} onChange={e => set('youtubeUrl', e.target.value)} />
          </FormGroup>
          <FormGroup><Label>Facebook</Label>
            <Input placeholder="https://facebook.com/page" value={form.facebookUrl} onChange={e => set('facebookUrl', e.target.value)} />
          </FormGroup>
          <FormGroup><Label>TikTok</Label>
            <Input placeholder="https://tiktok.com/@handle" value={form.tiktokUrl} onChange={e => set('tiktokUrl', e.target.value)} />
          </FormGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Toggle><input type="checkbox" checked={form.emailNotifs} onChange={e => set('emailNotifs', e.target.checked)} /> Email me when a new contact message is received</Toggle>
            <Toggle><input type="checkbox" checked={form.prayerNotifs} onChange={e => set('prayerNotifs', e.target.checked)} /> Email me when a new prayer request is submitted</Toggle>
            <Toggle><input type="checkbox" checked={form.messageNotifs} onChange={e => set('messageNotifs', e.target.checked)} /> Show in-dashboard notifications for new activity</Toggle>
          </div>
        </CardBody>
      </Card>

      {saved && (
        <SaveBar>
          <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: t.colors.success, fill: 'none', strokeWidth: 2.5, flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <p>Settings saved successfully</p>
          <Btn $size="sm" $variant="ghost" style={{ color: 'rgba(255,255,255,0.5)', padding: '4px 8px' }}>Dismiss</Btn>
        </SaveBar>
      )}
    </PageShell>
  )
}

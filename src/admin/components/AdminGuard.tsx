import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { adminTheme as t } from '../adminTheme'

// ── Change this PIN to whatever you want ──────────────────────────────────────
const ADMIN_PIN = '7429'
const SESSION_KEY = 'sda_admin_auth'
// ─────────────────────────────────────────────────────────────────────────────

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-6px); }
  80%       { transform: translateX(6px); }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Shell = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  background: ${t.colors.sidebarBg};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: ${t.fonts.sans};
`

const Box = styled.div`
  background: #1a2540;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: ${t.radius.xl};
  padding: 40px 36px;
  width: 100%;
  max-width: 360px;
  box-shadow: ${t.shadows.xl};
  animation: ${fadeIn} 0.35s ease both;

  @media (max-width: 400px) {
    padding: 32px 24px;
    border-radius: ${t.radius.lg};
  }
`

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
`

const LogoDot = styled.div`
  width: 36px; height: 36px; border-radius: 10px;
  background: ${t.colors.primary};
  display: flex; align-items: center; justify-content: center;
  svg { width: 18px; height: 18px; fill: #fff; }
`

const LogoText = styled.div`
  p:first-child { font-size: 14px; font-weight: 700; color: #fff; line-height: 1.2; }
  p:last-child  { font-size: 10px; font-weight: 500; letter-spacing: 0.1em;
                  text-transform: uppercase; color: rgba(255,255,255,0.35); }
`

const Title = styled.h1`
  font-size: 20px; font-weight: 700; color: #fff;
  text-align: center; margin: 0 0 6px;
  letter-spacing: -0.02em;
`

const Subtitle = styled.p`
  font-size: 13px; color: rgba(255,255,255,0.45);
  text-align: center; margin: 0 0 28px; line-height: 1.5;
`

const DotsRow = styled.div`
  display: flex; justify-content: center; gap: 14px; margin-bottom: 28px;
`

const Dot = styled.div<{ $filled: boolean; $error: boolean }>`
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid ${({ $error, $filled }) =>
    $error ? t.colors.danger : $filled ? t.colors.primary : 'rgba(255,255,255,0.2)'};
  background: ${({ $error, $filled }) =>
    $error ? t.colors.danger : $filled ? t.colors.primary : 'transparent'};
  transition: all 0.15s ease;
`

const Keypad = styled.div<{ $shake: boolean }>`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
  animation: ${({ $shake }) => ($shake ? shake : 'none')} 0.4s ease;
`

const Key = styled.button`
  height: 60px; border-radius: ${t.radius.md}; border: none;
  background: rgba(255,255,255,0.07);
  color: #fff; font-family: ${t.fonts.sans};
  font-size: 20px; font-weight: 400;
  cursor: pointer; transition: background 0.12s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
  display: flex; align-items: center; justify-content: center;

  &:hover  { background: rgba(255,255,255,0.12); }
  &:active { background: rgba(255,255,255,0.18); transform: scale(0.96); }

  &:disabled { opacity: 0.3; cursor: not-allowed; }

  @media (max-width: 400px) { height: 52px; font-size: 18px; }
`

const DeleteKey = styled(Key)`
  font-size: 14px;
  svg { width: 20px; height: 20px; stroke: currentColor; fill: none;
        stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
`

const ErrorMsg = styled.p`
  font-size: 12px; color: ${t.colors.danger};
  text-align: center; margin: 14px 0 0;
  min-height: 18px;
`

const AttemptsLeft = styled.p`
  font-size: 11px; color: rgba(255,255,255,0.3);
  text-align: center; margin: 8px 0 0;
`

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [pin, setPin]           = useState('')
  const [error, setError]       = useState(false)
  const [shaking, setShaking]   = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked]     = useState(false)
  const [authed, setAuthed]     = useState(false)

  // Check session on mount
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      setAuthed(true)
    }
  }, [])

  function pressKey(digit: string) {
    if (locked || pin.length >= 4) return
    const next = pin + digit
    setPin(next)
    setError(false)

    if (next.length === 4) {
      setTimeout(() => {
        if (next === ADMIN_PIN) {
          sessionStorage.setItem(SESSION_KEY, 'true')
          setAuthed(true)
        } else {
          const newAttempts = attempts + 1
          setAttempts(newAttempts)
          setError(true)
          setShaking(true)
          setTimeout(() => { setShaking(false); setPin('') }, 500)
          if (newAttempts >= 5) setLocked(true)
        }
      }, 120)
    }
  }

  function pressDelete() {
    setPin(p => p.slice(0, -1))
    setError(false)
  }

  if (authed) return <>{children}</>

  if (locked) {
    return (
      <Shell>
        <Box>
          <LogoRow>
            <LogoDot>
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </LogoDot>
          </LogoRow>
          <Title>Access Locked</Title>
          <Subtitle>Too many incorrect attempts. Please reload the page to try again.</Subtitle>
        </Box>
      </Shell>
    )
  }

  const KEYS = ['1','2','3','4','5','6','7','8','9','','0','del']

  return (
    <Shell>
      <Box>
        <LogoRow>
          <LogoDot>
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </LogoDot>
          <LogoText>
            <p>Emganwini</p>
            <p>Admin Portal</p>
          </LogoText>
        </LogoRow>

        <Title>Admin Access</Title>
        <Subtitle>Enter your 4-digit PIN to continue</Subtitle>

        <DotsRow>
          {[0,1,2,3].map(i => (
            <Dot key={i} $filled={i < pin.length} $error={error} />
          ))}
        </DotsRow>

        <Keypad $shake={shaking}>
          {KEYS.map((k, i) => {
            if (k === '') return <div key={i} />
            if (k === 'del') return (
              <DeleteKey key="del" onClick={pressDelete} disabled={pin.length === 0}>
                <svg viewBox="0 0 24 24"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
              </DeleteKey>
            )
            return (
              <Key key={k} onClick={() => pressKey(k)}>{k}</Key>
            )
          })}
        </Keypad>

        {error && <ErrorMsg>Incorrect PIN. {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining.</ErrorMsg>}
        {!error && <ErrorMsg />}
        {attempts > 0 && !error && <AttemptsLeft>{5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining</AttemptsLeft>}
      </Box>
    </Shell>
  )
}

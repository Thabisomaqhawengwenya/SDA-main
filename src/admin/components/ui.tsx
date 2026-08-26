import styled, { css, keyframes } from 'styled-components'
import { adminTheme as t } from '../adminTheme'

// ── Animations ────────────────────────────────────────────────────────────────

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`

// ── Page shell ────────────────────────────────────────────────────────────────

export const PageShell = styled.div`
  padding: 24px 28px;
  animation: ${fadeIn} 0.25s ease both;

  @media (max-width: 1024px) { padding: 20px 20px; }
  @media (max-width: 768px)  { padding: 16px 14px; }
  @media (max-width: 480px)  { padding: 12px 12px; }
`

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 16px;
  flex-wrap: wrap;
`

export const PageTitleBlock = styled.div``

export const PageTitle = styled.h1`
  font-family: ${t.fonts.sans};
  font-size: 22px;
  font-weight: 700;
  color: ${t.colors.text};
  letter-spacing: -0.02em;
  margin: 0;
`

export const PageSubtitle = styled.p`
  font-family: ${t.fonts.sans};
  font-size: 13px;
  color: ${t.colors.textMuted};
  margin: 4px 0 0;
`

export const PageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

// ── Section header inside a page ──────────────────────────────────────────────

export const SectionLabel = styled.p`
  font-family: ${t.fonts.sans};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${t.colors.textMuted};
  margin: 0 0 16px;
`

// ── Card ──────────────────────────────────────────────────────────────────────

export const Card = styled.div`
  background: ${t.colors.surface};
  border: 1px solid ${t.colors.border};
  border-radius: ${t.radius.lg};
  box-shadow: ${t.shadows.sm};
`

export const CardHeader = styled.div`
  padding: 20px 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const CardTitle = styled.h2`
  font-family: ${t.fonts.sans};
  font-size: 15px;
  font-weight: 600;
  color: ${t.colors.text};
  margin: 0;
`

export const CardBody = styled.div`
  padding: 20px 24px 24px;
  @media (max-width: 480px) { padding: 14px 14px 18px; }
`

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  color?: string
  colorLight?: string
}

const StatCardWrap = styled.div`
  background: ${t.colors.surface};
  border: 1px solid ${t.colors.border};
  border-radius: ${t.radius.lg};
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: ${t.shadows.sm};
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  &:hover { box-shadow: ${t.shadows.md}; transform: translateY(-2px); }
`

const StatTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

const StatIconWrap = styled.div<{ $color: string; $colorLight: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${t.radius.md};
  background: ${({ $colorLight }) => $colorLight};
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 18px; height: 18px;
    color: ${({ $color }) => $color};
    stroke: currentColor; fill: none;
    stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
  }
`

const StatValue = styled.p`
  font-family: ${t.fonts.sans};
  font-size: 30px;
  font-weight: 700;
  color: ${t.colors.text};
  letter-spacing: -0.03em;
  margin: 0;
  line-height: 1;
`

const StatLabel = styled.p`
  font-family: ${t.fonts.sans};
  font-size: 13px;
  color: ${t.colors.textMuted};
  margin: 4px 0 0;
`

const StatTrend = styled.span<{ $up?: boolean }>`
  font-family: ${t.fonts.sans};
  font-size: 12px;
  font-weight: 500;
  color: ${({ $up }) => ($up ? t.colors.success : t.colors.danger)};
`

export function StatCard({ label, value, icon, trend, trendUp,
  color = t.colors.primary, colorLight = t.colors.primaryLight }: StatCardProps) {
  return (
    <StatCardWrap>
      <StatTop>
        <StatIconWrap $color={color} $colorLight={colorLight}>{icon}</StatIconWrap>
      </StatTop>
      <div>
        <StatValue>{value}</StatValue>
        <StatLabel>{label}</StatLabel>
      </div>
      {trend && <StatTrend $up={trendUp}>{trend}</StatTrend>}
    </StatCardWrap>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'accent'

const badgeStyles: Record<BadgeVariant, string> = {
  default: `background:${t.colors.surfaceAlt};color:${t.colors.textSecondary};`,
  success: `background:${t.colors.successLight};color:${t.colors.success};`,
  warning: `background:${t.colors.warningLight};color:${t.colors.warning};`,
  danger:  `background:${t.colors.dangerLight};color:${t.colors.danger};`,
  info:    `background:${t.colors.infoLight};color:${t.colors.info};`,
  purple:  `background:${t.colors.purpleLight};color:${t.colors.purple};`,
  accent:  `background:${t.colors.accentLight};color:${t.colors.accent};`,
}

export const Badge = styled.span<{ $variant?: BadgeVariant }>`
  display: inline-flex; align-items: center; gap: 4px;
  font-family: ${t.fonts.sans}; font-size: 11px; font-weight: 600;
  letter-spacing: 0.04em; padding: 3px 9px;
  border-radius: ${t.radius.full}; white-space: nowrap;
  ${({ $variant = 'default' }) => badgeStyles[$variant]}
`

export function statusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    published: 'success', active: 'success', answered: 'success',
    replied: 'success', live: 'success',
    draft: 'default', inactive: 'default', archived: 'default', visitor: 'default',
    scheduled: 'info', upcoming: 'info', read: 'info',
    praying: 'warning', new: 'warning',
    cancelled: 'danger', urgent: 'danger',
    past: 'purple',
  }
  return map[status.toLowerCase()] ?? 'default'
}

// ── Button ────────────────────────────────────────────────────────────────────

export type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'

const btnBase = css`
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  font-family: ${t.fonts.sans}; font-size: 13px; font-weight: 600;
  border-radius: ${t.radius.md}; padding: 9px 18px;
  border: none; cursor: pointer; transition: all 0.15s ease;
  white-space: nowrap; text-decoration: none;
  svg { width:15px; height:15px; stroke:currentColor; fill:none; stroke-width:2;
        stroke-linecap:round; stroke-linejoin:round; flex-shrink:0; }
  &:disabled { opacity:0.5; cursor:not-allowed; }
`

const btnVariants: Record<BtnVariant, string> = {
  primary:   `background:${t.colors.primary};color:#fff;
    &:hover:not(:disabled){background:${t.colors.primaryDark};transform:translateY(-1px);
    box-shadow:0 4px 12px rgba(29,161,242,0.3);}`,
  secondary: `background:${t.colors.surfaceAlt};color:${t.colors.text};
    border:1px solid ${t.colors.border};
    &:hover:not(:disabled){background:${t.colors.border};}`,
  ghost:     `background:transparent;color:${t.colors.textSecondary};
    &:hover:not(:disabled){background:${t.colors.surfaceAlt};color:${t.colors.text};}`,
  danger:    `background:${t.colors.dangerLight};color:${t.colors.danger};
    &:hover:not(:disabled){background:${t.colors.danger};color:#fff;}`,
  success:   `background:${t.colors.successLight};color:${t.colors.success};
    &:hover:not(:disabled){background:${t.colors.success};color:#fff;}`,
}

export const Btn = styled.button<{ $variant?: BtnVariant; $size?: 'sm' | 'md' }>`
  ${btnBase}
  ${({ $variant = 'primary' }) => btnVariants[$variant]}
  ${({ $size }) => $size === 'sm' && 'font-size:12px;padding:6px 12px;'}
`

// ── Form elements ─────────────────────────────────────────────────────────────

export const FormGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols = 2 }) => $cols}, 1fr);
  gap: 0 20px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

export const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px;
`

export const Label = styled.label`
  font-family: ${t.fonts.sans}; font-size: 12px; font-weight: 600;
  color: ${t.colors.textSecondary}; letter-spacing: 0.04em;
`

const inputBase = css`
  font-family: ${t.fonts.sans}; font-size: 14px; color: ${t.colors.text};
  background: ${t.colors.surface}; border: 1px solid ${t.colors.border};
  border-radius: ${t.radius.md}; padding: 10px 14px; outline: none;
  transition: border-color 0.15s, box-shadow 0.15s; width: 100%;
  &::placeholder { color: ${t.colors.textMuted}; }
  &:focus { border-color: ${t.colors.primary};
    box-shadow: 0 0 0 3px ${t.colors.primaryLight}; }
`

export const Input    = styled.input`${inputBase}`
export const Textarea = styled.textarea`${inputBase} resize:vertical; min-height:90px;`
export const Select   = styled.select`${inputBase} cursor:pointer;`

// ── Search bar ────────────────────────────────────────────────────────────────

export const SearchWrap = styled.div`
  position: relative;
  svg { position:absolute; left:11px; top:50%; transform:translateY(-50%);
    width:15px; height:15px; stroke:${t.colors.textMuted};
    fill:none; stroke-width:2; stroke-linecap:round; pointer-events:none; }
`

export const SearchInput = styled.input`
  ${inputBase}
  padding-left: 36px;
  min-width: 220px;
`

// ── Table ─────────────────────────────────────────────────────────────────────

export const TableWrap = styled.div`
  overflow-x: auto; border-radius: ${t.radius.lg};
  border: 1px solid ${t.colors.border};
`

export const Table = styled.table`
  width: 100%; border-collapse: collapse;
  font-family: ${t.fonts.sans}; font-size: 13.5px;
`

export const Thead = styled.thead`background: ${t.colors.surfaceAlt};`

export const Th = styled.th`
  text-align: left; padding: 11px 16px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; color: ${t.colors.textMuted};
  border-bottom: 1px solid ${t.colors.border}; white-space: nowrap;
`

export const Tbody = styled.tbody``

export const Tr = styled.tr`
  border-bottom: 1px solid ${t.colors.border}; transition: background 0.12s;
  &:last-child { border-bottom: none; }
  &:hover { background: ${t.colors.surfaceAlt}; }
`

export const Td = styled.td`padding: 13px 16px; color: ${t.colors.text}; vertical-align: middle;`

// ── Modal ─────────────────────────────────────────────────────────────────────

const slideUp = keyframes`
  from { opacity:0; transform:translateY(16px) scale(0.98); }
  to   { opacity:1; transform:translateY(0) scale(1); }
`

export const ModalBox = styled.div<{ $width?: string }>`
  background: ${t.colors.surface}; border-radius: ${t.radius.xl};
  width: 100%; max-width: ${({ $width }) => $width ?? '540px'};
  max-height: 90vh; overflow-y: auto;
  box-shadow: ${t.shadows.xl}; animation: ${slideUp} 0.22s ease both;

  @media (max-width: 480px) {
    border-radius: ${t.radius.lg} ${t.radius.lg} 0 0;
    max-height: 92vh;
    margin-top: auto;
  }
`

export const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(15,23,42,0.55);
  backdrop-filter: blur(4px); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 20px;

  @media (max-width: 480px) {
    align-items: flex-end;
    padding: 0;
  }
`

export const ModalHead = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 24px 0; margin-bottom: 4px;
`

export const ModalTitle = styled.h3`
  font-family: ${t.fonts.sans}; font-size: 17px; font-weight: 700;
  color: ${t.colors.text}; margin: 0;
`

export const ModalBody = styled.div`padding: 16px 24px 8px;`

export const ModalFooter = styled.div`
  padding: 16px 24px; border-top: 1px solid ${t.colors.border};
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
`

export const CloseBtn = styled.button`
  width: 32px; height: 32px; border: none;
  background: ${t.colors.surfaceAlt}; border-radius: ${t.radius.md};
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: ${t.colors.textMuted}; transition: background 0.15s, color 0.15s;
  svg { width:16px; height:16px; stroke:currentColor; fill:none; stroke-width:2.5; }
  &:hover { background: ${t.colors.border}; color: ${t.colors.text}; }
`

// ── Empty state ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

const EmptyWrap = styled.div`
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; text-align: center;
  padding: 64px 24px; gap: 16px;
`

const EmptyIconWrap = styled.div`
  width: 56px; height: 56px; border-radius: ${t.radius.lg};
  background: ${t.colors.surfaceAlt}; display: flex;
  align-items: center; justify-content: center;
  svg { width:24px; height:24px; stroke:${t.colors.textMuted};
        fill:none; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; }
`

const EmptyTitle = styled.p`
  font-family: ${t.fonts.sans}; font-size: 15px; font-weight: 600;
  color: ${t.colors.text}; margin: 0;
`

const EmptyDesc = styled.p`
  font-family: ${t.fonts.sans}; font-size: 13px; color: ${t.colors.textMuted};
  margin: 0; max-width: 300px; line-height: 1.6;
`

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <EmptyWrap>
      <EmptyIconWrap>{icon}</EmptyIconWrap>
      <div>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDesc>{description}</EmptyDesc>
      </div>
      {action}
    </EmptyWrap>
  )
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

export const Skeleton = styled.div<{ $w?: string; $h?: string; $radius?: string }>`
  width: ${({ $w }) => $w ?? '100%'};
  height: ${({ $h }) => $h ?? '16px'};
  border-radius: ${({ $radius }) => $radius ?? t.radius.sm};
  background: linear-gradient(90deg, ${t.colors.border} 25%, ${t.colors.surfaceAlt} 50%, ${t.colors.border} 75%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease infinite;
`

// ── Divider ───────────────────────────────────────────────────────────────────

export const Divider = styled.hr`
  border: none; border-top: 1px solid ${t.colors.border}; margin: 20px 0;
`

// ── Avatar ────────────────────────────────────────────────────────────────────

export const Avatar = styled.div<{ $size?: number; $color?: string }>`
  width: ${({ $size = 36 }) => $size}px;
  height: ${({ $size = 36 }) => $size}px;
  border-radius: 50%;
  background: ${({ $color }) => $color ?? t.colors.primaryLight};
  color: ${t.colors.primary};
  font-family: ${t.fonts.sans};
  font-size: ${({ $size = 36 }) => Math.round($size * 0.38)}px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  img { width:100%; height:100%; object-fit:cover; }
`

// ── Tooltip-style info text ───────────────────────────────────────────────────

export const HelperText = styled.p`
  font-family: ${t.fonts.sans}; font-size: 12px;
  color: ${t.colors.textMuted}; margin: 2px 0 0; line-height: 1.5;
`

export const ErrorText = styled.p`
  font-family: ${t.fonts.sans}; font-size: 12px;
  color: ${t.colors.danger}; margin: 2px 0 0;
`

// ── Toolbar (filters row) ─────────────────────────────────────────────────────

export const Toolbar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; flex-wrap: wrap; margin-bottom: 16px;
`

export const ToolbarLeft  = styled.div`display:flex; align-items:center; gap:10px; flex-wrap:wrap;`
export const ToolbarRight = styled.div`display:flex; align-items:center; gap:10px; flex-wrap:wrap;`

// ── Confirmation dialog ───────────────────────────────────────────────────────

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmWrap = styled.div`
  padding: 8px 0 4px; display: flex; flex-direction: column; gap: 8px;
`

const ConfirmMessage = styled.p`
  font-family: ${t.fonts.sans}; font-size: 14px; color: ${t.colors.textSecondary};
  line-height: 1.6; margin: 0;
`

export function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <ModalOverlay onClick={onCancel}>
      <ModalBox $width="420px" onClick={e => e.stopPropagation()}>
        <ModalHead>
          <ModalTitle>{title}</ModalTitle>
          <CloseBtn onClick={onCancel}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></CloseBtn>
        </ModalHead>
        <ModalBody>
          <ConfirmWrap><ConfirmMessage>{message}</ConfirmMessage></ConfirmWrap>
        </ModalBody>
        <ModalFooter>
          <Btn $variant="ghost" onClick={onCancel}>Cancel</Btn>
          <Btn $variant="danger" onClick={onConfirm}>{confirmLabel}</Btn>
        </ModalFooter>
      </ModalBox>
    </ModalOverlay>
  )
}

// ── Grid layouts ──────────────────────────────────────────────────────────────

export const Grid2 = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`

export const Grid3 = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2,1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; gap: 12px; }
`

export const Grid4 = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2,1fr); }
  @media (max-width: 480px)  { grid-template-columns: repeat(2,1fr); gap: 10px; }
`

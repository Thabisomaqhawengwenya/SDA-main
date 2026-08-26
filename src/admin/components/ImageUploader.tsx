import { useState, useRef, useCallback } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { adminTheme as t } from '../adminTheme'
import { Label, FormGroup } from './ui'

// ── Animations ────────────────────────────────────────────────────────────────

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`

// ── Styled ────────────────────────────────────────────────────────────────────

const Dropzone = styled.div<{ $dragging: boolean; $hasImage: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 7;
  border-radius: ${t.radius.md};
  border: 2px dashed ${({ $dragging }) => ($dragging ? t.colors.primary : t.colors.border)};
  background: ${({ $dragging }) => ($dragging ? t.colors.primaryLight : t.colors.surfaceAlt)};
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 10px; cursor: pointer; overflow: hidden;
  transition: border-color 0.2s, background 0.2s;

  ${({ $hasImage }) => $hasImage && css`
    border-style: solid;
    border-color: ${t.colors.border};
    background: transparent;
  `}

  &:hover {
    border-color: ${t.colors.primary};
    background: ${({ $hasImage }) => $hasImage ? 'transparent' : t.colors.primaryLight};
  }
`

const Preview = styled.img`
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; display: block;
`

const Overlay = styled.div`
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 8px; opacity: 0; transition: opacity 0.2s;

  ${Dropzone}:hover & { opacity: 1; }
`

const UploadIcon = styled.div<{ $dragging: boolean }>`
  width: 44px; height: 44px; border-radius: ${t.radius.md};
  background: ${({ $dragging }) => ($dragging ? t.colors.primary : 'rgba(29,161,242,0.12)')} ;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
  ${({ $dragging }) => $dragging && css`animation: ${pulse} 0.8s ease infinite;`}

  svg {
    width: 22px; height: 22px;
    stroke: ${({ $dragging }) => ($dragging ? '#fff' : t.colors.primary)};
    fill: none; stroke-width: 2;
    stroke-linecap: round; stroke-linejoin: round;
  }
`

const UploadText = styled.div`
  text-align: center;
  p:first-child {
    font-family: ${t.fonts.sans}; font-size: 13px; font-weight: 600;
    color: ${t.colors.text}; margin: 0;
  }
  p:last-child {
    font-family: ${t.fonts.sans}; font-size: 11px;
    color: ${t.colors.textMuted}; margin: 3px 0 0;
  }
`

const OverlayText = styled.p`
  font-family: ${t.fonts.sans}; font-size: 13px; font-weight: 600;
  color: #fff; margin: 0;
`

const HiddenInput = styled.input`
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  opacity: 0; cursor: pointer;
`

const ActionRow = styled.div`
  display: flex; align-items: center; gap: 8px; margin-top: 10px;
  flex-wrap: wrap;
`

const SmallBtn = styled.button<{ $danger?: boolean }>`
  font-family: ${t.fonts.sans}; font-size: 12px; font-weight: 600;
  padding: 6px 14px; border-radius: ${t.radius.md}; border: none;
  cursor: pointer; transition: 0.15s;
  background: ${({ $danger }) => ($danger ? t.colors.dangerLight : t.colors.surfaceAlt)};
  color: ${({ $danger }) => ($danger ? t.colors.danger : t.colors.textSecondary)};
  -webkit-tap-highlight-color: transparent;
  &:hover {
    background: ${({ $danger }) => ($danger ? t.colors.danger : t.colors.border)};
    color: ${({ $danger }) => ($danger ? '#fff' : t.colors.text)};
  }
`

const UrlRow = styled.div`
  display: flex; gap: 8px; margin-top: 10px;
`

const UrlInput = styled.input`
  flex: 1; font-family: ${t.fonts.sans}; font-size: 13px;
  color: ${t.colors.text}; background: ${t.colors.surface};
  border: 1px solid ${t.colors.border}; border-radius: ${t.radius.md};
  padding: 8px 12px; outline: none; transition: border-color 0.15s;
  &::placeholder { color: ${t.colors.textMuted}; }
  &:focus { border-color: ${t.colors.primary}; box-shadow: 0 0 0 3px ${t.colors.primaryLight}; }
`

const ApplyBtn = styled.button`
  font-family: ${t.fonts.sans}; font-size: 12px; font-weight: 600;
  padding: 8px 14px; border-radius: ${t.radius.md}; border: none;
  background: ${t.colors.primary}; color: #fff; cursor: pointer;
  white-space: nowrap; transition: 0.15s;
  &:hover { background: ${t.colors.primaryDark}; }
`

const FileInfo = styled.p`
  font-family: ${t.fonts.sans}; font-size: 11px;
  color: ${t.colors.textMuted}; margin: 0;
`

// ── Props ─────────────────────────────────────────────────────────────────────

interface ImageUploaderProps {
  label?: string
  value?: string          // current image URL
  onChange: (url: string) => void
  aspectRatio?: string    // e.g. '16/7' or '16/9'
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ImageUploader({ label = 'Image', value, onChange, aspectRatio = '16 / 7' }: ImageUploaderProps) {
  const [dragging, setDragging]     = useState(false)
  const [showUrl, setShowUrl]       = useState(false)
  const [urlInput, setUrlInput]     = useState('')
  const [fileName, setFileName]     = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) onChange(e.target.result as string)
    }
    reader.readAsDataURL(file)
  }, [onChange])

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function applyUrl() {
    if (urlInput.trim()) { onChange(urlInput.trim()); setShowUrl(false); setUrlInput('') }
  }

  return (
    <FormGroup>
      <Label>{label}</Label>

      <Dropzone
        $dragging={dragging}
        $hasImage={!!value}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{ aspectRatio }}
      >
        {value && <Preview src={value} alt="Preview" />}

        {value ? (
          <Overlay>
            <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, stroke: '#fff', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <OverlayText>Replace image</OverlayText>
          </Overlay>
        ) : (
          <>
            <UploadIcon $dragging={dragging}>
              <svg viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </UploadIcon>
            <UploadText>
              <p>{dragging ? 'Drop image here' : 'Click or drag to upload'}</p>
              <p>PNG, JPG, WEBP — max 10MB</p>
            </UploadText>
          </>
        )}

        <HiddenInput
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          onClick={e => e.stopPropagation()}
        />
      </Dropzone>

      <ActionRow>
        {value && (
          <SmallBtn $danger onClick={e => { e.preventDefault(); onChange(''); setFileName('') }}>
            Remove
          </SmallBtn>
        )}
        <SmallBtn onClick={e => { e.preventDefault(); setShowUrl(v => !v) }}>
          {showUrl ? 'Cancel URL' : 'Use URL instead'}
        </SmallBtn>
        {fileName && !showUrl && <FileInfo>📎 {fileName}</FileInfo>}
      </ActionRow>

      {showUrl && (
        <UrlRow>
          <UrlInput
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyUrl()}
            autoFocus
          />
          <ApplyBtn onClick={e => { e.preventDefault(); applyUrl() }}>Apply</ApplyBtn>
        </UrlRow>
      )}
    </FormGroup>
  )
}

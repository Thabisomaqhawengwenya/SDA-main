import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { adminTheme as t } from '../adminTheme';
import { useAuth } from '../../context/AuthContext';

const ADMIN_PIN = '7429';
const SESSION_KEY = 'sda_admin_auth';

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-6px); }
  80%       { transform: translateX(6px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Shell = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  background: ${t.colors.sidebarBg};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: ${t.fonts.sans};
`;

const Box = styled.div`
  background: #1a2540;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${t.radius.xl};
  padding: 36px 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: ${t.shadows.xl};
  animation: ${fadeIn} 0.35s ease both;

  @media (max-width: 440px) {
    padding: 28px 20px;
    border-radius: ${t.radius.lg};
  }
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const LogoDot = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${t.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 18px;
    height: 18px;
    fill: #fff;
  }
`;

const LogoText = styled.div`
  p:first-child {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
  }
  p:last-child {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
  }
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  margin: 0 0 20px;
  line-height: 1.5;
`;

const Tabs = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${t.radius.md};
  padding: 4px;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  background: ${({ $active }) => ($active ? t.colors.primary : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : 'rgba(255,255,255,0.6)')};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #fff;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  height: 46px;
  background: #ffffff;
  color: #1a1a1a;
  border: none;
  border-radius: ${t.radius.md};
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  margin-bottom: 16px;

  &:hover {
    background: #f1f1f1;
  }
  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 16px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  span {
    padding: 0 10px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 42px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: ${t.radius.md};
  padding: 0 12px;
  color: #fff;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${t.colors.primary};
    background: rgba(255, 255, 255, 0.09);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 44px;
  background: ${t.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${t.radius.md};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 6px;

  &:hover {
    background: ${t.colors.primaryDark};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SwitchAuthMode = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;

  button {
    background: none;
    border: none;
    color: ${t.colors.primary};
    cursor: pointer;
    font-size: 12px;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const DotsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 24px;
`;

const Dot = styled.div<{ $filled: boolean; $error: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid
    ${({ $error, $filled }) =>
      $error ? t.colors.danger : $filled ? t.colors.primary : 'rgba(255,255,255,0.2)'};
  background: ${({ $error, $filled }) =>
    $error ? t.colors.danger : $filled ? t.colors.primary : 'transparent'};
  transition: all 0.15s ease;
`;

const Keypad = styled.div<{ $shake: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  animation: ${({ $shake }) => ($shake ? shake : 'none')} 0.4s ease;
`;

const Key = styled.button`
  height: 54px;
  border-radius: ${t.radius.md};
  border: none;
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
  font-size: 19px;
  cursor: pointer;
  transition: background 0.12s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
  &:active {
    background: rgba(255, 255, 255, 0.18);
    transform: scale(0.96);
  }
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const DeleteKey = styled(Key)`
  svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
  }
`;

const ErrorMsg = styled.p`
  font-size: 12px;
  color: ${t.colors.danger};
  text-align: center;
  margin: 12px 0 0;
  min-height: 18px;
`;

const SuccessMsg = styled.p`
  font-size: 12px;
  color: ${t.colors.success};
  text-align: center;
  margin: 12px 0 0;
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: ${t.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 20px auto;
`;

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } =
    useAuth();

  const [activeTab, setActiveTab] = useState<'firebase' | 'pin'>('firebase');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // PIN state
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [pinAuthed, setPinAuthed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      setPinAuthed(true);
    }
  }, []);

  // Handle PIN
  function pressKey(digit: string) {
    if (locked || pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setPinError(false);

    if (next.length === 4) {
      setTimeout(() => {
        if (next === ADMIN_PIN) {
          sessionStorage.setItem(SESSION_KEY, 'true');
          setPinAuthed(true);
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          setPinError(true);
          setShaking(true);
          setTimeout(() => {
            setShaking(false);
            setPin('');
          }, 500);
          if (newAttempts >= 5) setLocked(true);
        }
      }, 120);
    }
  }

  function pressDelete() {
    setPin((p) => p.slice(0, -1));
    setPinError(false);
  }

  // Handle Firebase Auth
  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setAuthError('');
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setAuthError(msg.replace('Firebase: ', ''));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      if (authMode === 'signin') {
        await signInWithEmail(email, password);
      } else if (authMode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else if (authMode === 'forgot') {
        await resetPassword(email);
        setAuthSuccess('Password reset link sent to your email!');
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setAuthError(msg.replace('Firebase: ', ''));
    } finally {
      setSubmitting(false);
    }
  };

  // If already authenticated via Firebase or PIN, allow access
  if (loading) {
    return (
      <Shell>
        <Box>
          <LogoRow>
            <LogoDot>
              <svg viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </LogoDot>
          </LogoRow>
          <Title>Loading Portal</Title>
          <Spinner />
        </Box>
      </Shell>
    );
  }

  if (user || pinAuthed) {
    return <>{children}</>;
  }

  if (locked) {
    return (
      <Shell>
        <Box>
          <LogoRow>
            <LogoDot>
              <svg viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </LogoDot>
          </LogoRow>
          <Title>Access Locked</Title>
          <Subtitle>Too many incorrect PIN attempts. Please reload or use Google Sign-in.</Subtitle>
          <GoogleButton onClick={handleGoogleSignIn}>
            <svg viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google
          </GoogleButton>
        </Box>
      </Shell>
    );
  }

  const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <Shell>
      <Box>
        <LogoRow>
          <LogoDot>
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </LogoDot>
          <LogoText>
            <p>Emganwini Main</p>
            <p>Admin Portal</p>
          </LogoText>
        </LogoRow>

        <Title>Admin Access</Title>
        <Subtitle>Sign in to manage the church website and operations</Subtitle>

        <Tabs>
          <TabButton $active={activeTab === 'firebase'} onClick={() => setActiveTab('firebase')}>
            Firebase Account
          </TabButton>
          <TabButton $active={activeTab === 'pin'} onClick={() => setActiveTab('pin')}>
            Quick PIN
          </TabButton>
        </Tabs>

        {activeTab === 'firebase' && (
          <div>
            <GoogleButton onClick={handleGoogleSignIn} disabled={submitting}>
              <svg viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign in with Google
            </GoogleButton>

            <Divider>
              <span>or email</span>
            </Divider>

            <Form onSubmit={handleEmailAuth}>
              {authMode === 'signup' && (
                <InputGroup>
                  <label>Full Name</label>
                  <Input
                    type="text"
                    placeholder="Pastor / Leader Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </InputGroup>
              )}

              <InputGroup>
                <label>Email Address</label>
                <Input
                  type="email"
                  placeholder="admin@emganwinisda.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>

              {authMode !== 'forgot' && (
                <InputGroup>
                  <label>Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
              )}

              <SubmitButton type="submit" disabled={submitting}>
                {submitting
                  ? 'Please wait...'
                  : authMode === 'signin'
                  ? 'Sign In with Email'
                  : authMode === 'signup'
                  ? 'Create Admin Account'
                  : 'Send Reset Link'}
              </SubmitButton>
            </Form>

            <SwitchAuthMode>
              {authMode === 'signin' ? (
                <>
                  <button onClick={() => setAuthMode('forgot')}>Forgot Password?</button>
                  <button onClick={() => setAuthMode('signup')}>Create Account</button>
                </>
              ) : (
                <button onClick={() => setAuthMode('signin')}>← Back to Sign In</button>
              )}
            </SwitchAuthMode>

            {authError && <ErrorMsg>{authError}</ErrorMsg>}
            {authSuccess && <SuccessMsg>{authSuccess}</SuccessMsg>}
          </div>
        )}

        {activeTab === 'pin' && (
          <div>
            <DotsRow>
              {[0, 1, 2, 3].map((i) => (
                <Dot key={i} $filled={i < pin.length} $error={pinError} />
              ))}
            </DotsRow>

            <Keypad $shake={shaking}>
              {KEYS.map((k, i) => {
                if (k === '') return <div key={i} />;
                if (k === 'del')
                  return (
                    <DeleteKey key="del" onClick={pressDelete} disabled={pin.length === 0}>
                      <svg viewBox="0 0 24 24">
                        <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                        <line x1="18" y1="9" x2="12" y2="15" />
                        <line x1="12" y1="9" x2="18" y2="15" />
                      </svg>
                    </DeleteKey>
                  );
                return (
                  <Key key={k} onClick={() => pressKey(k)}>
                    {k}
                  </Key>
                );
              })}
            </Keypad>

            {pinError && (
              <ErrorMsg>
                Incorrect PIN. {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining.
              </ErrorMsg>
            )}
            {!pinError && <ErrorMsg />}
          </div>
        )}
      </Box>
    </Shell>
  );
}

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
  max-width: 420px;
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
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${t.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 20px;
    height: 20px;
    fill: #fff;
  }
`;

const LogoText = styled.div`
  p:first-child {
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
  }
  p:last-child {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
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
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  margin: 0 0 20px;
  line-height: 1.5;
`;

const Tabs = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.06);
  border-radius: ${t.radius.md};
  padding: 4px;
  margin-bottom: 22px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  background: ${({ $active }) => ($active ? t.colors.primary : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : 'rgba(255,255,255,0.65)')};
  border: none;
  border-radius: 6px;
  padding: 9px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #fff;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
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
  transition: border-color 0.2s, background 0.2s;

  &:focus {
    border-color: ${t.colors.primary};
    background: rgba(255, 255, 255, 0.09);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }
`;

const HelperText = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
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
  transition: background 0.15s, transform 0.1s;
  margin-top: 4px;

  &:hover {
    background: ${t.colors.primaryDark};
  }
  &:active {
    transform: scale(0.99);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SwitchAuthMode = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  font-size: 12px;

  button {
    background: none;
    border: none;
    color: ${t.colors.primary};
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const QuickPinBypassBtn = styled.button`
  width: 100%;
  margin-top: 14px;
  padding: 10px 14px;
  background: rgba(29, 161, 242, 0.1);
  border: 1px dashed rgba(29, 161, 242, 0.35);
  border-radius: ${t.radius.md};
  color: ${t.colors.primary};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: rgba(29, 161, 242, 0.18);
    border-color: ${t.colors.primary};
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
  height: 52px;
  border-radius: ${t.radius.md};
  border: none;
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
  font-size: 19px;
  font-weight: 600;
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

const ErrorBox = styled.div`
  font-size: 12px;
  color: #ff8080;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${t.radius.md};
  padding: 10px 12px;
  margin-top: 14px;
  line-height: 1.5;
  text-align: left;
`;

const SuccessMsg = styled.p`
  font-size: 12px;
  color: ${t.colors.success};
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: ${t.radius.md};
  padding: 10px 12px;
  text-align: center;
  margin: 14px 0 0;
  line-height: 1.5;
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

function parseAuthErrorMessage(err: unknown): string {
  if (!err) return 'An error occurred during authentication.';
  const rawMsg = err instanceof Error ? err.message : String(err);

  if (rawMsg.includes('auth/operation-not-allowed') || rawMsg.includes('OPERATION_NOT_ALLOWED')) {
    return 'Email/Password sign-in is disabled in your Firebase console. Please enable it in Firebase Console → Authentication → Sign-in method, or use the Quick PIN tab (7429) to sign in immediately.';
  }
  if (rawMsg.includes('auth/weak-password')) {
    return 'Password must be at least 6 characters long.';
  }
  if (rawMsg.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Please click "Sign In" instead of "Create Account".';
  }
  if (rawMsg.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (rawMsg.includes('auth/user-not-found')) {
    return 'No account found with this email. Click "Create Account" below to register.';
  }
  if (rawMsg.includes('auth/wrong-password') || rawMsg.includes('auth/invalid-credential')) {
    return 'Incorrect email or password. Please verify your credentials or use the Quick PIN.';
  }
  if (rawMsg.includes('auth/network-request-failed')) {
    return 'Network error: could not connect to Firebase. Please check your internet connection.';
  }
  if (rawMsg.includes('auth/too-many-requests')) {
    return 'Too many attempts. Access is temporarily restricted. Please use Quick PIN (7429) to enter.';
  }

  return rawMsg.replace('Firebase: ', '').replace(/\(auth\/[a-z-]+\)\.?/i, '').trim();
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();

  const [activeTab, setActiveTab] = useState<'email' | 'pin'>('email');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  function enterViaQuickPinDirectly() {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setPinAuthed(true);
  }

  // Handle Email Auth
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setAuthError('');
    setAuthSuccess('');

    // Client-side validations
    if (authMode !== 'forgot') {
      if (password.length < 6) {
        setAuthError('Password must be at least 6 characters long.');
        return;
      }
      if (authMode === 'signup' && password !== confirmPassword) {
        setAuthError('Passwords do not match. Please re-enter your password.');
        return;
      }
    }

    setSubmitting(true);

    try {
      if (authMode === 'signin') {
        await signInWithEmail(email, password);
      } else if (authMode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else if (authMode === 'forgot') {
        await resetPassword(email);
        setAuthSuccess('Password reset link sent to your email! Please check your inbox.');
      }
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      setAuthError(parseAuthErrorMessage(err));
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
          <Title>PIN Locked</Title>
          <Subtitle>Too many incorrect PIN attempts. Please sign in with your email account or unlock.</Subtitle>
          <SubmitButton
            type="button"
            onClick={() => {
              setLocked(false);
              setAttempts(0);
              setPin('');
              setActiveTab('email');
            }}
          >
            Sign in with Email Account
          </SubmitButton>
          <QuickPinBypassBtn
            type="button"
            onClick={() => {
              setLocked(false);
              setAttempts(0);
              setPin('');
              enterViaQuickPinDirectly();
            }}
            style={{ marginTop: '12px' }}
          >
            🔑 Unlock with Default PIN (7429)
          </QuickPinBypassBtn>
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
        <Subtitle>Sign in to manage church operations and updates</Subtitle>

        <Tabs>
          <TabButton $active={activeTab === 'email'} onClick={() => setActiveTab('email')}>
            {authMode === 'signup' ? 'Create Account' : authMode === 'forgot' ? 'Reset Password' : 'Email Sign In'}
          </TabButton>
          <TabButton $active={activeTab === 'pin'} onClick={() => setActiveTab('pin')}>
            Quick PIN (7429)
          </TabButton>
        </Tabs>

        {activeTab === 'email' && (
          <div>
            <Form onSubmit={handleEmailAuth}>
              {authMode === 'signup' && (
                <InputGroup>
                  <label>Full Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. Pastor / Elder Name"
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
                  {authMode === 'signup' && <HelperText>Must be at least 6 characters</HelperText>}
                </InputGroup>
              )}

              {authMode === 'signup' && (
                <InputGroup>
                  <label>Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <button type="button" onClick={() => { setAuthMode('forgot'); setAuthError(''); setAuthSuccess(''); }}>
                    Forgot Password?
                  </button>
                  <button type="button" onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthSuccess(''); }}>
                    Create Account
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => { setAuthMode('signin'); setAuthError(''); setAuthSuccess(''); }}>
                  ← Back to Sign In
                </button>
              )}
            </SwitchAuthMode>

            {authError && (
              <>
                <ErrorBox>{authError}</ErrorBox>
                <QuickPinBypassBtn type="button" onClick={enterViaQuickPinDirectly}>
                  🔑 Enter Instantly with PIN (7429)
                </QuickPinBypassBtn>
              </>
            )}

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
              <ErrorBox style={{ textAlign: 'center' }}>
                Incorrect PIN. {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining.
              </ErrorBox>
            )}

            <QuickPinBypassBtn
              type="button"
              onClick={enterViaQuickPinDirectly}
              style={{ marginTop: '16px' }}
            >
              🔑 Enter Dashboard (PIN: 7429)
            </QuickPinBypassBtn>
          </div>
        )}
      </Box>
    </Shell>
  );
}

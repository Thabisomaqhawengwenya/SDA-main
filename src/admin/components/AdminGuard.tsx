import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { adminTheme as t } from '../adminTheme';
import { useAuth } from '../../context/AuthContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(14px); }
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
  padding: 38px 34px;
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
  gap: 12px;
  margin-bottom: 22px;
`;

const LogoDot = styled.div`
  width: 40px;
  height: 40px;
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
  font-size: 21px;
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
  margin: 0 0 24px;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.75);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const PasswordWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: ${t.radius.md};
  padding: 0 14px;
  color: #fff;
  font-size: 14px;
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

const TogglePasswordBtn = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }

  svg {
    width: 17px;
    height: 17px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
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

const ForgotPasswordRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;

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

const BackToSignInBtn = styled.button`
  background: none;
  border: none;
  color: ${t.colors.primary};
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  padding: 0;
  margin-top: 14px;
  display: block;
  text-align: center;
  width: 100%;

  &:hover {
    text-decoration: underline;
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

  if (rawMsg.includes('auth/wrong-password') || rawMsg.includes('auth/invalid-credential') || rawMsg.includes('auth/invalid-login-credentials')) {
    return 'Incorrect email or password. Please verify your administrator credentials.';
  }
  if (rawMsg.includes('auth/user-not-found')) {
    return 'No administrator account found with this email. Please contact the Super Admin.';
  }
  if (rawMsg.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (rawMsg.includes('auth/network-request-failed')) {
    return 'Network connection error. Please check your internet connection.';
  }
  if (rawMsg.includes('auth/too-many-requests')) {
    return 'Too many failed attempts. Please wait a moment before trying again.';
  }

  return rawMsg.replace('Firebase: ', '').replace(/\(auth\/[a-z-]+\)\.?/i, '').trim();
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, adminProfile, loading, signInWithEmail, resetPassword } = useAuth();

  const [mode, setMode] = useState<'signin' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Check if authenticated
  const isAuthed = !!(user || adminProfile || sessionStorage.getItem('sda_admin_auth') === 'true');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setAuthError('');
    setAuthSuccess('');
    setSubmitting(true);

    try {
      await signInWithEmail(email, password);
    } catch (err: unknown) {
      console.error('Sign-in error:', err);
      setAuthError(parseAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setAuthError('');
    setAuthSuccess('');
    setSubmitting(true);

    try {
      await resetPassword(email);
      setAuthSuccess('Password reset link sent to your email. Please check your inbox.');
    } catch (err: unknown) {
      console.error('Password reset error:', err);
      setAuthError(parseAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

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

  if (isAuthed) {
    return <>{children}</>;
  }

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

        <Title>{mode === 'signin' ? 'Admin Sign In' : 'Reset Password'}</Title>
        <Subtitle>
          {mode === 'signin'
            ? 'Enter your administrative credentials to continue'
            : 'Enter your email to receive a password reset link'}
        </Subtitle>

        {mode === 'signin' ? (
          <Form onSubmit={handleSignIn}>
            <InputGroup>
              <label>Email Address</label>
              <Input
                type="email"
                placeholder="admin@emganwinisda.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </InputGroup>

            <InputGroup>
              <label>Password</label>
              <PasswordWrap>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <TogglePasswordBtn
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </TogglePasswordBtn>
              </PasswordWrap>
            </InputGroup>

            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Authenticating...' : 'Sign In to Admin Portal'}
            </SubmitButton>

            <ForgotPasswordRow>
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setAuthError('');
                  setAuthSuccess('');
                }}
              >
                Forgot Password?
              </button>
            </ForgotPasswordRow>
          </Form>
        ) : (
          <Form onSubmit={handleForgotPassword}>
            <InputGroup>
              <label>Email Address</label>
              <Input
                type="email"
                placeholder="admin@emganwinisda.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </SubmitButton>

            <BackToSignInBtn
              type="button"
              onClick={() => {
                setMode('signin');
                setAuthError('');
                setAuthSuccess('');
              }}
            >
              ← Back to Sign In
            </BackToSignInBtn>
          </Form>
        )}

        {authError && <ErrorBox>{authError}</ErrorBox>}
        {authSuccess && <SuccessMsg>{authSuccess}</SuccessMsg>}
      </Box>
    </Shell>
  );
}

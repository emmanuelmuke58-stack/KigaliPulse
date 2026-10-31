import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { EnterpriseUser } from '../../types/admin';

interface AdminAuthProps {
  onLoginSuccess: (user: EnterpriseUser) => void;
  onExitToPublic: () => void;
  initialUser: EnterpriseUser;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({
  onLoginSuccess,
  onExitToPublic,
  initialUser,
}) => {
  // Screen state: 'login' | 'forgot' | 'reset' | 'reset-success'
  const [authScreen, setAuthScreen] = useState<'login' | 'forgot' | 'reset' | 'reset-success'>('login');

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState('emmanuelmuke58@gmail.com');
  const [password, setPassword] = useState('AdminPass2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot / Reset states
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validations
    if (!emailOrPhone.trim()) {
      setErrorMessage('Please enter your administrator email or phone number.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    // Basic format check
    if (emailOrPhone.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone.trim())) {
      setErrorMessage('Please enter a valid administrative email address format.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Mock validation
      if (password.length < 4) {
        setErrorMessage('Incorrect password. Please verify your credentials or reset your password.');
        return;
      }

      // Successful login
      onLoginSuccess({
        ...initialUser,
        email: emailOrPhone.includes('@') ? emailOrPhone.trim() : initialUser.email,
        lastLogin: 'Just now (Active Session)',
      });
    }, 500);
  };

  // Quick Demo fill
  const handleQuickDemoFill = (role: 'super' | 'admin' | 'moderator') => {
    setErrorMessage(null);
    if (role === 'super') {
      setEmailOrPhone('emmanuelmuke58@gmail.com');
      setPassword('AdminPass2026!');
    } else if (role === 'admin') {
      setEmailOrPhone('claudine@techinnovate.africa');
      setPassword('AdminPass2026!');
    } else {
      setEmailOrPhone('david.k@kigaliculture.gov.rw');
      setPassword('AdminPass2026!');
    }
  };

  // Forgot password submission
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMessage('Please enter a valid registered email address.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthScreen('reset');
    }, 500);
  };

  // Reset password submission
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters with numbers and symbols.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthScreen('reset-success');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background Ambience & Clean Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      </div>

      {/* Top Header / Exit to Public Site */}
      <header className="relative z-10 p-4 sm:p-6 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-2">
                <span>KigaliPulse</span>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  Enterprise Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Governance &amp; Executive Operations</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExitToPublic}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Portal</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* SCREEN 1: LOGIN */}
          {authScreen === 'login' && (
            <div>
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Sign in to access your administrative account
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email / Phone Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address or Phone Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="admin@kigalipulse.rw or +250 78..."
                      className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage(null);
                        setAuthScreen('forgot');
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 font-medium">Remember Me</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Encrypted 256-bit TLS</span>
                </div>

                {/* Primary Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] font-bold text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      onLoginSuccess(initialUser);
                    }, 500);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  <span>Continue with Enterprise Google</span>
                </button>
              </form>

              {/* Demo Credentials Quick Switcher */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Quick Demo Credentials:</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill('super')}
                    className="py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                  >
                    Super Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill('admin')}
                    className="py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                  >
                    Platform Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill('moderator')}
                    className="py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                  >
                    Moderator
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: FORGOT PASSWORD */}
          {authScreen === 'forgot' && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setAuthScreen('login');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1.5 mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-emerald-600">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Reset Account Password</h2>
                <p className="text-xs text-slate-600 mt-1">
                  Enter your registered administrator email and we will send you secure recovery instructions.
                </p>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Administrative Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="admin@kigalipulse.rw"
                      className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  {isLoading ? 'Sending Link...' : 'Send Recovery Link'}
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 3: RESET PASSWORD FORM */}
          {authScreen === 'reset' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-3 text-blue-600">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Set New Password</h2>
                <p className="text-xs text-slate-600 mt-1">
                  Create a strong password with at least 8 characters.
                </p>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>

                {/* Password strength bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Password Strength</span>
                    <span className={newPassword.length >= 8 ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                      {newPassword.length >= 10 ? 'Strong' : newPassword.length >= 6 ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        newPassword.length >= 10
                          ? 'w-full bg-emerald-600'
                          : newPassword.length >= 6
                          ? 'w-2/3 bg-amber-500'
                          : 'w-1/3 bg-rose-500'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  {isLoading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 4: PASSWORD RESET SUCCESS */}
          {authScreen === 'reset-success' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Password Updated!</h2>
              <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto">
                Your credentials have been securely updated. You can now log into your administrator account.
              </p>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setAuthScreen('login');
                }}
                className="mt-6 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs sm:text-sm text-white transition-all shadow-md shadow-emerald-600/20"
              >
                Return to Sign In
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Copyright Footer */}
      <footer className="relative z-10 p-6 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white/50">
        <p>&copy; {new Date().getFullYear()} KigaliPulse Media &amp; Tech Group Ltd. Enterprise Platform Edition.</p>
        <p className="text-[11px] text-slate-400 mt-1">Authorized Administrative Access Only · Protected by Law</p>
      </footer>
    </div>
  );
};

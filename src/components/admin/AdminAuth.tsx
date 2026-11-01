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
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { EnterpriseUser } from '../../types/admin';

interface AdminAuthProps {
  onLoginSuccess: (user: EnterpriseUser) => void;
  onExitToPublic: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({
  onLoginSuccess,
  onExitToPublic,
}) => {
  const [authScreen, setAuthScreen] = useState<'login' | 'forgot' | 'reset-success'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login, resetPassword, currentUser: authUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your administrative email and password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      // The parent AdminSystem uses the context authUser to decide what to show
      // But we need to ensure the user has the right role
      if (authUser && authUser.role !== 'SuperAdmin') {
        throw new Error('Access denied: You do not have SuperAdmin privileges.');
      }
      onLoginSuccess({} as any); // Trigger success in parent
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(email);
      setAuthScreen('reset-success');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 uppercase">KigaliPulse</span>
        </div>
        <button
          type="button"
          onClick={onExitToPublic}
          className="text-base font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Exit to Public Portal</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px]">
          {/* Card */}
          <div className="bg-white border border-slate-200/60 rounded-[32px] p-8 sm:p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]">
            
            {/* Transition Screens */}
            {authScreen === 'login' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Admin Login</h1>
                  <p className="text-slate-500 text-base font-medium">Access the KigaliPulse enterprise ecosystem.</p>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-start gap-3 text-base animate-in zoom-in-95 duration-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="font-semibold leading-relaxed">{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-base font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@kigalipulse.rw"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-base font-bold text-slate-400 uppercase tracking-widest">Password</label>
                      <button
                        type="button"
                        onClick={() => setAuthScreen('forgot')}
                        className="text-base font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl pl-12 pr-12 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 p-1"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-slate-900/10 disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Secure Sign In</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {authScreen === 'forgot' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Reset Password</h2>
                  <p className="text-slate-500 text-base font-medium">We'll send recovery instructions to your email.</p>
                </div>

                <form onSubmit={handleForgotSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-base font-bold text-slate-400 uppercase tracking-widest px-1">Admin Email</label>
                    <div className="relative group">
                      <Mail className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        type="email"
                        required
                        placeholder="admin@kigalipulse.rw"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthScreen('login')}
                    className="w-full text-center text-base font-bold text-slate-500 hover:text-slate-800 transition-colors pt-2"
                  >
                    Back to Login
                  </button>
                </form>
              </div>
            )}

            {authScreen === 'reset-success' && (
              <div className="text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-[32px] bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Check Your Inbox</h2>
                <p className="text-slate-500 text-base font-medium mb-10 leading-relaxed px-4">
                  If an account exists for that email, we've sent instructions to reset your password.
                </p>

                <button
                  type="button"
                  onClick={() => setAuthScreen('login')}
                  className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xl shadow-slate-900/10"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <p className="text-[15px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">KigaliPulse Enterprise Security</p>
            <div className="flex items-center justify-center gap-4 text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[14px] font-bold">SHA-256 AES</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[14px] font-bold">Bcrypt Hashing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[14px] font-bold">HTTP-Only SSL</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-8 text-center text-[15px] font-semibold text-slate-400 tracking-wide uppercase opacity-50">
        &copy; {new Date().getFullYear()} KigaliPulse Group · Authorized Access Only
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Phone, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginViewProps {
  onLoginSuccess: (user: any) => void;
  onCancel: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onCancel }) => {
  const { t } = useLanguage();
  const { login, register, resetPassword } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [isReset, setIsReset] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isReset) {
        await resetPassword(email);
        setSuccess('Password reset link sent! Please check your email.');
      } else if (isRegister) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await register({ email, pass: password, firstName, lastName, phone });
        onLoginSuccess(null);
      } else {
        await login(email, password);
        onLoginSuccess(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-slate-900 p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="w-24 h-24 text-emerald-400" />
          </div>
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white">
            {isReset ? 'Reset Password' : (isRegister ? 'Join KigaliPulse' : 'Welcome Back')}
          </h2>
          <p className="text-slate-400 text-base mt-1">
            {isReset 
              ? 'Enter your email to receive a secure reset link' 
              : (isRegister ? 'Create an account to discover and host events' : 'Sign in to manage your events and bookings')}
          </p>

          {!isReset && (
            <div className="flex items-center justify-center gap-2 mt-6 p-1.5 bg-white/10 rounded-2xl">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(null); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  !isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'
                }`}
              >
                {t('auth.login')}
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(null); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'
                }`}
              >
                {t('auth.signup')}
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold animate-shake">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {success}
            </div>
          )}

          {isRegister && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base"
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+250 788 000 000"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base"
                />
              </div>
            </div>
          )}

          {!isReset && (
            <>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                  {!isRegister && (
                    <button 
                      type="button" 
                      onClick={() => setIsReset(true)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-tighter"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-slate-900 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/10 flex items-center justify-center gap-3 transition-all active:scale-[0.98] mt-4"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm font-black uppercase tracking-widest">Processing...</span>
              </div>
            ) : (
              <>
                <span className="font-black uppercase tracking-widest text-sm">
                  {isReset ? 'Send Recovery Link' : (isRegister ? 'Establish Account' : 'Authorize Session')}
                </span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="pt-2 text-center space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setIsReset(false);
                setError(null);
                setSuccess(null);
              }}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors block w-full uppercase tracking-tighter"
            >
              {isRegister ? 'Already have an account? Sign in here' : "Need an account? Join the Kigali community"}
            </button>
            
            {isReset && (
              <button
                type="button"
                onClick={() => setIsReset(false)}
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 block w-full uppercase tracking-tighter"
              >
                Return to Login
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="w-full text-xs font-black text-slate-400 hover:text-slate-600 py-2 uppercase tracking-[0.2em]"
            >
              Cancel & Exit to Public Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AISuggestionCard: React.FC = () => {
  const [mood, setMood] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestion = async () => {
    if (!mood.trim()) return;
    
    setLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, context: 'Exploring Kigali this week.' }),
      });

      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (err: any) {
      setError('Sorry, I couldn\'t get suggestions right now. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-500/20 p-2 rounded-xl">
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="font-black text-lg tracking-tight">KigaliPulse AI</h3>
      </div>

      {!suggestion && !loading && (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Tell me how you're feeling or what you're in the mood for, and I'll find the perfect Kigali experience for you.
          </p>
          <div className="relative">
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g. I want something chill with live music..."
              className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500"
              onKeyDown={(e) => e.key === 'Enter' && handleGetSuggestion()}
            />
            <button
              onClick={handleGetSuggestion}
              disabled={!mood.trim()}
              className="absolute right-2 top-2 p-2 bg-emerald-500 rounded-xl text-slate-900 disabled:opacity-50 transition-all hover:bg-emerald-400"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Romantic', 'Party mode', 'Family day', 'Tech focused'].map((tag) => (
              <button
                key={tag}
                onClick={() => setMood(tag)}
                className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-4"
          >
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Curating your Kigali experiences...</p>
          </motion.div>
        )}

        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {suggestion}
              </p>
            </div>
            <button
              onClick={() => {
                setSuggestion(null);
                setMood('');
              }}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Ask something else
            </button>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center"
          >
            <p className="text-xs text-red-400 font-medium">{error}</p>
            <button
              onClick={handleGetSuggestion}
              className="mt-2 text-[10px] font-bold uppercase tracking-widest text-white underline"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

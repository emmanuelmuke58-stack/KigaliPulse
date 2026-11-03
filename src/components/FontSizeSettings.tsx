import React from 'react';
import { Save, Sparkles } from 'lucide-react';
import { useFontSize } from '../contexts/FontSizeContext';

interface FontSizeSettingsProps {
  onTriggerToast?: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const FontSizeSettings: React.FC<FontSizeSettingsProps> = ({ onTriggerToast }) => {
  const { fontSize, preset, setFontSize, setPreset, resetToDefault, savePreferences } = useFontSize();

  const handleSave = async () => {
    await savePreferences();
    if (onTriggerToast) {
      onTriggerToast('success', 'Font Size Saved', 'Your typography preferences have been stored.');
    } else {
      alert('Font size preferences saved!');
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl shadow-xs">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-emerald-600" />
        <div>
          <h3 className="text-lg font-bold text-slate-900">Font Size Management</h3>
          <p className="text-base text-slate-600">Customize the typography scale for your personal dashboard experience.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. Presets */}
        <div className="space-y-3">
          <label className="block text-base font-bold text-slate-700">Typography Presets</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'small', label: 'Small', size: '13px' },
              { id: 'default', label: 'Default', size: '16px' },
              { id: 'large', label: 'Large', size: '18px' },
              { id: 'xl', label: 'Extra Large', size: '22px' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.id as any)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  preset === p.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                }`}
              >
                <span className="text-sm font-bold">{p.label}</span>
                <span className="text-xs opacity-60 mt-1">{p.size}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Custom Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-base font-bold text-slate-700">Custom Font Size</label>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm">
              {fontSize}px
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-400">12px</span>
            <input
              type="range"
              min="12"
              max="26"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-xs font-medium text-slate-400">26px</span>
          </div>
        </div>

        {/* 3. Live Preview */}
        <div className="space-y-3">
          <label className="block text-base font-bold text-slate-700">Live Preview</label>
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <p className="font-bold text-slate-900">Preview Heading</p>
            <p className="text-slate-600 leading-relaxed">
              The quick brown fox jumps over the lazy dog. KigaliPulse is Rwanda's premier event discovery platform. 
              This preview shows how your chosen font size affects readability across the dashboard components.
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold">Primary Button</button>
              <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold">Secondary</button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={resetToDefault}
          className="text-base font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
        >
          Reset to Default
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

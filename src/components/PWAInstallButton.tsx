import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Share } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-slate-800 transition-all transform hover:scale-105 active:scale-95"
      >
        <Download className="w-4 h-4" />
        Install KigaliPulse
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50 transition-all"
        >
          <Download className="w-4 h-4" />
          Install on iOS
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-100 p-3 rounded-2xl">
                  <Download className="w-6 h-6 text-slate-900" />
                </div>
                <button 
                  onClick={() => setShowIOSGuide(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-4">Install on iPhone</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">1</div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Tap the <span className="inline-flex items-center bg-slate-100 px-2 py-1 rounded font-bold text-slate-900"><Share className="w-3 h-3 mr-1" /> Share</span> icon in the Safari toolbar.
                  </p>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">2</div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Scroll down and tap <span className="font-bold text-slate-900">Add to Home Screen</span>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-8 w-full rounded-2xl bg-slate-900 py-4 text-sm font-black text-white hover:bg-slate-800 transition-colors shadow-xl"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

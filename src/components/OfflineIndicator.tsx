import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-4 right-4 z-[90] sm:left-auto sm:right-6 sm:w-80"
        >
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-800">
            <div className="bg-amber-500 p-2 rounded-xl">
              <WifiOff className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="font-bold text-sm">You are offline</p>
              <p className="text-xs text-slate-400">Viewing cached events and data.</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

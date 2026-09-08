import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ScanCamera({ onScan, onClose }) {
  const [hasScanned, setHasScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (hasScanned) return;

    const Scanner = window.instascan || require('instascan');
    const scanner = new Scanner({
      video: videoRef.current,
      mirror: false,
      scanPeriod: 0.5,
    });

    scanner.addListener('found', (code) => {
      setScannedData(code.text);
      setHasScanned(true);
      scanner.stop();
      onScan(code.text);
    });

    scanner.start(videoRef.current);
    return () => scanner.stop();
  }, [onScan, hasScanned]);

  if (hasScanned) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#16181F] border border-white/[0.12] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M1 12h2M4.93 4.93l1.41 1.41M15.73 15.73l1.41 1.41M1 21v-2M21 12h-2M4.93 19.07l1.41-1.41M15.73 8.27l1.41-1.41" />
            </svg>
            <h3 className="text-base font-bold text-cream">Direct Camera Scan</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-cream/60 hover:text-white transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative h-64 rounded-2xl overflow-hidden border border-white/[0.12]">
          <video ref={videoRef} className="w-full h-full object-cover" autoplay playsInline />
          {hasScanned && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-emerald-400 text-3xl font-bold">✓ Scanned!</span>
            </div>
          )}
        </div>

        {scannedData && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
            <strong>Result:</strong> {scannedData}
          </div>
        )}

        <button
          onClick={() => {
            if (scannedData && onScan) {
              onScan(scannedData);
            }
            onClose();
          }}
          disabled={!scannedData}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-[#121316] font-bold text-sm shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14 8 14" />
          </svg>
          <span>Add to Log</span>
        </button>

        <button onClick={onClose} className="mt-4 w-full py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream/60 transition-colors cursor-pointer">
          Close
        </button>
      </motion.div>
    </div>
  );
}
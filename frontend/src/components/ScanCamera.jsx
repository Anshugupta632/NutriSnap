import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ScanCamera({ onScan, onClose }) {
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyzedData, setAnalyzedData] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize camera stream
  useEffect(() => {
    let activeStream = null;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        // Fallback for devices without strict facingMode support
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          activeStream = fallbackStream;
          setStream(fallbackStream);

          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
          }
        } catch (fallbackErr) {
          setError('Camera access denied or unreadable.');
        }
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture frame from video feed and post to backend vision API
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setLoading(true);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL('image/jpeg', 0.85);

    try {
      const response = await fetch('/api/meals/analyze-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze meal.');
      }

      setAnalyzedData(result);
      if (onScan) {
        onScan(result);
      }
    } catch (err) {
      setError(err.message || 'Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-[#16181F] border border-white/[0.12] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">AI Food Vision Scan</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Camera Viewport */}
          <div className="relative h-64 rounded-2xl overflow-hidden border border-white/[0.12] bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Target Ring */}
            {!loading && !analyzedData && !error && (
              <div className="absolute inset-0 border-2 border-dashed border-emerald-400/40 rounded-2xl m-4 pointer-events-none flex items-center justify-center">
                <span className="text-xs text-emerald-300/80 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                  Center food in frame
                </span>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-emerald-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span className="text-sm font-semibold text-white">Analyzing Calories & Macros...</span>
              </div>
            )}

            {analyzedData && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-12 h-12" />
                <span className="text-lg font-bold">Analysis Complete!</span>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 bg-black/90 p-4 flex items-center justify-center text-center text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Analysis Summary Display */}
          {analyzedData && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex flex-col gap-1">
              <strong className="block text-xs text-emerald-400 uppercase tracking-wider mb-1">
                Detected Meal Breakdown:
              </strong>
              <div className="flex justify-between font-bold text-white text-base mb-1">
                <span>{analyzedData.items?.[0]?.name || 'Logged Meal'}</span>
                <span>{analyzedData.total_calories || 0} kcal</span>
              </div>
              <div className="flex gap-3 text-xs text-emerald-200/80">
                <span>P: {analyzedData.total_protein || 0}g</span>
                <span>C: {analyzedData.total_carbs || 0}g</span>
                <span>F: {analyzedData.total_fats || 0}g</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              type="button"
              onClick={handleCapture}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-[#121316] font-bold text-sm shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Camera className="w-5 h-5" />
              <span>{loading ? 'Analyzing...' : 'Snap & Analyze Food'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white/70 font-semibold text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
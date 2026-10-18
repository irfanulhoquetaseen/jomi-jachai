'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QrScannerModal({ isOpen, onClose }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const scannerRef = useRef(null);
  const isStoppedRef = useRef(false);

  const handleScannedData = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // If QR contains a full or relative URL like /result?q=DEED-1003
      if (trimmed.includes('/result?q=')) {
        try {
          const urlObj = new URL(trimmed, window.location.origin);
          const queryParam = urlObj.searchParams.get('q');
          if (queryParam) {
            router.push(`/result?q=${encodeURIComponent(queryParam)}`);
            return;
          }
        } catch {
          const match = trimmed.match(/[?&]q=([^&]+)/);
          if (match && match[1]) {
            router.push(`/result?q=${encodeURIComponent(match[1])}`);
            return;
          }
        }
      }

      // If QR contains a plain code (e.g. DEED-1003 or 103)
      router.push(`/result?q=${encodeURIComponent(trimmed)}`);
    },
    [router]
  );

  useEffect(() => {
    if (!isOpen) return;

    let html5QrCode = null;
    isStoppedRef.current = false;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        html5QrCode = new Html5Qrcode('qr-scanner-view');
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (isStoppedRef.current) return;
            isStoppedRef.current = true;

            html5QrCode
              .stop()
              .then(() => {
                html5QrCode.clear();
              })
              .catch(() => {})
              .finally(() => {
                onClose();
                handleScannedData(decodedText);
              });
          },
          () => {
            // Per-frame scanning attempts
          }
        );

        setIsInitializing(false);
      } catch (err) {
        console.error('Camera initialization error:', err);
        setIsInitializing(false);
        setErrorMessage(
          'ক্যামেরা ব্যবহারের অনুমতি পাওয়া যায়নি। অনুগ্রহ করে আপনার ব্রাউজার সেটিংসে ক্যামেরার অনুমতি চালু করুন।'
        );
      }
    }

    const timer = setTimeout(() => {
      startScanner();
    }, 150);

    return () => {
      clearTimeout(timer);
      isStoppedRef.current = true;
      if (scannerRef.current) {
        try {
          scannerRef.current
            .stop()
            .then(() => {
              scannerRef.current?.clear();
            })
            .catch(() => {});
        } catch {
          // ignore cleanup errors on unmount
        }
      }
    };
  }, [isOpen, onClose, handleScannedData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center border border-slate-100">
        <h3 className="text-xl font-bold text-[#14532d] mb-1">
          কিউআর কোড স্ক্যান করুন
        </h3>
        <p className="text-sm text-slate-500 mb-4 text-center">
          দলিল বা কাগজের কিউআর কোডটি ক্যামেরার সামনে ধরুন
        </p>

        {/* Camera container */}
        <div className="w-full relative min-h-[260px] bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
          <div id="qr-scanner-view" className="w-full h-full overflow-hidden" />

          {isInitializing && !errorMessage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-4 text-center z-10">
              <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-sm font-medium">ক্যামেরা চালু হচ্ছে...</span>
            </div>
          )}

          {errorMessage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-50/95 text-amber-900 p-5 text-center z-10">
              <span className="text-3xl mb-2">📷</span>
              <p className="text-sm font-medium leading-relaxed mb-1">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full min-h-[48px] h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-base transition-colors flex items-center justify-center"
        >
          বন্ধ করুন
        </button>
      </div>
    </div>
  );
}

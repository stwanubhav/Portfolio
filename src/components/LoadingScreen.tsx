import React, { useEffect, useState } from 'react';
import { Terminal, Cpu, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

const BOOT_STEPS = [
  "SYSTEM BOOT // ANUBHAV PATEL OS v2.0",
  "ORACLE OCI AI FOUNDATIONS CREDENTIALS: VERIFIED",
  "LINKING 14 REPOSITORIES & CLIENT PLATFORMS...",
  "INITIALIZING NEURAL GRAPHICS & CONSOLE... READY"
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, forceShow = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Keep viewport locked at the very top during loading
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Progress through boot steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < BOOT_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 280);

    // Complete loading after ~1.3 seconds
    const timer = setTimeout(() => {
      setIsFading(true);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      setTimeout(() => {
        setIsDone(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (onComplete) onComplete();
      }, 500);
    }, 1400);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        setIsFading(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        setTimeout(() => {
          setIsDone(true);
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          if (onComplete) onComplete();
        }, 200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  if (isDone && !forceShow) return null;

  return (
    <div
      onClick={() => {
        setIsFading(true);
        setTimeout(() => {
          setIsDone(true);
          if (onComplete) onComplete();
        }, 200);
      }}
      className={`fixed inset-0 z-50 bg-[#040507] text-[#e9ecef] flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-500 ease-out ${
        isFading ? 'opacity-0 pointer-events-none scale-98 blur-xs' : 'opacity-100'
      }`}
      aria-label="System Loading Screen"
      role="status"
    >
      {/* CRT Scanline effect on loader */}
      <div className="absolute inset-0 crt-scanlines opacity-50 pointer-events-none" />

      {/* Cyber Corner Marks */}
      <div className="absolute top-8 left-8 font-mono text-[11px] text-purple-400/60 tracking-wider flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        <span>SYS.BOOT // ARCH: x86_64</span>
      </div>
      <div className="absolute top-8 right-8 font-mono text-[11px] text-slate-500 tracking-wider">
        <span>STATUS: 200 OK</span>
      </div>
      <div className="absolute bottom-8 left-8 font-mono text-[11px] text-slate-500">
        <span>LOC: PRAYAGRAJ (UP) // INDIA</span>
      </div>
      <div className="absolute bottom-8 right-8 font-mono text-[11px] text-purple-400/70 animate-cx-blink">
        <span>CLICK OR PRESS [ESC] TO SKIP ↵</span>
      </div>

      {/* Center Branding & Capsule Pill */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 font-mono text-xs tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
          SYSTEM INITIALIZATION
        </div>

        <h1 className="font-dot text-4xl sm:text-6xl tracking-tight text-white text-glow-violet uppercase">
          ANUBHAV PATEL
        </h1>

        <p className="font-mono text-xs sm:text-sm text-cyan-300/80 tracking-widest uppercase">
          COMPUTER SCIENCE // AI SYSTEMS & SOFTWARE ARCHIVE
        </p>

        {/* The iconic animated capsule pill loader */}
        <div className="cx-loader-pill my-2" title="Loading System Assets...">
          <i />
        </div>

        {/* Step stream diagnostic lines */}
        <div className="w-full bg-[#0a0d14]/90 border border-white/10 rounded-lg p-3 font-mono text-[11px] text-left text-slate-300 shadow-2xl space-y-1.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-500 border-b border-white/5 pb-1 mb-2">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-purple-400" />
              bootloader.log
            </span>
            <span className="text-cyan-400">Step {currentStep + 1} of {BOOT_STEPS.length}</span>
          </div>

          {BOOT_STEPS.slice(0, currentStep + 1).map((step, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 transition-opacity duration-200 ${
                idx === currentStep ? 'text-purple-200 font-medium' : 'text-slate-400'
              }`}
            >
              <CheckCircle2 className={`w-3 h-3 shrink-0 ${idx === currentStep ? 'text-cyan-400' : 'text-emerald-400'}`} />
              <span className="text-purple-400/80">[{String(idx + 1).padStart(2, '0')}]</span>
              <span className="truncate">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

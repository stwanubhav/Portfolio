import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { Check, Copy } from 'lucide-react';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle');
  const [copied, setCopied] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      nameInputRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Trigger celebratory confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    // Simulate sending message
    setTimeout(() => {
      setStatus('sent');
      // Also open pre-filled mailto in background
      const subject = encodeURIComponent(`Portfolio Message from ${name}`);
      const body = encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`);
      window.open(`mailto:${PORTFOLIO_DATA.person.email}?subject=${subject}&body=${body}`, '_blank');
    }, 600);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.person.email);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.7 }
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <div
      className="cx-modal"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cx-form relative max-w-lg w-full">
        <button
          type="button"
          className="cx-menu-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          CLOSE ✕
        </button>

        <h2 className="cx-dot-type text-3xl text-white">SAY HELLO</h2>
        <p className="text-xs text-slate-400 font-mono -mt-2">
          Direct communication channel with {PORTFOLIO_DATA.person.name}.
        </p>

        {status === 'sent' ? (
          <div className="py-8 text-center space-y-4 font-mono">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-white text-sm font-semibold">Message prepared & email client triggered!</p>
            <p className="text-xs text-slate-400">
              I usually reply within 24 hours. You can also mail directly anytime:
            </p>
            <div className="p-3 bg-black/50 border border-white/10 rounded-lg text-cyan-300 text-xs">
              {PORTFOLIO_DATA.person.email}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-purple-400 underline hover:text-purple-300 pt-2 block mx-auto"
            >
              &gt; BACK TO THE SITE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label>
              <span>NAME</span>
              <input
                ref={nameInputRef}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or company"
              />
            </label>

            <label>
              <span>EMAIL</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
              />
            </label>

            <label>
              <span>MESSAGE</span>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your project, idea, or role..."
              />
            </label>

            <div className="cx-form-foot">
              <button type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'PREPARING...' : '> SEND MESSAGE'}
              </button>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'EMAIL COPIED' : 'COPY EMAIL'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

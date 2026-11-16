import React, { useState } from 'react';
import { Mail, Copy, Check, Github, Globe, MapPin, Sparkles, Send, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const ContactSection: React.FC = () => {
  const { person } = PORTFOLIO_DATA;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(person.email);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#a855f7', '#06b6d4', '#10b981'],
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Main Glass Contact Box */}
        <div className="glass-panel p-8 sm:p-12 border border-purple-500/25 relative overflow-hidden shadow-2xl shadow-purple-950/40">
          
          {/* Subtle Corner Ambient Blob */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-mono mb-4">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>Get in Touch</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Let's Build Something <span className="gradient-text">Exceptional</span>
            </h2>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Open to technical internships, web application development, and AI engineering roles. 
              The most reliable way to connect is via email.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href={`mailto:${person.email}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
              <span>Send Email Directly</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#141824] hover:bg-[#1a2030] border border-white/10 hover:border-purple-500/40 text-slate-200 font-mono text-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-400" />
                  <span>Copy: {person.email}</span>
                </>
              )}
            </button>
          </div>

          {/* Contact Details Grid - STRICTLY NO PHONE NUMBER */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            
            {/* Email */}
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Direct Email
              </span>
              <a
                href={`mailto:${person.email}`}
                className="text-sm font-medium text-white hover:text-purple-300 transition-colors break-all"
              >
                {person.email}
              </a>
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Location
              </span>
              <p className="text-sm font-medium text-white">
                {person.location}
              </p>
            </div>

            {/* Profiles & Links */}
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Web & GitHub
              </span>
              <div className="flex flex-col gap-1 text-sm font-medium">
                <a
                  href={person.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-purple-400" />
                  <span>github.com/stwanubhav</span>
                </a>
                <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5">
                  <a href="https://lotusstudy.ct.ws" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 underline">lotusstudy.ct.ws</a>
                  <span>·</span>
                  <a href="https://www.freelearnx.ct.ws" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 underline">freelearnx.ct.ws</a>
                </div>
              </div>
            </div>

          </div>

          {/* Soft Skills & Languages Footnote */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Soft Skills: {person.softSkills.join(' · ')}</span>
            </div>
            <div>
              <span>Spoken Languages: {person.spokenLanguages.join(', ')}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

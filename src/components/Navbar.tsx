import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Terminal, Sparkles, RotateCcw } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface NavbarProps {
  onReboot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReboot }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#hero' },
    { name: 'Featured', href: '#projects' },
    { name: 'Archive [14]', href: '#archive' },
    { name: 'Terminal', href: '#terminal' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-2.5 bg-[#060709]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-[1px] shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0c0e14] rounded-[11px] flex items-center justify-center font-dot font-black text-white text-base tracking-wider">
              AP
            </div>
          </div>
          <div>
            <div className="font-dot text-sm tracking-wide text-white group-hover:text-purple-300 transition-colors uppercase">
              {PORTFOLIO_DATA.person.name}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-beacon inline-block" />
              <span>SYSTEM ONLINE &middot; OPEN TO WORK</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0f121d]/85 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`px-3 py-1 text-xs font-mono transition-all duration-200 rounded-full ${
                link.name.includes('Archive')
                  ? 'text-cyan-300 hover:text-white hover:bg-cyan-950/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          {onReboot && (
            <button
              onClick={onReboot}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-400 hover:text-white bg-[#0f121d] hover:bg-purple-950/40 border border-white/10 rounded-lg transition-colors"
              title="Replay System Boot Sequence"
            >
              <RotateCcw className="w-3 h-3 text-purple-400" />
              <span className="hidden md:inline">BOOT</span>
            </button>
          )}

          <a
            href="#terminal"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/40 rounded-lg transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>CLI</span>
          </a>

          <a
            href="#contact"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md shadow-purple-600/25 transition-all hover:shadow-purple-600/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>Contact</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 border border-white/10"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0e14]/98 border-b border-white/10 px-6 py-6 backdrop-blur-xl">
          <nav className="flex flex-col gap-3 font-mono">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-300 hover:text-purple-400 py-2 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              </a>
            ))}
            <div className="pt-2 flex items-center gap-2">
              {onReboot && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onReboot();
                  }}
                  className="flex-1 py-2 text-xs text-purple-300 border border-purple-800/50 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  REBOOT SYSTEM
                </button>
              )}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center block py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg"
              >
                GET IN TOUCH
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

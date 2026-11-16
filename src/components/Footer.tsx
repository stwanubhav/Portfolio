import React from 'react';
import { ArrowUp, Code2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-white/10 bg-[#040507] relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-purple-400" />
          <span>
            Designed & Engineered by <strong className="text-white">{PORTFOLIO_DATA.person.name}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
          <span>© {currentYear} · BCA Student @ UIM · Naini, Prayagraj</span>
        </div>

        <div>
          <a
            href="#hero"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </footer>
  );
};

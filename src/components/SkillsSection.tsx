import React from 'react';
import { Cpu, Code, Globe, Database, Wrench, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const SkillsSection: React.FC = () => {
  const { skills } = PORTFOLIO_DATA;

  const categoryIcons: Record<string, React.ElementType> = {
    ai: Cpu,
    languages: Code,
    web: Globe,
    backend: Database,
    tools: Wrench,
  };

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-mono mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Skills & <span className="gradient-text">Core Competencies</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Categorized as tags and chips grounded in coursework, certifications, and active codebases. No arbitrary percentage meters.
          </p>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(skills).map(([key, group]) => {
            const Icon = categoryIcons[key] || Code;
            return (
              <div
                key={key}
                className="glass-panel p-6 border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-base">
                      {group.category}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <div
                        key={item.name}
                        className="px-3 py-1.5 rounded-lg bg-[#111420] border border-white/5 text-xs text-slate-300 flex items-center gap-1.5 hover:border-purple-500/40 hover:text-white transition-colors"
                      >
                        <span className="font-medium">{item.name}</span>
                        {item.cert && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-mono">
                            {item.cert}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Verified by practice & coursework</span>
                  <span className="text-purple-400/80">● active</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

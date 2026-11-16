import React from 'react';
import { Terminal, ShieldCheck, Cpu, Code2, Globe } from 'lucide-react';

export const TelemetryBar: React.FC = () => {
  const telemetryItems = [
    { icon: Cpu, label: "OCI AI CERTIFIED", desc: "Oracle Foundations Associate" },
    { icon: Terminal, label: "SYS STATUS", desc: "All 14 Repositories Synced" },
    { icon: Code2, label: "PRIMARY STACK", desc: "Python // React // Node // FastAPI" },
    { icon: ShieldCheck, label: "EDUCATION", desc: "BCA @ United Institute of Management" },
    { icon: Globe, label: "LOCATION", desc: "Naini, Prayagraj, UP, India" },
    { icon: Terminal, label: "ACTIVE BUILDS", desc: "UNITE CBT Software // Lotus Study" }
  ];

  return (
    <div className="w-full bg-[#05070a] border-y border-white/10 py-2.5 overflow-hidden relative select-none font-mono text-xs">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {/* First copy */}
        <div className="flex items-center gap-8 px-4">
          {telemetryItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="inline-flex items-center gap-2 text-slate-400">
                <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-white font-medium">[{item.label}]:</span>
                <span className="text-slate-400">{item.desc}</span>
                <span className="text-purple-500/40 ml-4">&bull;</span>
              </div>
            );
          })}
        </div>

        {/* Duplicate copy for infinite loop */}
        <div className="flex items-center gap-8 px-4" aria-hidden="true">
          {telemetryItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={`dup-${i}`} className="inline-flex items-center gap-2 text-slate-400">
                <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-white font-medium">[{item.label}]:</span>
                <span className="text-slate-400">{item.desc}</span>
                <span className="text-purple-500/40 ml-4">&bull;</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

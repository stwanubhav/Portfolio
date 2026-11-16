import React from 'react';
import { GraduationCap, Award, Calendar, CheckCircle } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const EducationTimeline: React.FC = () => {
  const { education, certifications } = PORTFOLIO_DATA;

  return (
    <section id="education" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-xs font-mono mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Academic Background & Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Education & <span className="gradient-text">Certifications</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Institution, board or program, and verified completion dates. No arbitrary scores or percentages.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Education Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Formal Education</h3>
            </div>

            <div className="space-y-6 relative border-l-2 border-purple-900/40 ml-4 pl-6">
              {education.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Glowing Node */}
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#060709] border-2 border-purple-500 group-hover:bg-purple-500 group-hover:scale-125 transition-all shadow-md shadow-purple-500/50" />

                  <div className="glass-panel p-5 border border-white/5 group-hover:border-purple-500/30 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-purple-300 flex items-center gap-1 font-semibold">
                        <Calendar className="w-3 h-3" />
                        {item.period}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        item.status === 'Pursuing'
                          ? 'bg-purple-950/80 text-purple-300 border-purple-700/50'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                      {item.degree}
                    </h4>

                    <p className="text-sm font-medium text-slate-300 mb-2">
                      {item.institution}
                    </p>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Professional Certifications</h3>
            </div>

            <div className="space-y-4">
              {certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-5 border border-white/5 hover:border-cyan-500/30 transition-all flex items-start gap-4 group"
                >
                  <div className="mt-1">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {cert.title}
                      </h4>
                      {cert.dateBadge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                          {cert.dateBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-mono text-purple-300 mb-2">
                      Issued by {cert.issuer}
                    </p>

                    {cert.notes && (
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {cert.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Note on Coursework Credentials */}
            <div className="mt-6 p-4 rounded-xl bg-[#0a0d14] border border-white/5 text-xs text-slate-400 font-mono">
              <span className="text-purple-400 font-bold">Note:</span> Official completion dates are verified and published for Oracle OCI AI Foundations Associate (2025). Additional skill credentials represent completed institutional training.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

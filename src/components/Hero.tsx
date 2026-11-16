import React from 'react';
import { ArrowRight, Github, MapPin, Sparkles, Code2, Link2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { Profile3D } from './Profile3D';

export const Hero: React.FC = () => {
  const { person } = PORTFOLIO_DATA;

  return (
    <section id="hero" className="relative min-h-[92vh] pt-32 pb-20 flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Name & Title */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Hi, I'm <span className="gradient-text">{person.name}</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-purple-300/90 mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-400" />
              <span>{person.title}</span>
            </p>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
              Pursuing BCA at United Institute of Management with strong programming foundations. 
              I design and build multi-model AI utilities, high-throughput media pipelines, and scalable 
              web services with a focus on clean architectures and minimal hosting overhead.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
              <a
                href="#projects"
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:shadow-purple-600/50 hover:-translate-y-0.5"
              >
                <span>View Selected Work</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://stwlinkconnect.kdns.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-mono text-slate-300 bg-[#0e111a] hover:bg-[#161a29] border border-white/10 hover:border-cyan-500/40 rounded-xl transition-all"
              >
                <Link2 className="w-4 h-4 text-cyan-400" />
                <span>LinkConnect</span>
              </a>

              <a
                href={person.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
                <span className="text-xs font-mono">@stwanubhav</span>
              </a>
            </div>

            {/* Quick Meta Details */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pt-4 border-t border-white/10 w-full">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Naini, Prayagraj, UP, India</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>English & Hindi</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="text-slate-400">
                UIM Prayagraj (BCA)
              </div>
            </div>

          </div>

          {/* Right Column: Circular Avatar & Live Stats Bento */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* 3D Profile Photo Slot */}
            <div className="relative mb-6">
              {/* PROFILE PHOTO: Replace src with Anubhav's photo and alt with "Anubhav Patel" */}
              <Profile3D name={person.name} />
            </div>

            {/* Stat Counters Grid */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {person.stats.map((s) => (
                <div
                  key={s.label}
                  className="glass-panel p-3.5 text-center flex flex-col items-center justify-center"
                >
                  <div className="text-lg sm:text-xl font-bold font-mono text-white mb-0.5">
                    {s.value}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

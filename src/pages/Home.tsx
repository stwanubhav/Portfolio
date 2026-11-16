import React, { useState } from 'react';
import { Link } from 'wouter';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { CinemaMenu } from '../components/CinemaMenu';
import { ContactModal } from '../components/ContactModal';
import { TerminalPlayground } from '../components/TerminalPlayground';
import { TelemetryBar } from '../components/TelemetryBar';
import { ProjectCanvasScreen } from '../components/ProjectCanvasScreen';
import { Profile3D } from '../components/Profile3D';
import {
  Award,
  Link2,
  ArrowRight,
  Github,
  MapPin,
  ArrowUpRight,
  Cpu
} from 'lucide-react';

interface HomeProps {
  onReboot?: () => void;
  initialContactOpen?: boolean;
  buildStart?: boolean;
}

export const Home: React.FC<HomeProps> = ({ onReboot, initialContactOpen = false, buildStart = false }) => {
  const { person, skills, education, certifications, projects } = PORTFOLIO_DATA;
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(initialContactOpen);

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  React.useEffect(() => {
    if (!buildStart) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-home-build]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('home-build-revealed'));
      return;
    }

    const pendingTimers = new Set<number>();
    let sequence = 0;
    targets.forEach((target) => target.classList.add('home-build-pending'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
        const timer = window.setTimeout(() => {
          target.classList.add('home-build-revealed');
          pendingTimers.delete(timer);
        }, sequence++ * 45);
        pendingTimers.add(timer);
        observer.unobserve(target);
      });
    }, { threshold: 0 });

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      pendingTimers.forEach(window.clearTimeout);
      targets.forEach((target) => target.classList.remove('home-build-pending', 'home-build-revealed'));
    };
  }, [buildStart]);

  // Active project for the 2-column "SELECTED WORK" section
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const activeProject = projects[activeProjectIdx] || projects[0];

  // Active category for the "SIGNAL & SKILLS" section
  const skillCategories = Object.keys(skills);
  const [activeSkillCategoryKey, setActiveSkillCategoryKey] = useState(skillCategories[0]);
  const activeSkillGroup = skills[activeSkillCategoryKey];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="cx min-h-screen bg-[#040508] text-[#e9ecef] relative selection:bg-purple-600 selection:text-white">
      {/* Top Fixed Header (like portfolio-main cx-head) */}
      <header className="cx-head">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
          className="cx-brand cx-dot-type uppercase"
        >
          {person.name}
        </a>

        <nav className="cx-head-right font-mono text-xs">
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="cx-talk"
          >
            LET'S TALK
            <i />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="cx-menu-btn"
          >
            MENU
            <span>☰</span>
          </button>
        </nav>
      </header>

      {/* Main Multi-Chapter Flow */}
      <main className="relative z-10 font-mono">
        {/* =========================================================
            CHAPTER 1: HERO (cx-hero)
            ========================================================= */}
        <section
          id="hero"
          className="min-h-screen flex flex-col justify-center px-6 sm:px-12 pt-28 pb-16 max-w-7xl mx-auto relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Col: Hero Copy */}
            <div data-home-build className="lg:col-span-8 flex flex-col items-start">
              <h1 className="cx-dot-type text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase mb-4">
                {person.name}
              </h1>

              <p className="text-sm sm:text-base text-purple-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span>{person.title}</span>
                <span className="text-slate-500">&copy;2025</span>
              </p>

              <p className="font-sans text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
                {person.summary} I design and implement multi-model AI utilities, high-throughput media
                pipelines, and scalable web applications with a focus on clean architectures and minimal server overhead.
              </p>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono mb-8">
                <button
                  type="button"
                  onClick={() => scrollToSection('work')}
                  className="px-5 py-2.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-950/50 flex items-center gap-2"
                >
                  <span>&gt; SELECTED WORK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <Link
                  href="/projects"
                  className="px-5 py-2.5 rounded bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                >
                  &gt; ALL 14 PROJECTS
                </Link>

                <a
                  href="https://stwlinkconnect.kdns.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LinkConnect</span>
                </a>
              </div>

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-4 border-t border-white/10">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {person.location}
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-slate-300">UIM Prayagraj (BCA)</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-emerald-400">Status: Available</span>
              </div>
            </div>

            {/* Right Col: 3D Model Profile Slot */}
            <div data-home-build className="lg:col-span-4 flex flex-col items-center justify-center">
              {/* PROFILE PHOTO: Replace src with Anubhav's photo and alt with "Anubhav Patel" */}
              <Profile3D name={person.name} />

              <div className="mt-4 text-center font-mono text-xs text-slate-400">
                <p className="text-white font-bold tracking-wider">14 AUDITED REPOSITORIES</p>
              </div>
            </div>
          </div>

          <p data-home-build className="text-center font-mono text-xs tracking-widest text-slate-500 mt-12 animate-cx-blink">
            SCROLL &darr;
          </p>
        </section>

        {/* Live Telemetry Marquee */}
        <TelemetryBar />

        {/* =========================================================
            CHAPTER 2: SELECTED WORK (cx-work flow)
            ========================================================= */}
        <section id="work" data-home-build className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/10">
          <div className="mb-8">
            <span className="text-xs text-purple-400 tracking-widest uppercase block mb-1">
              [CHAPTER 01] &middot; HIGHLIGHTED WORK
            </span>
            <h2 className="cx-dot-type text-3xl sm:text-5xl text-white uppercase">
              SELECTED WORK
            </h2>
          </div>

          {/* Signature 2-Column Work Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Numbered List */}
            <div className="lg:col-span-5 bg-[#090c14] border border-white/10 rounded-xl p-4 divide-y divide-white/5">
              {projects.slice(0, 6).map((item, idx) => {
                const isSelected = activeProjectIdx === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveProjectIdx(idx)}
                    onMouseEnter={() => setActiveProjectIdx(idx)}
                    className={`w-full text-left py-3.5 px-3 rounded-lg transition-all flex items-center justify-between text-xs sm:text-sm ${
                      isSelected
                        ? 'bg-purple-950/40 text-white font-bold border-l-2 border-purple-500 shadow-md shadow-purple-950/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-purple-400/80 font-mono text-xs">
                        [{String(idx + 1).padStart(2, '0')}]
                      </span>
                      <span className="truncate">{item.title}</span>
                    </span>
                    <span
                      className="w-2 h-2 rounded-full shrink-0 ml-2"
                      style={{ backgroundColor: item.languageColor }}
                    />
                  </button>
                );
              })}

              <div className="pt-4 text-center">
                <Link
                  href="/projects"
                  className="text-xs text-cyan-300 hover:text-cyan-200 underline tracking-wider inline-flex items-center gap-1"
                >
                  &gt; VIEW COMPLETE ARCHIVE OF ALL 14 PROJECTS &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column: Dynamic Project Detail Card with Animated CRT Screen Canvas */}
            <div className="lg:col-span-7 bg-[#0b0e17] border border-purple-500/30 rounded-xl p-6 sm:p-8 shadow-2xl relative">
              <div className="tech-corner-tl" />
              <div className="tech-corner-tr" />
              <div className="tech-corner-bl" />
              <div className="tech-corner-br" />

              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4 text-xs">
                <span className="text-purple-400 font-bold uppercase">
                  {activeProject.category} &middot; {activeProject.primaryLanguage}
                </span>
                <span className="text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30 text-[10px]">
                  {activeProject.dateOrStatus}
                </span>
              </div>

              {/* Live 60fps Animated Project Canvas Simulation */}
              <div key={activeProject.id} className="mb-6 animate-sw-wipe">
                <ProjectCanvasScreen projectId={activeProject.id} />
              </div>

              <h3 className="cx-dot-type text-2xl sm:text-4xl text-white uppercase mb-3">
                {activeProject.title}
              </h3>

              <p className="font-sans text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                {activeProject.description}
              </p>

              <div className="mb-6">
                <span className="text-[11px] text-slate-400 block mb-2 uppercase tracking-wider">
                  INTEGRATIONS & STACK:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-purple-950/40 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10 text-xs">
                {activeProject.liveUrl && (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>LAUNCH LIVE PLATFORM</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}

                {activeProject.githubUrl && (
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center gap-1.5 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>&gt; OPEN ON GITHUB</span>
                  </a>
                )}

                <Link
                  href="/projects"
                  className="px-4 py-2 rounded text-slate-400 hover:text-white transition-colors"
                >
                  &gt; ALL {projects.length} PROJECTS
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CHAPTER 3: ABOUT / TERMINAL (cx-term flow)
            ========================================================= */}
        <div id="about" data-home-build>
          <TerminalPlayground onReboot={onReboot} />
        </div>

        {/* =========================================================
            CHAPTER 4: REPOSITORIES & METRICS (cx-commits flow)
            ========================================================= */}
        <section id="commits" data-home-build className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs text-purple-400 tracking-widest uppercase block mb-1">
                [CHAPTER 03] &middot; REPOSITORY AUDIT
              </span>
              <p className="cx-dot-type text-7xl sm:text-9xl text-emerald-400 mb-2">
                14
              </p>
              <h2 className="text-base sm:text-lg text-white font-bold uppercase tracking-wider mb-2">
                PUBLIC REPOSITORIES &amp; CLIENT BUILDS
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Verified public code contributions spanning AI integrations, multi-model chat frameworks,
                Telegram automation bots, and full-stack web platforms.
              </p>
              <a
                href={person.github}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-300 hover:text-cyan-200 underline inline-flex items-center gap-1"
              >
                &gt; GITHUB.COM/STWANUBHAV ↗
              </a>
            </div>

            <div className="lg:col-span-7 bg-[#090c14] border border-white/10 rounded-xl p-6 sm:p-8 font-mono text-xs">
              <h3 className="text-white font-bold text-sm mb-4 border-b border-white/10 pb-2">
                CORE TECHNICAL FACTS &amp; RUNTIME AUDIT
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">[PRIMARY STACKS]:</span>
                  <span>Python, JavaScript, TypeScript, HTML/CSS, PHP, Shell scripting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">[ACTIVE BUILDS]:</span>
                  <span>
                    UNITE CBT Software (Low-cost university exam delivery) &amp; Lotus Study (Coaching web platform).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">[TELEGRAM APIS]:</span>
                  <span>
                    Dropbox Transfer Bot, YouTube Downloader Bot, and Dropbox HTML Video Generator.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold shrink-0">[NO INVENTED DATA]:</span>
                  <span>
                    100% genuine academic dates, verifiable repositories, and zero fabricated metrics.
                  </span>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[11px] text-slate-500">
                <span>INDEXED REPOSITORIES: 14</span>
                <Link href="/projects" className="text-purple-400 hover:text-purple-300 underline">
                  VIEW FULL ARCHIVE TABLE &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CHAPTER 5: JOURNEY & TIMELINE (cx-journey flow)
            ========================================================= */}
        <section id="journey" data-home-build className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/10">
          <div className="mb-10">
            <span className="text-xs text-purple-400 tracking-widest uppercase block mb-1">
              [CHAPTER 04] &middot; PATHWAY
            </span>
            <h2 className="cx-dot-type text-3xl sm:text-5xl text-white uppercase">
              JOURNEY &amp; BUILDS
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Col 1: Academics & Credentials */}
            <div className="lg:col-span-6">
              <h3 className="text-sm font-bold text-white mb-6 uppercase flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                ACADEMICS &amp; CERTIFICATIONS
              </h3>

              <div className="border-l border-dashed border-white/20 pl-6 space-y-6">
                {education.map((edu) => (
                  <div key={edu.degree} className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 absolute -left-[31px] top-1" />
                    <span className="text-xs text-cyan-300 font-bold block mb-0.5">
                      {edu.period}
                    </span>
                    <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                    <p className="text-xs text-slate-400">{edu.institution}</p>
                    <p className="text-xs text-slate-400 font-sans mt-1">{edu.description}</p>
                  </div>
                ))}

                {certifications.map((cert) => (
                  <div key={cert.title} className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -left-[31px] top-1" />
                    <span className="text-xs text-emerald-400 font-bold block mb-0.5">
                      {cert.dateBadge || 'Certified'}
                    </span>
                    <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                    <p className="text-xs text-slate-400">{cert.issuer}</p>
                    {cert.notes && <p className="text-xs text-slate-400 font-sans mt-1">{cert.notes}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Col 2: Software Platforms & Client Builds */}
            <div className="lg:col-span-6">
              <h3 className="text-sm font-bold text-white mb-6 uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                PLATFORMS &amp; CLIENT SYSTEMS
              </h3>

              <div className="space-y-3">
                {projects.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-lg bg-[#090c14] border border-white/10 hover:border-purple-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white">{p.title}</span>
                      <span className="text-[10px] text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                        {p.primaryLanguage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans line-clamp-2 mb-2">
                      {p.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 underline text-[11px]"
                        >
                          LIVE ↗
                        </a>
                      )}
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-400 hover:text-purple-300 underline text-[11px]"
                        >
                          GITHUB ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CHAPTER 6: SIGNAL & SKILLS (cx-signal flow)
            ========================================================= */}
        <section id="signal" data-home-build className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/10">
          <div className="mb-8">
            <span className="text-xs text-purple-400 tracking-widest uppercase block mb-1">
              [CHAPTER 05] &middot; CAPABILITIES
            </span>
            <h2 className="cx-dot-type text-3xl sm:text-5xl text-white uppercase">
              SIGNAL &amp; SKILLS
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Category selector */}
            <div className="lg:col-span-5 bg-[#090c14] border border-white/10 rounded-xl p-4 divide-y divide-white/5">
              {skillCategories.map((key, idx) => {
                const group = skills[key];
                const isSelected = activeSkillCategoryKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveSkillCategoryKey(key)}
                    className={`w-full text-left py-3.5 px-3 rounded-lg transition-all flex items-center justify-between text-xs sm:text-sm ${
                      isSelected
                        ? 'bg-purple-950/40 text-white font-bold border-l-2 border-purple-500'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                    }`}
                  >
                    <span>
                      <span className="text-purple-400/80 mr-2">[{String(idx + 1).padStart(2, '0')}]</span>
                      {group.category}
                    </span>
                    <span className="text-slate-500 text-xs">[{group.items.length}]</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic details */}
            <div className="lg:col-span-7 bg-[#0b0e17] border border-purple-500/30 rounded-xl p-6 sm:p-8 shadow-2xl relative">
              <div className="tech-corner-tl" />
              <div className="tech-corner-tr" />
              <div className="tech-corner-bl" />
              <div className="tech-corner-br" />

              <h3 className="cx-dot-type text-2xl text-white uppercase mb-2">
                {activeSkillGroup.category}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Verified skill competencies without arbitrary scores or percentages:
              </p>

              <div className="flex flex-wrap gap-2.5">
                {activeSkillGroup.items.map((item) => (
                  <div
                    key={item.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-purple-950/40 text-slate-200 border border-purple-500/30 text-xs font-mono"
                  >
                    <span>{item.name}</span>
                    {item.cert && (
                      <span className="text-[10px] text-cyan-300 font-semibold px-1 rounded bg-cyan-950/70 border border-cyan-500/30">
                        {item.cert}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CHAPTER 7: CONTACT (cx-contact flow)
            ========================================================= */}
        <section id="contact" data-home-build className="py-28 px-6 sm:px-12 border-t border-white/10 bg-[#040508] relative">
          <div className="max-w-3xl mx-auto text-center relative py-12 px-6 sm:px-12 border border-white/10 rounded-2xl bg-[#080b12]/80 shadow-2xl">
            <div className="tech-corner-tl" />
            <div className="tech-corner-tr" />
            <div className="tech-corner-bl" />
            <div className="tech-corner-br" />

            <span className="text-xs text-purple-400 tracking-widest uppercase block mb-3">
              [CHAPTER 06] &middot; REACH OUT
            </span>

            <h2 className="cx-dot-type text-3xl sm:text-5xl text-white uppercase mb-4">
              LET'S BUILD SOMETHING TOGETHER.
            </h2>

            <p className="font-sans text-slate-400 text-sm sm:text-base max-w-lg mx-auto mb-8">
              Available for full-time junior AI engineer roles, software internships, and freelance web platform development.
            </p>

            <div className="mb-6">
              <a
                href={`mailto:${person.email}`}
                className="text-base sm:text-xl font-mono text-cyan-300 hover:text-white underline tracking-wider"
              >
                {person.email}
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono mb-8">
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="px-6 py-3 rounded bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-purple-900/50"
              >
                &gt; SEND A MESSAGE
              </button>

              <a
                href={person.github}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
              >
                &gt; GITHUB PROFILE
              </a>
            </div>

            <ul className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 border-t border-white/10 pt-6">
              <li>
                <a href={person.github} target="_blank" rel="noreferrer" className="hover:text-purple-400">
                  &gt; GITHUB (@stwanubhav)
                </a>
              </li>
              <li>
                <a href="https://lotusstudy.ct.ws" target="_blank" rel="noreferrer" className="hover:text-purple-400">
                  &gt; LOTUS STUDY
                </a>
              </li>
              <li>
                <a href="https://www.freelearnx.ct.ws" target="_blank" rel="noreferrer" className="hover:text-purple-400">
                  &gt; FREELEARNX
                </a>
              </li>
            </ul>
          </div>

          <footer className="mt-16 text-center text-[11px] text-slate-500 font-mono space-y-1">
            <p>@stwanubhav everywhere &middot; Prayagraj, Uttar Pradesh, India</p>
            <p>{person.name} &mdash; all rights reserved &copy;2025</p>
          </footer>
        </section>
      </main>

      {/* Cyberpunk Fullscreen Menu Overlay */}
      <CinemaMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={scrollToSection}
      />

      {/* Interactive Contact Modal */}
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
};

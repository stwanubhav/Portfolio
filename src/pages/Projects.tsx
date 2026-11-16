import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { PORTFOLIO_DATA, Project } from '../data/portfolioData';
import { ArrowLeft, Github, Terminal, ArrowUpRight } from 'lucide-react';
import { ProjectCanvasScreen } from '../components/ProjectCanvasScreen';
import { startSwarm } from '../lib/swarm';

type SortOption = 'recent' | 'name' | 'category';

export const ProjectsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('recent');
  const [preview, setPreview] = useState<Project | null>(PORTFOLIO_DATA.projects[0]);
  const [floatingPreview, setFloatingPreview] = useState<Project | null>(null);

  const mainRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Compute language breakdown
  const languageStats = useMemo(() => {
    const counts: Record<string, { count: number; color: string }> = {};
    PORTFOLIO_DATA.projects.forEach((p) => {
      if (!counts[p.primaryLanguage]) {
        counts[p.primaryLanguage] = { count: 0, color: p.languageColor };
      }
      counts[p.primaryLanguage].count++;
    });
    return Object.entries(counts)
      .map(([name, data]) => ({
        name,
        count: data.count,
        color: data.color,
        percentage: (data.count / PORTFOLIO_DATA.projects.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Filter and sort list
  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = PORTFOLIO_DATA.projects.filter((p) => {
      const matchLang = selectedLang === 'all' || p.primaryLanguage.toLowerCase() === selectedLang.toLowerCase();
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.primaryLanguage.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(query));
      return matchLang && matchQ;
    });

    if (selectedSort === 'name') {
      out.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === 'category') {
      out.sort((a, b) => a.category.localeCompare(b.category));
    }

    return out;
  }, [query, selectedLang, selectedSort]);

  // Scroll to top on mount & trigger agent building swarm (like portfolio-main)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (mainRef.current) {
      return startSwarm(mainRef.current);
    }
  }, []);

  // Cursor-following floating preview frame (like portfolio-main)
  useEffect(() => {
    const el = previewRef.current;
    if (!el || matchMedia('(pointer: coarse)').matches) return;

    let px = 0;
    let py = 0;

    const place = () => {
      if (!el) return;
      const x = Math.min(px + 28, window.innerWidth - el.offsetWidth - 24);
      const y = Math.max(20, Math.min(py - el.offsetHeight / 2, window.innerHeight - el.offsetHeight - 24));
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      place();
    };

    const ro = new ResizeObserver(place);
    ro.observe(el);

    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="cx cx-archive min-h-screen bg-[#040508] text-[#e9ecef] relative selection:bg-purple-600 selection:text-white">
      {/* CRT Scanline and ambient fx */}
      <div className="cx-archive-fx pointer-events-none" aria-hidden="true" />

      {/* Header */}
      <header className="cx-head">
        <Link href="/" className="cx-brand cx-dot-type">
          {PORTFOLIO_DATA.person.name}
        </Link>
        <nav className="cx-head-right">
          <a href={PORTFOLIO_DATA.person.github} target="_blank" rel="noreferrer">
            GITHUB ↗
          </a>
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </Link>
        </nav>
      </header>

      {/* Main Archive Content */}
      <main ref={mainRef} className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-24 relative z-10 font-mono">
        {/* Title */}
        <h1
          data-build
          className="cx-dot-type text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white mb-2 uppercase"
          style={{ animationDelay: '0ms' }}
        >
          ARCHIVE
        </h1>
        <p
          data-build
          className="text-xs sm:text-sm text-slate-400 tracking-wider mb-8 uppercase"
          style={{ animationDelay: '80ms' }}
        >
          EVERY PUBLIC REPOSITORY &middot; VERIFIED CODE &middot; ONGOING CLIENT SYSTEMS
        </p>

        {/* Stats Grid */}
        <div
          data-build
          className="grid grid-cols-2 md:grid-cols-4 border border-white/10 mb-6 bg-[#0a0d15]/80"
          style={{ animationDelay: '140ms' }}
        >
          <div className="p-4 sm:p-6 border-b sm:border-b-0 border-r border-white/10">
            <b className="cx-dot-type text-3xl sm:text-5xl block text-white mb-1">14</b>
            <span className="text-[11px] text-slate-400 tracking-widest uppercase">TOTAL REPOSITORIES</span>
          </div>
          <div className="p-4 sm:p-6 border-b sm:border-b-0 sm:border-r border-white/10">
            <b className="cx-dot-type text-3xl sm:text-5xl block text-purple-400 mb-1">06</b>
            <span className="text-[11px] text-slate-400 tracking-widest uppercase">AI & AUTOMATIONS</span>
          </div>
          <div className="p-4 sm:p-6 border-r border-white/10">
            <b className="cx-dot-type text-3xl sm:text-5xl block text-cyan-400 mb-1">{languageStats.length}</b>
            <span className="text-[11px] text-slate-400 tracking-widest uppercase">ACTIVE STACKS</span>
          </div>
          <div className="p-4 sm:p-6">
            <b className="cx-dot-type text-3xl sm:text-5xl block text-emerald-400 mb-1">02</b>
            <span className="text-[11px] text-slate-400 tracking-widest uppercase">CLIENT PLATFORMS</span>
          </div>
        </div>

        {/* Proportional Language Bar */}
        <div data-build className="mb-6" style={{ animationDelay: '200ms' }}>
          <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-900 border border-white/5">
            {languageStats.map((item) => (
              <div
                key={item.name}
                title={`${item.name} · ${item.count} projects`}
                onClick={() => setSelectedLang(selectedLang === item.name ? 'all' : item.name)}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                  opacity: selectedLang === 'all' || selectedLang.toLowerCase() === item.name.toLowerCase() ? 1 : 0.25,
                }}
                className="h-full cursor-pointer transition-opacity hover:brightness-125"
              />
            ))}
          </div>
        </div>

        {/* Controls Bar: Grep & Sort */}
        <div
          data-build
          className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-3 border-y border-dashed border-white/20 mb-4 text-xs"
          style={{ animationDelay: '260ms' }}
        >
          <label className="flex items-center gap-2 flex-1">
            <span className="text-purple-400 font-bold">&gt;</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="GREP REPOS, TOPICS, LANGUAGES..."
              className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500 uppercase tracking-wider"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white px-2">
                [CLEAR]
              </button>
            )}
          </label>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-500 hidden sm:inline">SORT:</span>
            {(['recent', 'name', 'category'] as SortOption[]).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSort(s)}
                className={`transition-colors uppercase ${
                  selectedSort === s ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {selectedSort === s ? '• ' : ''}
                {s === 'recent' ? 'RECENT' : s === 'name' ? 'A → Z' : 'TYPE'}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Chips */}
        <div
          data-build
          className="flex flex-wrap items-center gap-2 mb-8"
          style={{ animationDelay: '320ms' }}
        >
          <button
            onClick={() => setSelectedLang('all')}
            className={`px-3 py-1 text-[11px] uppercase border transition-all ${
              selectedLang === 'all'
                ? 'bg-white text-black border-white font-bold'
                : 'text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            ALL <em>{PORTFOLIO_DATA.projects.length}</em>
          </button>
          {languageStats.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedLang(selectedLang === item.name ? 'all' : item.name)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase border transition-all ${
                selectedLang.toLowerCase() === item.name.toLowerCase()
                  ? 'bg-white text-black border-white font-bold'
                  : 'text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              <i className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
              <em className="opacity-60">[{item.count}]</em>
            </button>
          ))}
        </div>

        {/* Archive List & Sticky Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main List Column */}
          <div
            className="lg:col-span-8 divide-y divide-white/10 border-t border-b border-white/10"
            onPointerLeave={() => setFloatingPreview(null)}
          >
            {filteredList.map((project, idx) => {
              const isSelected = preview?.id === project.id;
              return (
                <div
                  key={project.id}
                  data-build
                  style={{ animationDelay: `${360 + idx * 30}ms` }}
                  onPointerEnter={() => {
                    setFloatingPreview(project);
                    setPreview(project);
                  }}
                  onClick={() => setPreview(project)}
                  className={`cx-row-interactive grid grid-cols-12 gap-2 sm:gap-4 py-4 px-2 sm:px-3 items-center cursor-pointer group ${
                    isSelected ? 'bg-purple-950/25 border-l-2 border-purple-500' : ''
                  }`}
                >
                  {/* Index */}
                  <span className="col-span-1 text-slate-500 text-xs">
                    [{String(idx + 1).padStart(2, '0')}]
                  </span>

                  {/* Main Info */}
                  <div className="col-span-7 sm:col-span-6 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white group-hover:text-purple-300 transition-colors text-sm sm:text-base">
                        {project.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-sans">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {project.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] text-slate-400 border border-white/10 px-1 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div className="col-span-2 hidden sm:flex items-center gap-1.5 text-xs text-slate-300">
                    <i className="w-2 h-2 rounded-full" style={{ backgroundColor: project.languageColor }} />
                    <span className="truncate">{project.primaryLanguage}</span>
                  </div>

                  {/* Links */}
                  <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-2 text-xs">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-0.5 underline text-[11px]"
                      >
                        LIVE ↗
                      </a>
                    )}
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5 underline text-[11px]"
                      >
                        REPO ↗
                      </a>
                    ) : (
                      <span className="text-slate-500 text-[10px]">CLIENT</span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredList.length === 0 && (
              <div className="py-16 text-center text-slate-500 text-xs">
                &gt; NO REPOSITORIES FOUND MATCHING &ldquo;{query}&rdquo;
              </div>
            )}
          </div>

          {/* Sticky Inspector Panel */}
          <div className="lg:col-span-4 sticky top-28">
            {preview && (
              <div className="bg-[#0b0e17] border border-purple-500/30 rounded-xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="tech-corner-tl" />
                <div className="tech-corner-tr" />
                <div className="tech-corner-bl" />
                <div className="tech-corner-br" />

                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs text-purple-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    // ARCHIVE_INSPECTOR
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 uppercase">
                    {preview.category}
                  </span>
                </div>

                {/* Live 60fps Animated Project Screen Simulation */}
                <div key={preview.id} className="mb-4 animate-sw-wipe">
                  <ProjectCanvasScreen projectId={preview.id} />
                </div>

                <h3 className="cx-dot-type text-2xl text-white uppercase mb-2">
                  {preview.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <i className="w-2 h-2 rounded-full" style={{ backgroundColor: preview.languageColor }} />
                    <span className="text-white">{preview.primaryLanguage}</span>
                  </span>
                  <span>·</span>
                  <span className="text-cyan-400">{preview.dateOrStatus}</span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed p-3 bg-black/40 border border-white/5 rounded-lg mb-4">
                  {preview.description}
                </p>

                <div className="mb-6">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">
                    TECHNOLOGY STACK & INTEGRATIONS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {preview.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-purple-950/40 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                  {preview.liveUrl && (
                    <a
                      href={preview.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-center py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>LAUNCH LIVE PLATFORM</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {preview.githubUrl ? (
                    <a
                      href={preview.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-center py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>VIEW ON GITHUB</span>
                    </a>
                  ) : (
                    <div className="text-center text-[10px] text-amber-300 py-1.5 bg-amber-950/20 rounded border border-amber-500/20">
                      Proprietary / Client Development
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Cursor-Following Live Preview Window (exact portfolio-main cx-archive-preview) */}
      <div
        ref={previewRef}
        className={`cx-archive-preview hidden md:grid ${floatingPreview ? 'is-on' : ''}`}
        aria-hidden="true"
      >
        {floatingPreview && (
          <div className="cx-archive-frame">
            <ProjectCanvasScreen projectId={floatingPreview.id} />
          </div>
        )}
        {floatingPreview && (
          <p className="font-mono text-[11px] text-purple-300 text-right">
            {floatingPreview.title} // LIVE MONITOR
          </p>
        )}
      </div>
    </div>
  );
};

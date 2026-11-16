import React, { useState, useMemo } from 'react';
import { PORTFOLIO_DATA, Project } from '../data/portfolioData';
import { ExternalLink, Github, Layers, Terminal, ArrowUpRight } from 'lucide-react';

type SortOption = 'recent' | 'name' | 'category';

export const ProjectArchive: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('recent');
  const [activePreview, setActivePreview] = useState<Project | null>(PORTFOLIO_DATA.projects[0]);

  // Compute language distribution for the segmented bar
  const languageStats = useMemo(() => {
    const counts: Record<string, { count: number; color: string }> = {};
    PORTFOLIO_DATA.projects.forEach((p) => {
      if (!counts[p.primaryLanguage]) {
        counts[p.primaryLanguage] = { count: 0, color: p.languageColor };
      }
      counts[p.primaryLanguage].count++;
    });
    return Object.entries(counts).map(([name, data]) => ({
      name,
      count: data.count,
      color: data.color,
      percentage: (data.count / PORTFOLIO_DATA.projects.length) * 100
    })).sort((a, b) => b.count - a.count);
  }, []);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = PORTFOLIO_DATA.projects.filter((p) => {
      const matchesLang = selectedLanguage === 'all' || p.primaryLanguage.toLowerCase() === selectedLanguage.toLowerCase();
      const matchesQuery = !query || 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.primaryLanguage.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query));
      return matchesLang && matchesQuery;
    });

    if (selectedSort === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === 'category') {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }
    // 'recent' keeps the curated chronological and impact order

    return result;
  }, [searchQuery, selectedLanguage, selectedSort]);

  return (
    <section id="archive" className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#07090e]">
      {/* Subtle Scanlines effect */}
      <div className="absolute inset-0 crt-scanlines opacity-30 pointer-events-none" />

      {/* Decorative corner markers */}
      <div className="tech-corner-tl" />
      <div className="tech-corner-tr" />
      <div className="tech-corner-bl" />
      <div className="tech-corner-br" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
                SYSTEM ARCHIVE // 14 VERIFIED REPOSITORIES & CLIENT PRODUCTS
              </span>
            </div>
            <div className="font-mono text-xs text-slate-400">
              [INDEX: 01 &rarr; 14] &middot; STACK: MULTI-LANGUAGE
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-dot text-3xl sm:text-5xl text-white tracking-tight uppercase text-glow-cyan">
                PROJECT ARCHIVE
              </h2>
              <p className="mt-2 text-slate-400 max-w-2xl text-sm sm:text-base">
                Every public repository, client platform, and AI automation built by Anubhav Patel. Filter by language, grep by topic, or inspect technical architectures below.
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-[#0f121d] border border-white/10 p-3 rounded-lg">
                <span className="text-slate-400 block text-[10px]">TOTAL ITEMS</span>
                <span className="font-dot text-xl text-white">14</span>
              </div>
              <div className="bg-[#0f121d] border border-white/10 p-3 rounded-lg">
                <span className="text-slate-400 block text-[10px]">AI & TOOLS</span>
                <span className="font-dot text-xl text-purple-400">06</span>
              </div>
              <div className="bg-[#0f121d] border border-white/10 p-3 rounded-lg">
                <span className="text-slate-400 block text-[10px]">BACKEND / BOT</span>
                <span className="font-dot text-xl text-cyan-400">05</span>
              </div>
              <div className="bg-[#0f121d] border border-white/10 p-3 rounded-lg">
                <span className="text-slate-400 block text-[10px]">CLIENT SYSTEMS</span>
                <span className="font-dot text-xl text-emerald-400">02</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proportional Language Bar */}
        <div className="mb-6 bg-[#0c0e16] p-3 rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Language Distribution Across Repositories
            </span>
            <span className="text-slate-400">{languageStats.length} Tech Stacks</span>
          </div>

          {/* Segmented Bar */}
          <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-slate-900 border border-white/5">
            {languageStats.map((item) => (
              <div
                key={item.name}
                title={`${item.name}: ${item.count} projects (${Math.round(item.percentage)}%)`}
                onClick={() => setSelectedLanguage(selectedLanguage === item.name ? 'all' : item.name)}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                  opacity: selectedLanguage === 'all' || selectedLanguage.toLowerCase() === item.name.toLowerCase() ? 1 : 0.25
                }}
                className="h-full transition-opacity cursor-pointer hover:brightness-125"
              />
            ))}
          </div>

          {/* Language Legends */}
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-white/5 font-mono text-xs">
            <button
              onClick={() => setSelectedLanguage('all')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                selectedLanguage === 'all'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ALL [14]
            </button>
            {languageStats.map((item) => (
              <button
                key={item.name}
                onClick={() => setSelectedLanguage(selectedLanguage === item.name ? 'all' : item.name)}
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] transition-colors ${
                  selectedLanguage.toLowerCase() === item.name.toLowerCase()
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
                <span className="text-slate-500">[{item.count}]</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Grep Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400 font-mono text-sm">
              &gt;
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="grep repositories, topics, APIs, frameworks..."
              className="w-full pl-8 pr-10 py-2.5 bg-[#0b0e17] border border-white/10 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 font-mono transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs font-mono"
              >
                [CLEAR]
              </button>
            )}
          </div>

          {/* Sort Toggles */}
          <div className="flex items-center gap-1 bg-[#0b0e17] border border-white/10 p-1 rounded-lg font-mono text-xs">
            <span className="px-2 text-slate-500 hidden sm:inline">SORT:</span>
            {(['recent', 'name', 'category'] as SortOption[]).map((sort) => (
              <button
                key={sort}
                onClick={() => setSelectedSort(sort)}
                className={`px-2.5 py-1.5 rounded transition-colors uppercase ${
                  selectedSort === sort
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sort === 'recent' ? 'CHRONO' : sort === 'name' ? 'A &rarr; Z' : 'TYPE'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Split Archive Table & Live Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left/Main Column: Archive Table (Col 8) */}
          <div className="lg:col-span-8 bg-[#0a0d15] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            {/* Table Header Bar */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-[#0f131f] border-b border-white/10 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
              <div className="col-span-1">IDX</div>
              <div className="col-span-6 sm:col-span-5">REPOSITORY / PROJECT</div>
              <div className="col-span-3 sm:col-span-3 hidden sm:block">STACK</div>
              <div className="col-span-5 sm:col-span-3 text-right">LINKS</div>
            </div>

            {/* Project Rows */}
            <div className="divide-y divide-white/5">
              {filteredProjects.map((project, idx) => {
                const isActive = activePreview?.id === project.id;
                return (
                  <div
                    key={project.id}
                    onMouseEnter={() => setActivePreview(project)}
                    onClick={() => setActivePreview(project)}
                    className={`grid grid-cols-12 gap-2 px-4 py-3.5 items-center transition-colors cursor-pointer group ${
                      isActive ? 'bg-purple-950/20 border-l-2 border-purple-500' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Monospace Index [01] */}
                    <div className="col-span-1 font-mono text-xs text-purple-400/80">
                      [{String(idx + 1).padStart(2, '0')}]
                    </div>

                    {/* Project Name and Description */}
                    <div className="col-span-6 sm:col-span-5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 group-hover:text-purple-300 transition-colors text-sm truncate">
                          {project.title}
                        </span>
                        {project.statusBadge && (
                          <span className="hidden md:inline-flex px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                            {project.statusBadge.includes('In Development') ? 'WIP' : 'LIVE'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {project.description}
                      </p>
                    </div>

                    {/* Language & Tags */}
                    <div className="col-span-3 hidden sm:flex items-center gap-2 font-mono text-xs">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: project.languageColor }}
                        />
                        <span className="truncate">{project.primaryLanguage}</span>
                      </span>
                    </div>

                    {/* Actions / Links */}
                    <div className="col-span-5 sm:col-span-3 flex items-center justify-end gap-2 text-xs font-mono">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60 transition-colors"
                          title="Open Live Website"
                        >
                          <span className="text-[10px]">LIVE</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 text-slate-300 border border-white/10 hover:border-purple-500/40 hover:text-white transition-colors"
                          title="Open GitHub Repository"
                        >
                          <Github className="w-3 h-3" />
                          <span className="text-[10px] hidden xs:inline">REPO</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-500 px-1.5 py-1">CLIENT</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredProjects.length === 0 && (
                <div className="py-12 text-center text-slate-500 font-mono text-sm">
                  <p>&gt; NO ARCHIVE MATCHES FOR &ldquo;{searchQuery}&rdquo;</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedLanguage('all'); }}
                    className="mt-3 text-xs text-purple-400 underline hover:text-purple-300"
                  >
                    RESET FILTERS
                  </button>
                </div>
              )}
            </div>

            {/* Table Footer */}
            <div className="px-4 py-2.5 bg-[#0a0c13] border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>SHOWING {filteredProjects.length} OF {PORTFOLIO_DATA.projects.length} REPOSITORIES</span>
              <a
                href={PORTFOLIO_DATA.person.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
              >
                GITHUB.COM/STWANUBHAV &rarr;
              </a>
            </div>
          </div>

          {/* Right Column: Live Technical Inspector (Col 4) */}
          <div className="lg:col-span-4 sticky top-24">
            {activePreview ? (
              <div className="bg-[#0b0e17] border border-purple-500/30 rounded-xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
                {/* Tech corner ticks */}
                <div className="tech-corner-tl" />
                <div className="tech-corner-tr" />
                <div className="tech-corner-bl" />
                <div className="tech-corner-br" />

                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 font-mono text-xs">
                  <span className="text-purple-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    // REPO_INSPECTOR
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950/60 text-purple-300 border border-purple-500/30 uppercase">
                    {activePreview.category}
                  </span>
                </div>

                <h3 className="font-dot text-xl text-white uppercase tracking-tight text-glow-violet">
                  {activePreview.title}
                </h3>

                <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activePreview.languageColor }} />
                    <span className="text-slate-200">{activePreview.primaryLanguage}</span>
                  </span>
                  <span>&middot;</span>
                  <span className="text-cyan-400">{activePreview.dateOrStatus}</span>
                </div>

                <div className="mt-4 p-3 bg-black/40 border border-white/5 rounded-lg text-xs text-slate-300 leading-relaxed font-sans">
                  {activePreview.description}
                </div>

                {/* Tech Tags */}
                <div className="mt-4">
                  <span className="block text-[11px] font-mono text-slate-400 mb-2">
                    TECHNOLOGY STACK & INTEGRATIONS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activePreview.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded text-[11px] font-mono bg-purple-950/30 text-purple-300 border border-purple-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2 font-mono text-xs">
                  {activePreview.liveUrl && (
                    <a
                      href={activePreview.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-lg shadow-emerald-950/40"
                    >
                      <span>LAUNCH LIVE PLATFORM</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}

                  {activePreview.githubUrl && (
                    <a
                      href={activePreview.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>VIEW CODE ON GITHUB</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  )}

                  {!activePreview.githubUrl && !activePreview.liveUrl && (
                    <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/30 text-amber-300 text-center text-[11px]">
                      Proprietary / Client Development &middot; Private Repository
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

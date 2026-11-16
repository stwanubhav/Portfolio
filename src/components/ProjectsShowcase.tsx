import React, { useState } from 'react';
import { ExternalLink, Github, Sparkles, Layers, Cpu, Server, Video, Wrench } from 'lucide-react';
import { PORTFOLIO_DATA, Project } from '../data/portfolioData';

export const ProjectsShowcase: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const { projects } = PORTFOLIO_DATA;

  const categories = [
    { id: 'all', label: 'All Projects', icon: Layers },
    { id: 'ai', label: 'AI & LLM', icon: Cpu },
    { id: 'backend', label: 'APIs & Backend', icon: Server },
    { id: 'media', label: 'Media & Downloader', icon: Video },
    { id: 'client', label: 'Client & University', icon: Sparkles },
    { id: 'tools', label: 'Tools & Utilities', icon: Wrench },
  ];

  const filteredProjects = projects.filter((p: Project) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-3">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Engineered Work & Open Source</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Featured <span className="gradient-text">Projects & Systems</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md">
            Grounded in real public repositories, dependency manifests, and active development. No inflated claims or metrics.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-2">
          {categories.map((c) => {
            const Icon = c.icon;
            const isActive = filter === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-semibold'
                    : 'bg-[#0f121a] text-slate-400 hover:text-white hover:bg-[#161a26] border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`glass-panel p-6 flex flex-col justify-between group transition-all duration-300 ${
                project.highlight ? 'border-purple-500/30 hover:border-purple-500/60' : 'border-white/5'
              }`}
            >
              <div>
                {/* Top Bar with Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold">
                    {project.category}
                  </span>
                  {project.statusBadge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                      {project.statusBadge}
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {project.title}
                </h3>

                {/* Project Description */}
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              {/* Bottom: Tags & Links */}
              <div>
                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-[#131622] text-slate-300 text-[11px] font-mono border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4 text-purple-400" />
                      <span>View on GitHub</span>
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors ml-auto"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* GitHub Full Archive Note */}
        <div className="mt-12 text-center">
          <a
            href={PORTFOLIO_DATA.person.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-all hover:scale-105"
          >
            <Github className="w-4 h-4 text-purple-400" />
            <span>View All Public Repositories on GitHub @stwanubhav</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

      </div>
    </section>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Copy, Check, CornerDownLeft, Sparkles, RefreshCw } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface CommandOutput {
  command: string;
  response: React.ReactNode;
}

interface TerminalPlaygroundProps {
  onReboot?: () => void;
}

export const TerminalPlayground: React.FC<TerminalPlaygroundProps> = ({ onReboot }) => {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'whoami',
      response: (
        <div className="space-y-1 text-slate-300">
          <p className="text-purple-300 font-semibold">Anubhav Patel // Aspiring AI Engineer</p>
          <p>BCA Student @ United Institute of Management, Prayagraj</p>
          <p>Oracle Certified in OCI AI Foundations (2025)</p>
          <p className="text-xs text-slate-400">Type <span className="text-cyan-400 font-mono">help</span> to see all available commands or <span className="text-purple-400 font-mono">archive</span> for the 14-project table.</p>
        </div>
      ),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const terminalBodyRef = useRef<HTMLDivElement | null>(null);
  const hasInteracted = useRef(false);

  const presetCommands = ['help', 'skills', 'projects', 'archive', 'boot', 'certifications', 'education', 'contact', 'clear'];

  const handleCommand = (cmdStr: string) => {
    hasInteracted.current = true;
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    let responseNode: React.ReactNode;

    switch (trimmed) {
      case 'help':
        responseNode = (
          <div className="space-y-1 text-slate-300">
            <p className="text-cyan-300">Available commands:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1 text-xs font-mono">
              <div><span className="text-purple-400 font-bold">whoami</span> — Identity & bio</div>
              <div><span className="text-purple-400 font-bold">skills</span> — Technical stack</div>
              <div><span className="text-purple-400 font-bold">projects</span> — Key repositories</div>
              <div><span className="text-purple-400 font-bold">archive</span> — Full 14-project table</div>
              <div><span className="text-purple-400 font-bold">boot</span> — Replay boot screen</div>
              <div><span className="text-purple-400 font-bold">education</span> — Academic path</div>
              <div><span className="text-purple-400 font-bold">certifications</span> — Verified credentials</div>
              <div><span className="text-purple-400 font-bold">contact</span> — Reach out directly</div>
              <div><span className="text-purple-400 font-bold">clear</span> — Reset terminal</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        responseNode = (
          <div className="space-y-1 text-slate-300">
            <p className="font-bold text-white">{PORTFOLIO_DATA.person.name}</p>
            <p className="text-purple-300">{PORTFOLIO_DATA.person.title}</p>
            <p>{PORTFOLIO_DATA.person.summary}</p>
            <p className="text-xs text-slate-400">Location: {PORTFOLIO_DATA.person.location}</p>
          </div>
        );
        break;

      case 'skills':
        responseNode = (
          <div className="space-y-2 text-slate-300 text-xs font-mono">
            <div>
              <span className="text-cyan-400 font-bold">[AI & Prompting]:</span> OCI AI Foundations (Oracle Certified), Prompt Engineering (Skillup), Multi-Model AI Integrations.
            </div>
            <div>
              <span className="text-purple-400 font-bold">[Languages]:</span> Python, JavaScript, TypeScript, C, C++, Java, SQL, PHP, Shell.
            </div>
            <div>
              <span className="text-emerald-400 font-bold">[Web & Backend]:</span> React JS, Node.js, Express, Next.js, FastAPI, Flask, REST APIs, Redis, SSE.
            </div>
            <div>
              <span className="text-amber-400 font-bold">[Tools & Media]:</span> Docker, Git, Puppeteer, yt-dlp, FFmpeg, Google IDX, Linux.
            </div>
          </div>
        );
        break;

      case 'projects':
        responseNode = (
          <div className="space-y-1.5 text-xs text-slate-300">
            <p className="text-cyan-300 font-semibold">Featured Work Highlights:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-white">STWAI:</strong> Multi-model AI comparison interface (FastAPI, PHP, Python, AI APIs)</li>
              <li><strong className="text-white">STW-Verify:</strong> Email OTP verification API with Redis caching & rate limiting</li>
              <li><strong className="text-white">MD_TO_PDF:</strong> Markdown editor with server-side Puppeteer PDF generation</li>
              <li><strong className="text-white">COMMIT-STW:</strong> AI-assisted Git commit generator and publisher</li>
              <li><strong className="text-white">UNITE CBT:</strong> Low-cost online exam delivery software for universities</li>
              <li><strong className="text-white">Lotus Study:</strong> Coaching institute official responsive platform</li>
            </ul>
          </div>
        );
        break;

      case 'education':
        responseNode = (
          <div className="space-y-1.5 text-xs text-slate-300">
            {PORTFOLIO_DATA.education.map((e) => (
              <div key={e.degree} className="border-l-2 border-purple-500/50 pl-2">
                <p className="font-bold text-white">{e.degree} — <span className="text-cyan-400">{e.status}</span></p>
                <p className="text-slate-400">{e.institution}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'certifications':
        responseNode = (
          <div className="space-y-1.5 text-xs text-slate-300">
            <p className="text-purple-300 font-semibold">Credentials & Completed Training (Date only, no scores):</p>
            {PORTFOLIO_DATA.certifications.map((c) => (
              <div key={c.title} className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="font-bold text-white">{c.title}</span>
                <span className="text-slate-400">({c.issuer})</span>
                {c.dateBadge && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-mono">{c.dateBadge}</span>}
              </div>
            ))}
          </div>
        );
        break;

      case 'archive':
        responseNode = (
          <div className="space-y-1.5 text-xs text-slate-300 font-mono">
            <p className="text-cyan-300 font-bold">&gt; Complete 14-Project Archive Catalog:</p>
            <div className="space-y-1">
              {PORTFOLIO_DATA.projects.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span className="text-purple-400">[{String(i + 1).padStart(2, '0')}]</span>
                  <span className="text-white font-semibold">{p.title}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-cyan-400">{p.primaryLanguage}</span>
                  <span className="text-slate-500">({p.dateOrStatus})</span>
                </div>
              ))}
            </div>
            <p className="text-slate-400 pt-1 text-[11px]">
              &rarr; Scroll down to the <a href="#archive" className="text-purple-300 underline">Project Archive</a> section for live grep search, filters, and architecture inspection.
            </p>
          </div>
        );
        break;

      case 'boot':
      case 'reboot':
        if (onReboot) {
          onReboot();
          responseNode = (
            <p className="text-emerald-400 text-xs font-mono">
              &gt; Initiating system reboot sequence...
            </p>
          );
        } else {
          responseNode = (
            <p className="text-cyan-400 text-xs font-mono">
              &gt; System online. Boot sequence completed.
            </p>
          );
        }
        break;

      case 'contact':
        responseNode = (
          <div className="space-y-1 text-xs text-slate-300 font-mono">
            <p className="text-cyan-300">Direct Contact Channels:</p>
            <p>Email: <a href={`mailto:${PORTFOLIO_DATA.person.email}`} className="text-white underline">{PORTFOLIO_DATA.person.email}</a></p>
            <p>GitHub: <a href={PORTFOLIO_DATA.person.github} target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">{PORTFOLIO_DATA.person.github}</a></p>
            <p>Location: {PORTFOLIO_DATA.person.location}</p>
          </div>
        );
        break;

      default:
        responseNode = (
          <p className="text-red-400 text-xs font-mono">
            Command not recognized: <span className="text-white font-bold">{trimmed}</span>. Type <span className="text-cyan-300">help</span> for a list of commands.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: cmdStr, response: responseNode }]);
    setInputVal('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(inputVal);
  };

  const handleCopyHistory = () => {
    const textToCopy = history.map((h) => `$ ${h.command}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (hasInteracted.current && terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <section id="terminal" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-mono mb-3">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>Interactive Developer Console</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Explore the <span className="gradient-text">AI Lab Terminal</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Interact with the CLI directly. Run commands to inspect my background, verified skills, and project repos.
          </p>
        </div>

        {/* Terminal Window Box */}
        <div className="glass-panel overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-950/30">
          
          {/* Terminal Title Bar */}
          <div className="px-4 py-3 bg-[#0a0c12] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-xs text-slate-400">anubhav@ai-lab:~</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyHistory}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono px-2 py-1 rounded hover:bg-white/5 transition-colors"
                title="Copy Terminal Log"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => setHistory([])}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono px-2 py-1 rounded hover:bg-white/5 transition-colors"
                title="Clear Terminal"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Quick-Click Command Pills */}
          <div className="px-4 py-2.5 bg-[#090b10] border-b border-white/5 flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> Preset:
            </span>
            {presetCommands.map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleCommand(cmd)}
                className="px-2.5 py-0.5 rounded-md bg-[#161a26] text-purple-300 hover:text-white hover:bg-purple-900/40 border border-white/5 transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Terminal Screen Body */}
          <div
            ref={terminalBodyRef}
            className="p-5 font-mono text-xs sm:text-sm min-h-[320px] max-h-[460px] overflow-y-auto space-y-4 bg-[#07090e]/95"
          >
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400">
                  <span className="text-purple-400">anubhav@ai-lab:~$</span>
                  <span className="text-white font-bold">{item.command}</span>
                </div>
                <div className="pl-4 border-l border-white/10">{item.response}</div>
              </div>
            ))}

            {/* Active Input Line */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
              <span className="text-purple-400 font-bold shrink-0">anubhav@ai-lab:~$</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="type a command (e.g. skills, projects, contact)..."
                className="w-full bg-transparent border-0 outline-none text-white font-mono placeholder:text-slate-600 focus:ring-0 p-0 text-xs sm:text-sm"
              />
              <button type="submit" className="text-slate-500 hover:text-purple-400">
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};

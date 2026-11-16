import React, { useEffect, useRef } from 'react';

interface ProjectCanvasScreenProps {
  projectId: string;
  className?: string;
  aspectRatio?: string;
}

const SW = 1024;
const SH = 640;
const SANS = '"Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
}

function chrome(g: CanvasRenderingContext2D, label: string) {
  g.fillStyle = 'rgba(255, 255, 255, 0.4)';
  g.font = `600 13px ${MONO}`;
  g.fillText(label, 36, 40);

  // Status beacons on top right
  g.textAlign = 'right';
  g.fillStyle = '#22ff00';
  g.beginPath();
  g.arc(SW - 36, 36, 4, 0, Math.PI * 2);
  g.fill();

  g.fillStyle = 'rgba(255, 255, 255, 0.6)';
  g.fillText('LIVE ENGINE ●', SW - 48, 40);
  g.textAlign = 'left';

  // Divider line
  g.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(36, 56);
  g.lineTo(SW - 36, 56);
  g.stroke();
}

export const ProjectCanvasScreen: React.FC<ProjectCanvasScreenProps> = ({
  projectId,
  className = '',
  aspectRatio = '16 / 10',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const g = canvas.getContext('2d');
    if (!g) return;

    let rafId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      const t = (now - startTime) / 1000;

      // Clear Canvas
      g.clearRect(0, 0, SW, SH);

      switch (projectId.toLowerCase()) {
        case 'unite-cbt':
        case 'unite_cbt': {
          // UNITE CBT Examination Engine
          const bg = g.createLinearGradient(0, 0, 0, SH);
          bg.addColorStop(0, '#070a14');
          bg.addColorStop(1, '#0f172a');
          g.fillStyle = bg;
          g.fillRect(0, 0, SW, SH);
          chrome(g, 'UNITE CBT // ONLINE EXAMINATION INFRASTRUCTURE');

          // Title
          g.fillStyle = '#fff';
          g.font = `800 64px ${SANS}`;
          g.fillText('UNITE CBT', 48, 130);

          g.font = `600 17px ${MONO}`;
          g.fillStyle = '#38bdf8';
          g.fillText('LOW-COST ONLINE UNIVERSITY CERTIFICATION EXAM PLATFORM', 50, 166);

          // Exam timer card
          rr(g, 48, 200, 440, 190, 14);
          g.fillStyle = '#0b1120';
          g.fill();
          g.strokeStyle = 'rgba(56, 189, 248, 0.3)';
          g.stroke();

          g.fillStyle = 'rgba(255, 255, 255, 0.5)';
          g.font = `600 12px ${MONO}`;
          g.fillText('EXAMINATION SESSION TIMER', 72, 232);

          const examSecs = Math.max(0, 7200 - Math.floor(t * 12));
          const h = String(Math.floor(examSecs / 3600)).padStart(2, '0');
          const m = String(Math.floor((examSecs % 3600) / 60)).padStart(2, '0');
          const s = String(examSecs % 60).padStart(2, '0');

          g.fillStyle = '#38bdf8';
          g.font = `800 52px ${MONO}`;
          g.fillText(`${h}:${m}:${s}`, 72, 296);

          g.fillStyle = '#94a3b8';
          g.font = `500 14px ${SANS}`;
          g.fillText('Active Candidates: 1,420 · Concurrent Sessions: 42', 72, 340);
          g.fillText('Auto-Save Status: Encrypted Sync Active ✓', 72, 365);

          // Server resource reduction metric card
          rr(g, 516, 200, 460, 190, 14);
          g.fillStyle = '#08171d';
          g.fill();
          g.strokeStyle = 'rgba(16, 185, 129, 0.35)';
          g.stroke();

          g.fillStyle = 'rgba(255, 255, 255, 0.5)';
          g.font = `600 12px ${MONO}`;
          g.fillText('INFRASTRUCTURE EFFICIENCY MONITOR', 540, 232);

          g.fillStyle = '#34d399';
          g.font = `800 44px ${MONO}`;
          g.fillText('OPTIMIZED', 540, 296);

          g.fillStyle = '#94a3b8';
          g.font = `500 14px ${SANS}`;
          g.fillText('Low server footprint design optimizes institutional bandwidth', 540, 340);
          g.fillText('and enables large-scale exams on standard cloud VPS.', 540, 365);

          // Question & Answer row simulation
          rr(g, 48, 416, SW - 96, 180, 14);
          g.fillStyle = '#0c1322';
          g.fill();
          g.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          g.stroke();

          g.fillStyle = '#c084fc';
          g.font = `700 14px ${MONO}`;
          g.fillText('QUESTION 18 OF 50 [DISTRIBUTED SYSTEMS]:', 72, 452);

          g.fillStyle = '#f8fafc';
          g.font = `500 17px ${SANS}`;
          g.fillText('Which consensus protocol guarantees safety under network partition conditions?', 72, 484);

          // Options pills
          const opts = ['A) 2-Phase Commit', 'B) Raft Consensus', 'C) Gossip Protocol', 'D) Paxos Variant'];
          let ox = 72;
          opts.forEach((opt, idx) => {
            const active = idx === 1;
            g.font = `600 13px ${MONO}`;
            const ow = g.measureText(opt).width + 24;
            rr(g, ox, 510, ow, 40, 8);
            g.fillStyle = active ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)';
            g.fill();
            g.fillStyle = active ? '#04101f' : '#cbd5e1';
            g.fillText(opt, ox + 12, 535);
            ox += ow + 12;
          });
          break;
        }

        case 'lotus-study':
        case 'lotus_study': {
          // Lotus Study Coaching Platform
          const bg = g.createLinearGradient(0, 0, 0, SH);
          bg.addColorStop(0, '#06131d');
          bg.addColorStop(1, '#0c2234');
          g.fillStyle = bg;
          g.fillRect(0, 0, SW, SH);
          chrome(g, 'LOTUS STUDY // OFFICIAL COACHING INSTITUTE PLATFORM');

          g.fillStyle = '#fff';
          g.font = `800 68px ${SANS}`;
          g.fillText('LOTUS STUDY', 48, 130);

          g.font = `600 17px ${MONO}`;
          g.fillStyle = '#38bdf8';
          g.fillText('RESPONSIVE EDUCATION WEB PLATFORM & STUDENT PORTAL', 50, 166);

          // Course Grid Simulation
          const courses = [
            { title: 'Mathematics & Logic', enrolled: '240 Students', tag: 'ACADEMIC CORE' },
            { title: 'Physical Sciences', enrolled: '190 Students', tag: 'FOUNDATIONS' },
            { title: 'Computer Applications', enrolled: '310 Students', tag: 'PRACTICAL LAB' },
          ];

          courses.forEach((c, idx) => {
            const cx = 48 + idx * 316;
            rr(g, cx, 206, 296, 220, 14);
            g.fillStyle = '#081a28';
            g.fill();
            g.strokeStyle = 'rgba(56, 189, 248, 0.25)';
            g.stroke();

            g.fillStyle = '#38bdf8';
            g.font = `700 11px ${MONO}`;
            g.fillText(c.tag, cx + 20, 240);

            g.fillStyle = '#ffffff';
            g.font = `700 20px ${SANS}`;
            g.fillText(c.title, cx + 20, 280);

            g.fillStyle = '#94a3b8';
            g.font = `500 14px ${SANS}`;
            g.fillText(c.enrolled, cx + 20, 314);
            g.fillText('Live Batches & Material Online', cx + 20, 340);

            rr(g, cx + 20, 370, 110, 32, 6);
            g.fillStyle = 'rgba(56, 189, 248, 0.2)';
            g.fill();
            g.fillStyle = '#38bdf8';
            g.font = `600 12px ${MONO}`;
            g.fillText('EXPLORE →', cx + 32, 391);
          });

          // Bottom telemetry bar
          rr(g, 48, 456, SW - 96, 140, 14);
          g.fillStyle = '#06101a';
          g.fill();
          g.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          g.stroke();

          g.fillStyle = '#34d399';
          g.font = `700 14px ${MONO}`;
          g.fillText('LIVE STATUS // LOTUSSTUDY.CT.WS', 72, 494);

          g.fillStyle = '#f8fafc';
          g.font = `500 15px ${SANS}`;
          g.fillText('Responsive frontend optimized for high mobile traffic and fast load speeds across UP regions.', 72, 526);
          g.fillText('Tech Stack: Semantic HTML5, Modular CSS, Node.js API endpoints, and clean academic presentation.', 72, 554);
          break;
        }

        case 'stwai': {
          // STWAI: Multi-Model AI Chat Interface
          const bg = g.createLinearGradient(0, 0, 0, SH);
          bg.addColorStop(0, '#0e0517');
          bg.addColorStop(1, '#260b3d');
          g.fillStyle = bg;
          g.fillRect(0, 0, SW, SH);
          chrome(g, 'STWAI // MULTI-MODEL AI INTERFACE');

          g.fillStyle = '#fff';
          g.font = `800 72px ${SANS}`;
          g.fillText('STWAI', 48, 130);

          g.font = `600 17px ${MONO}`;
          g.fillStyle = '#c084fc';
          g.fillText('MULTI-MODEL INTELLIGENCE & SIDE-BY-SIDE RESPONSE COMPARISON', 50, 166);

          // Model selection pills
          const models = ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'DeepSeek-V3'];
          let mx = 48;
          models.forEach((m, idx) => {
            const active = Math.floor(t * 0.7) % models.length === idx;
            g.font = `600 13px ${MONO}`;
            const tw = g.measureText(m).width + 30;
            rr(g, mx, 196, tw, 36, 18);
            g.fillStyle = active ? '#a855f7' : 'rgba(255, 255, 255, 0.08)';
            g.fill();
            g.fillStyle = active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
            g.fillText(m, mx + 15, 219);
            mx += tw + 12;
          });

          // Comparison window
          rr(g, 48, 252, SW - 96, 340, 14);
          g.fillStyle = 'rgba(9, 3, 15, 0.85)';
          g.fill();
          g.strokeStyle = 'rgba(168, 85, 247, 0.35)';
          g.stroke();

          g.fillStyle = '#ffffffaa';
          g.font = `600 12px ${MONO}`;
          g.fillText('PROMPT BENCHMARK // SYNTAX HIGHLIGHTING & RESPONSE STREAM', 72, 286);

          const lines = [
            ['PROMPT > ', 'Compare zero-shot reasoning vs chain-of-thought in modern LLMs.'],
            ['GPT-4o > ', 'Chain-of-thought prompts induce step-by-step intermediate inference paths.'],
            ['CLAUDE > ', 'CoT reduces hallucination by grounding calculations in previous token steps.'],
            ['GEMINI > ', 'Multi-modal contexts leverage native cross-attention before synthesis.'],
            ['STREAM > ', 'Connected · SSE latency 14ms · Model pool: 4 active models'],
          ];

          lines.forEach(([role, text], i) => {
            const y = 328 + i * 46;
            g.fillStyle = i === 0 ? '#38bdf8' : i === 4 ? '#34d399' : '#c084fc';
            g.font = `700 14px ${MONO}`;
            g.fillText(role, 72, y);
            g.fillStyle = '#f1f5f9';
            g.font = `500 15px ${SANS}`;
            g.fillText(text, 72 + g.measureText(role).width + 10, y);
          });
          break;
        }

        case 'stw-verify':
        case 'stw_verify': {
          // STW-Verify OTP Engine
          g.fillStyle = '#050b11';
          g.fillRect(0, 0, SW, SH);
          chrome(g, 'STW-VERIFY // TOKEN-SCOPED OTP ENGINE');

          g.fillStyle = '#fff';
          g.font = `800 70px ${SANS}`;
          g.fillText('STW-Verify', 48, 130);

          g.font = `600 17px ${MONO}`;
          g.fillStyle = '#38bdf8';
          g.fillText('TOKEN-SCOPED OTP API · REDIS STORAGE · QUEUED DELIVERY', 50, 166);

          // Live OTP Code
          const left = 20 - (t % 20);
          const code = '849 201';

          g.font = `800 84px ${MONO}`;
          g.fillStyle = '#38bdf8';
          g.fillText(code, 48, 280);

          // Circular countdown timer
          g.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          g.lineWidth = 8;
          g.beginPath();
          g.arc(780, 240, 70, 0, Math.PI * 2);
          g.stroke();

          g.strokeStyle = left < 5 ? '#ef4444' : '#38bdf8';
          g.lineCap = 'round';
          g.beginPath();
          g.arc(780, 240, 70, -Math.PI / 2, -Math.PI / 2 + (left / 20) * Math.PI * 2);
          g.stroke();

          g.font = `700 40px ${MONO}`;
          g.textAlign = 'center';
          g.fillStyle = '#fff';
          g.fillText(`${Math.ceil(left)}s`, 780, 254);
          g.textAlign = 'left';

          // Security status cards
          const checks = [
            ['TTL STATUS', 'Redis Key Expiration: 300s Sliding TTL'],
            ['RATE LIMIT', 'IP & Email Scope Guard: Max 3 requests / 10min'],
            ['DISPATCH', 'Nodemailer Asynchronous Worker Queue Active'],
          ];
          checks.forEach(([title, desc], i) => {
            const y = 340 + i * 80;
            rr(g, 48, y, SW - 96, 62, 12);
            g.fillStyle = '#0d1b2a';
            g.fill();
            g.strokeStyle = 'rgba(56, 189, 248, 0.25)';
            g.stroke();

            g.fillStyle = '#38bdf8';
            g.font = `700 13px ${MONO}`;
            g.fillText(title, 72, y + 36);

            g.fillStyle = '#f8fafc';
            g.font = `500 15px ${SANS}`;
            g.fillText(desc, 220, y + 36);
          });
          break;
        }

        case 'md-to-pdf':
        case 'md_to_pdf': {
          // MD_TO_PDF Live Compiler
          g.fillStyle = '#0b0f19';
          g.fillRect(0, 0, SW, SH);
          chrome(g, 'MD_TO_PDF // COMPILER & RENDERER');

          g.fillStyle = '#fff';
          g.font = `800 70px ${SANS}`;
          g.fillText('MD_TO_PDF', 48, 130);

          g.font = `600 17px ${SANS}`;
          g.fillStyle = '#818cf8';
          g.fillText('Monaco Live Preview Editor with Server-Side Puppeteer PDF Engine', 50, 166);

          // Left side: Markdown Source
          rr(g, 48, 206, 430, 380, 14);
          g.fillStyle = '#111827';
          g.fill();
          g.strokeStyle = 'rgba(129, 140, 248, 0.25)';
          g.stroke();

          g.fillStyle = '#818cf8';
          g.font = `700 12px ${MONO}`;
          g.fillText('INPUT // MARKDOWN SOURCE', 68, 238);

          const mdLines = [
            '# System Architecture',
            '',
            '## 1. Overview',
            'High-speed document compiler.',
            '- Monaco Editor bindings',
            '- KaTeX equation rendering',
            '- Dynamic page breaking',
            '- Zero telemetry overhead',
          ];
          mdLines.forEach((l, i) => {
            g.fillStyle = l.startsWith('#') ? '#c084fc' : l.startsWith('-') ? '#38bdf8' : '#94a3b8';
            g.font = `500 14px ${MONO}`;
            g.fillText(l, 68, 276 + i * 32);
          });

          // Right side: Compiled PDF sheet
          rr(g, 510, 206, 466, 380, 14);
          g.fillStyle = '#ffffff';
          g.fill();

          g.fillStyle = '#1e293b';
          g.font = `800 22px ${SANS}`;
          g.fillText('System Architecture', 538, 252);

          g.fillStyle = '#64748b';
          g.font = `600 15px ${SANS}`;
          g.fillText('1. Overview', 538, 286);

          g.fillStyle = '#334155';
          g.font = `400 14px ${SANS}`;
          g.fillText('High-speed document compilation through server-side headless', 538, 318);
          g.fillText('Puppeteer PDF generation and dynamic CSS print styling.', 538, 342);

          rr(g, 538, 380, 410, 150, 8);
          g.fillStyle = '#f8fafc';
          g.fill();
          g.strokeStyle = '#e2e8f0';
          g.stroke();

          g.fillStyle = '#0f172a';
          g.font = `700 14px ${MONO}`;
          g.fillText('PUPPETEER ENGINE: READY', 558, 416);

          g.fillStyle = '#64748b';
          g.font = `500 13px ${MONO}`;
          g.fillText('Export Format: ISO A4 Print Standard', 558, 448);
          g.fillText('Rendering Pipeline: Headless Chromium', 558, 476);
          g.fillText('Status: Generation Completed ✓', 558, 504);
          break;
        }

        case 'commit-stw':
        case 'commit_stw': {
          // COMMIT-STW AI Git Pipeline
          g.fillStyle = '#06090e';
          g.fillRect(0, 0, SW, SH);
          chrome(g, 'COMMIT-STW // AI GIT PIPELINE');

          g.fillStyle = '#fff';
          g.font = `800 70px ${SANS}`;
          g.fillText('COMMIT-STW', 48, 130);

          g.font = `600 17px ${MONO}`;
          g.fillStyle = '#34d399';
          g.fillText('AI-ASSISTED GIT COMMIT GENERATOR & REPO AUTOMATION', 50, 166);

          rr(g, 48, 206, SW - 96, 380, 14);
          g.fillStyle = '#0c131d';
          g.fill();
          g.strokeStyle = 'rgba(16, 185, 129, 0.3)';
          g.stroke();

          const termLines = [
            ['$', 'commit-stw --scan .'],
            ['✓', 'Detected staged changes in 8 files across backend/ and api/'],
            ['AI', 'Analyzing git diff through Hugging Face model inference...'],
            ['MSG', 'feat(auth): add token-scoped rate limiting and Redis OTP store'],
            ['✓', 'Octokit API verified credentials · Pushing commit to GitHub'],
            ['✓', 'Push complete: origin/main up-to-date with remote HEAD'],
          ];
          termLines.forEach(([glyph, text], i) => {
            const y = 260 + i * 52;
            g.fillStyle = glyph === '$' ? '#38bdf8' : glyph === '✓' ? '#34d399' : '#a855f7';
            g.font = `700 17px ${MONO}`;
            g.fillText(glyph, 76, y);

            g.fillStyle = '#e2e8f0';
            g.font = `500 15px ${MONO}`;
            g.fillText(text, 116, y);
          });
          break;
        }

        default: {
          // Generic high-tech terminal preview for other repositories
          g.fillStyle = '#070a12';
          g.fillRect(0, 0, SW, SH);
          chrome(g, `REPOSITORY ARCHIVE // ${projectId.toUpperCase()}`);

          g.fillStyle = '#fff';
          g.font = `800 68px ${SANS}`;
          g.fillText(projectId.toUpperCase(), 48, 130);

          g.font = `600 17px ${MONO}`;
          g.fillStyle = '#c084fc';
          g.fillText('VERIFIED PUBLIC GITHUB CODEBASE · STACK INTEGRATION', 50, 166);

          rr(g, 48, 206, SW - 96, 380, 14);
          g.fillStyle = '#0a0f1c';
          g.fill();
          g.strokeStyle = 'rgba(168, 85, 247, 0.25)';
          g.stroke();

          const lines = [
            ['SYS >', `Inspecting repository telemetry for ${projectId}...`],
            ['STATUS >', 'Code verified on GitHub @stwanubhav · Public branch active'],
            ['RUNTIME >', 'Python / JavaScript asynchronous worker queues & APIs'],
            ['AUDIT >', 'Clean architecture, zero percentage meters, strict error handling'],
            ['DOCS >', 'Complete instructions and setup scripts in repository README'],
          ];
          lines.forEach(([prefix, text], i) => {
            const y = 264 + i * 54;
            g.fillStyle = '#38bdf8';
            g.font = `700 15px ${MONO}`;
            g.fillText(prefix, 76, y);

            g.fillStyle = '#e2e8f0';
            g.font = `500 15px ${SANS}`;
            g.fillText(text, 170, y);
          });
          break;
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(rafId);
  }, [projectId]);

  return (
    <div
      className={`cx-archive-frame relative overflow-hidden rounded-2xl border-4 border-[#0e121d] bg-[#07090e] shadow-2xl ${className}`}
      style={{ aspectRatio }}
    >
      <canvas
        ref={canvasRef}
        width={SW}
        height={SH}
        className="w-full h-full block object-contain"
      />
      {/* Subtle CRT Raster on Screen Frame */}
      <div
        className="absolute inset-0 pointer-events-none crt-scanlines opacity-20"
        aria-hidden="true"
      />
    </div>
  );
};

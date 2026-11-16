const CREW = [
  ["yash", "#06b6d4"],
  ["sushil", "#3a86ff"],
  ["pramod", "#22c55e"],
  ["om", "#f59e0b"],
  ["vaishali", "#a855f7"],
  ["pravan", "#ff4d6d"],
  ["salu", "#ec4899"],
  ["asmit", "#eab308"],
  ["sarkar", "#f97316"],
  ["shiv", "#14b8a6"],
] as const;

type Phase = "fly" | "drag" | "idle" | "exit" | "gone";

type Agent = {
  el: HTMLDivElement;
  box: HTMLDivElement;
  badge: HTMLSpanElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  phase: Phase;
  task?: HTMLElement;
  p: number;
  dur: number;
  seed: number;
  from?: [number, number];
  start?: number;
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

function cursorSvg(color: string) {
  return `<svg width="22" height="24" viewBox="0 0 22 24" fill="none"><path d="M2 2l7.5 19 2.8-7.7L20 10.6z" fill="${color}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
}

const BIN = `<div class="sw-lid"><svg width="58" height="16" viewBox="0 0 58 16" fill="none"><rect x="2" y="7" width="54" height="6" rx="2" fill="#e9ecef"/><rect x="21" y="2" width="16" height="6" rx="2" fill="#e9ecef"/></svg></div>
<svg width="58" height="60" viewBox="0 0 58 60" fill="none"><path d="M6 2h46l-4 54a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" fill="#1b1d22" stroke="#e9ecef" stroke-width="2.5"/><path d="M20 14v34M29 14v34M38 14v34" stroke="#e9ecef80" stroke-width="2.5" stroke-linecap="round"/></svg>`;

export function startSwarm(root: HTMLElement) {
  const targets = [...root.querySelectorAll<HTMLElement>("[data-build]")];
  const reveal = (el: HTMLElement) => {
    el.classList.remove("sw-hidden");
    el.classList.add("sw-reveal");
  };

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach(reveal);
    return () => {};
  }

  const touch = matchMedia("(pointer: coarse)").matches;
  const queue = targets.slice();
  queue.forEach((el) => el.classList.add("sw-hidden"));

  const layer = document.createElement("div");
  layer.className = "sw-layer";
  document.body.appendChild(layer);

  const agents: Agent[] = CREW.slice(0, touch ? 5 : CREW.length).map(([name, color], i) => {
    const box = document.createElement("div");
    box.className = "sw-box";
    box.style.setProperty("--c", color);
    const badge = document.createElement("span");
    box.appendChild(badge);
    const el = document.createElement("div");
    el.className = "sw-cursor";
    el.innerHTML = `${cursorSvg(color)}<span style="background:${color}">${name}</span>`;
    layer.append(box, el);
    const edge = i % 4;
    const x = edge === 0 ? -40 : edge === 1 ? window.innerWidth + 40 : Math.random() * window.innerWidth;
    const y = edge === 2 ? -40 : edge === 3 ? window.innerHeight + 40 : Math.random() * window.innerHeight;
    return { el, box, badge, x, y, vx: 0, vy: 0, s: 1, phase: "idle", p: 0, dur: 0.5, seed: Math.random() * 100 };
  });

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, at: 0 };
  const onMove = (e: PointerEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.at = performance.now();
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  let bin: HTMLDivElement | undefined;
  let exitAt = 0;
  let idleSince = 0;
  let raf = 0;
  let last = performance.now();

  function exit(now: number) {
    if (exitAt) return;
    exitAt = now;
    queue.splice(0).forEach(reveal);
    bin = document.createElement("div");
    bin.className = "sw-bin";
    bin.innerHTML = BIN;
    layer.appendChild(bin);
    requestAnimationFrame(() => bin?.classList.add("is-open"));

    const order = agents.slice().sort(
      (a, b) =>
        Math.hypot(window.innerWidth - a.x, window.innerHeight - a.y) -
        Math.hypot(window.innerWidth - b.x, window.innerHeight - b.y)
    );

    order.forEach((a, i) => {
      if (a.task) reveal(a.task);
      a.task = undefined;
      a.box.style.opacity = "0";
      a.phase = "exit";
      a.start = now + 400 + i * 110;
      a.el.classList.add("is-leaving");
    });
  }

  const onFocus = (e: Event) => {
    if ((e.target as HTMLElement).matches?.("input, textarea")) exit(performance.now());
  };
  window.addEventListener("focusin", onFocus);

  function next(): HTMLElement | undefined {
    for (let i = 0; i < queue.length; i++) {
      const el = queue[i];
      if (!el.isConnected) {
        queue.splice(i--, 1);
        continue;
      }
      const r = el.getBoundingClientRect();
      if (r.bottom < -40) {
        queue.splice(i--, 1);
        reveal(el);
        continue;
      }
      if (r.top < window.innerHeight * 1.05) {
        queue.splice(i, 1);
        return el;
      }
      break;
    }
  }

  function flock(a: Agent, i: number, now: number, dt: number) {
    const fresh = now - mouse.at < 3500 && !touch;
    const ang = now / 2600 + (i / agents.length) * Math.PI * 2;
    const radius = 90 + 40 * Math.sin(now / 900 + a.seed);
    const cx = fresh ? mouse.x : window.innerWidth / 2 + Math.sin(now / 5000 + a.seed) * window.innerWidth * 0.3;
    const cy = fresh ? mouse.y : window.innerHeight * 0.55 + Math.cos(now / 6000 + a.seed) * window.innerHeight * 0.25;
    let ax = (cx + Math.cos(ang) * radius - a.x) * 3;
    let ay = (cy + Math.sin(ang) * radius - a.y) * 3;

    agents.forEach((b) => {
      if (b === a || b.phase === "gone") return;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d < 46) {
        ax += (dx / d) * (46 - d) * 30;
        ay += (dy / d) * (46 - d) * 30;
      }
    });

    const md = Math.hypot(a.x - mouse.x, a.y - mouse.y) || 1;
    if (fresh && md < 60) {
      ax += ((a.x - mouse.x) / md) * (60 - md) * 40;
      ay += ((a.y - mouse.y) / md) * (60 - md) * 40;
    }

    a.vx = (a.vx + ax * dt) * Math.exp(-3 * dt);
    a.vy = (a.vy + ay * dt) * Math.exp(-3 * dt);
    a.x += a.vx * dt;
    a.y += a.vy * dt;
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    const mx = bin ? bin.offsetLeft + bin.offsetWidth / 2 - 4 : 0;
    const my = bin ? bin.offsetTop + 10 : 0;

    agents.forEach((a, i) => {
      if (a.phase === "idle" && !exitAt) {
        a.task = next();
        if (a.task) {
          a.phase = "fly";
          a.p = 0;
          a.vx = 0;
          a.vy = 0;
        }
      }

      if (a.task && !a.task.isConnected) {
        a.task = undefined;
        a.phase = "idle";
        a.box.style.opacity = "0";
      }

      const r = a.task?.getBoundingClientRect();

      if (a.phase === "fly" && r) {
        const k = 1 - Math.exp(-7 * dt);
        const dx = r.left - a.x;
        const dy = r.top - a.y;
        a.x += dx * k + Math.sin(now / 300 + a.seed) * 0.6;
        a.y += dy * k;
        if (Math.hypot(dx, dy) < 8) {
          a.phase = "drag";
          a.p = 0;
          a.dur = Math.min(0.85, 0.28 + (r.width * r.height) / 850000);
          a.box.style.opacity = "1";
        }
      } else if (a.phase === "drag" && r) {
        a.p = Math.min(1, a.p + dt / a.dur);
        const w = r.width * ease(a.p);
        const h = r.height * ease(a.p);
        a.x = r.left + w;
        a.y = r.top + h;
        a.box.style.transform = `translate3d(${r.left}px, ${r.top}px, 0)`;
        a.box.style.width = `${w}px`;
        a.box.style.height = `${h}px`;
        a.badge.textContent = `${Math.round(w)} × ${Math.round(h)}`;
        if (a.p >= 1) {
          reveal(a.task!);
          a.task = undefined;
          a.phase = "idle";
          setTimeout(() => (a.box.style.opacity = "0"), 120);
        }
      } else if (a.phase === "idle") {
        flock(a, i, now, dt);
      } else if (a.phase === "exit" && bin) {
        if (now < a.start!) {
          const k = 1 - Math.exp(-1.6 * dt);
          a.x += (mx - a.x) * k * 0.6;
          a.y += (my - a.y) * k * 0.6;
        } else {
          a.from ??= [a.x, a.y];
          const t = clamp01((now - a.start!) / 650);
          const e = t * t * (3 - 2 * t);
          const [fx, fy] = a.from;
          const cx = (fx + mx) / 2;
          const cy = Math.min(fy, my) - Math.min(90, Math.hypot(mx - fx, my - fy) * 0.25);
          a.x = (1 - e) * (1 - e) * fx + 2 * (1 - e) * e * cx + e * e * mx;
          a.y = (1 - e) * (1 - e) * fy + 2 * (1 - e) * e * cy + e * e * my;
          a.el.style.opacity = String(1 - clamp01((t - 0.8) / 0.2));
          a.s = 1 - 0.65 * t * t;
          if (t >= 1) {
            a.phase = "gone";
            a.el.style.opacity = "0";
          }
        }
      }

      if (a.phase !== "gone") {
        a.el.style.transform = `translate3d(${a.x}px, ${a.y}px, 0) scale(${a.s})`;
      }
    });

    if (!exitAt) {
      const done = queue.every((el) => !el.isConnected) && agents.every((a) => a.phase === "idle");
      if (done) {
        idleSince ||= now;
        if (now - idleSince > 600) exit(now);
      } else {
        idleSince = 0;
      }
    } else if (bin && agents.every((a) => a.phase === "gone") && !bin.classList.contains("is-closed")) {
      bin.classList.add("is-closed");
      setTimeout(() => bin?.classList.add("is-out"), 700);
      setTimeout(() => {
        cancelAnimationFrame(raf);
        layer.remove();
      }, 1150);
    }
  }

  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("focusin", onFocus);
    targets.forEach((el) => el.classList.remove("sw-hidden", "sw-reveal"));
    layer.remove();
  };
}

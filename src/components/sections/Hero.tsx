"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { COMPANY } from "@/lib/constants";

const TAU = Math.PI * 2;

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  activation: number;
  phase: number;
}

interface Connection {
  from: number;
  to: number;
}

interface Signal {
  connIdx: number;
  progress: number;
  speed: number;
  generation: number;
}

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let mx = -1, my = -1;
    let t = 0;
    let lastTime = 0;
    let nodes: Node[] = [];
    let connections: Connection[] = [];
    let signals: Signal[] = [];
    let animId = 0;
    let lastThoughtTime = 0;
    let isVisible = true;
    // Count how many signals are on each connection
    function getConnSignalCounts(): Uint8Array {
      const counts = new Uint8Array(connections.length);
      for (const sig of signals) {
        if (sig.connIdx < counts.length) counts[sig.connIdx]++;
      }
      return counts;
    }

    // Check if a node has any active signals touching it
    function nodeHasActiveSignals(nodeIdx: number, connCounts: Uint8Array): boolean {
      for (let ci = 0; ci < connections.length; ci++) {
        const c = connections[ci];
        if ((c.from === nodeIdx || c.to === nodeIdx) && connCounts[ci] > 0) return true;
      }
      return false;
    }

    function fireThought() {
      if (nodes.length === 0) return;

      const connCounts = getConnSignalCounts();

      // Only pick from nodes with zero active signals
      const quietNodes: number[] = [];
      for (let i = 0; i < nodes.length; i++) {
        if (!nodeHasActiveSignals(i, connCounts)) quietNodes.push(i);
      }
      if (quietNodes.length === 0) return; // everything is busy, skip

      const startIdx = quietNodes[Math.floor(Math.random() * quietNodes.length)];
      nodes[startIdx].activation = 1;

      const outConns = connections
        .map((c, idx) => ({ c, idx }))
        .filter(({ c }) => c.from === startIdx || c.to === startIdx)
        .filter(({ idx }) => connCounts[idx] < 1);
      for (const { c, idx } of outConns) {
        const goingForward = c.from === startIdx;
        signals.push({
          connIdx: idx,
          progress: goingForward ? 0 : 1,
          speed: goingForward
            ? 0.15 + Math.random() * 0.1
            : -(0.15 + Math.random() * 0.1),
          generation: 1,
        });
      }
    }

    function initNetwork(w: number, h: number) {
      nodes = [];
      connections = [];
      signals = [];

      // Dense grid layout — more nodes, tighter spacing, smaller text clear zone
      const cols = 14;
      const rows = 7;
      const padX = w * 0.04;
      const padY = h * 0.05;
      const spacingX = (w - padX * 2) / (cols - 1);
      const spacingY = (h - padY * 2) / (rows - 1);

      // Text clear zone — tight around the core text
      const textX1 = w * 0.35, textX2 = w * 0.65;
      const textY1 = h * 0.3, textY2 = h * 0.7;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = padX + c * spacingX;
          const by = padY + r * spacingY;

          // Skip nodes deep inside the text zone
          // But allow nodes on the edges of the zone (within 1 grid step)
          const inTextX = bx > textX1 && bx < textX2;
          const inTextY = by > textY1 && by < textY2;
          const nearEdgeX = bx > (textX1 - spacingX * 0.3) && bx < (textX2 + spacingX * 0.3);
          const nearEdgeY = by > (textY1 - spacingY * 0.3) && by < (textY2 + spacingY * 0.3);
          const isDeepInside = inTextX && inTextY && !(
            // Keep nodes that are within 1 step of the text zone edge
            (bx < textX1 + spacingX * 0.8 || bx > textX2 - spacingX * 0.8) ||
            (by < textY1 + spacingY * 0.8 || by > textY2 - spacingY * 0.8)
          );

          if (isDeepInside) continue;

          // Add small jitter for organic feel
          const jx = (Math.random() - 0.5) * spacingX * 0.25;
          const jy = (Math.random() - 0.5) * spacingY * 0.25;
          const nx = bx + jx;
          const ny = by + jy;

          // Nodes near text zone are slightly smaller/dimmer
          const nearText = inTextX && inTextY;
          const radius = nearText ? 1.8 + Math.random() * 0.8 : 2.5 + Math.random() * 1.2;

          nodes.push({
            x: nx, y: ny,
            baseX: nx, baseY: ny,
            radius,
            activation: 0,
            phase: Math.random() * TAU,
          });
        }
      }

      // Connect nodes: each node to 3-5 nearest neighbors
      // Prefer rightward connections for left→right signal flow
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dists = nodes
          .map((other, j) => ({
            j,
            dist: Math.hypot(n.baseX - other.baseX, n.baseY - other.baseY),
            dx: other.baseX - n.baseX,
          }))
          .filter(({ j, dist }) => j !== i && dist < spacingX * 2.8)
          .sort((a, b) => a.dist - b.dist);

        const rightward = dists.filter(d => d.dx > 10);
        let picks = 0;
        const maxConns = 3 + Math.floor(Math.random() * 2); // 3-4 connections

        // Prefer rightward
        for (const d of rightward) {
          if (picks >= maxConns) break;
          const exists = connections.some(c =>
            (c.from === i && c.to === d.j) || (c.from === d.j && c.to === i)
          );
          if (!exists) {
            connections.push({ from: i, to: d.j });
            picks++;
          }
        }

        // Fill remaining from any direction
        for (const d of dists) {
          if (picks >= Math.max(2, maxConns)) break;
          const exists = connections.some(c =>
            (c.from === i && c.to === d.j) || (c.from === d.j && c.to === i)
          );
          if (!exists) {
            connections.push({ from: i, to: d.j });
            picks++;
          }
        }
      }

      lastThoughtTime = performance.now() - 4000;
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        initNetwork(rect.width, rect.height);
      }
    }

    function draw(now: number) {
      animId = requestAnimationFrame(draw);

      if (!isVisible) {
        lastTime = 0;
        return;
      }

      if (!lastTime) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      t += dt;

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      ctx.fillStyle = "#052e16";
      ctx.fillRect(0, 0, w, h);

      // Auto-fire thoughts every ~3-5s from random quiet nodes
      if (now - lastThoughtTime > 3000 + Math.random() * 2000) {
        lastThoughtTime = now;
        fireThought();
      }

      // Update nodes
      for (const node of nodes) {
        node.x = node.baseX + Math.sin(t * 0.4 + node.phase) * 3 + Math.sin(t * 0.25 + node.phase * 2) * 2;
        node.y = node.baseY + Math.cos(t * 0.35 + node.phase * 1.3) * 3 + Math.cos(t * 0.2 + node.phase) * 2;

        if (mx > 0 && my > 0) {
          const dx = node.x - mx;
          const dy = node.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < 150 && dist > 1) {
            const f = (1 - dist / 150) * 12;
            node.x += (dx / dist) * f;
            node.y += (dy / dist) * f;
          }
        }

        node.activation = Math.max(0, node.activation * 0.98);
      }

      // Build live signal count per connection for the 2-per-line cap
      const liveConnCounts = new Uint8Array(connections.length);
      for (const sig of signals) {
        if (sig.connIdx < liveConnCounts.length) liveConnCounts[sig.connIdx]++;
      }

      // Update signals
      for (let i = signals.length - 1; i >= 0; i--) {
        const sig = signals[i];
        sig.progress += sig.speed * dt;

        const isReverse = sig.speed < 0;
        const done = isReverse ? sig.progress <= 0 : sig.progress >= 1;

        if (done) {
          const conn = connections[sig.connIdx];
          if (conn) {
            // Activate the node we arrived at
            const arrivedAt = isReverse ? conn.from : conn.to;
            const cameFrom = isReverse ? conn.to : conn.from;
            nodes[arrivedAt].activation = Math.min(1, nodes[arrivedAt].activation + 0.8);

            // Nuclear chain reaction — split to ALL connections from this node
            const hitNode = arrivedAt;
            const allOutConns = connections
              .map((c, idx) => ({ c, idx }))
              .filter(({ c }) => c.from === hitNode || c.to === hitNode)
              .filter(({ c }) => {
                const otherEnd = c.from === hitNode ? c.to : c.from;
                return otherEnd !== cameFrom;
              });
            const nextGen = sig.generation + 1;
            if (allOutConns.length > 0 && nextGen <= 14) {
              const speedMultiplier = 1 + nextGen * 0.15;
              for (const { c, idx } of allOutConns) {
                // Max 2 signals per connection
                if (liveConnCounts[idx] >= 1) continue;

                const goingForward = c.from === hitNode;
                const baseSpeed = (0.15 + Math.random() * 0.2) * speedMultiplier;
                if (goingForward) {
                  signals.push({
                    connIdx: idx,
                    progress: 0,
                    speed: baseSpeed,
                    generation: nextGen,
                  });
                } else {
                  signals.push({
                    connIdx: idx,
                    progress: 1,
                    speed: -baseSpeed,
                    generation: nextGen,
                  });
                }
                liveConnCounts[idx]++;
              }
            }
          }
          // Decrement count for the connection this signal was on
          if (liveConnCounts[sig.connIdx] > 0) liveConnCounts[sig.connIdx]--;
          signals.splice(i, 1);
        }
      }

      if (signals.length > 2000) {
        signals.splice(0, signals.length - 2000);
      }

      // Track active connections
      const activeConns = new Map<number, { maxProgress: number; generation: number }>();
      for (const sig of signals) {
        const existing = activeConns.get(sig.connIdx);
        if (!existing || sig.progress > existing.maxProgress) {
          activeConns.set(sig.connIdx, { maxProgress: sig.progress, generation: sig.generation });
        }
      }

      function sigHue(gen: number): number {
        return 155 + Math.min(gen, 6) * 5;
      }

      // ── DRAW CONNECTIONS ──
      for (let i = 0; i < connections.length; i++) {
        const conn = connections[i];
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        const active = activeConns.get(i);

        // Base line — clean and visible
        const baseAlpha = 0.15 + (from.activation + to.activation) * 0.12;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = `hsla(155, 30%, 48%, ${baseAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glow overlay when signal is traveling
        if (active) {
          const hue = sigHue(active.generation);
          const glowAlpha = 0.15 + active.maxProgress * 0.3;
          const gr = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
          gr.addColorStop(0, `hsla(${hue}, 45%, 50%, ${glowAlpha * 0.15})`);
          gr.addColorStop(Math.max(0, active.maxProgress - 0.12), `hsla(${hue}, 55%, 58%, ${glowAlpha})`);
          gr.addColorStop(Math.min(1, active.maxProgress + 0.05), `hsla(${hue}, 55%, 58%, ${glowAlpha})`);
          gr.addColorStop(Math.min(1, active.maxProgress + 0.15), `hsla(${hue}, 45%, 50%, 0)`);
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = gr;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      }

      // ── DRAW SIGNALS ──
      for (const sig of signals) {
        const conn = connections[sig.connIdx];
        if (!conn) continue;
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        const hue = sigHue(sig.generation);

        // Progress along the line (0→1 for forward, 1→0 for reverse)
        const p = Math.max(0, Math.min(1, sig.progress));
        const px = from.x + (to.x - from.x) * p;
        const py = from.y + (to.y - from.y) * p;

        // Fade based on how far along the signal is in its travel
        const traveled = sig.speed > 0 ? p : (1 - p);
        const fadeIn = Math.min(traveled / 0.1, 1);
        const fadeOut = Math.min((1 - traveled) / 0.15, 1);
        const intensity = fadeIn * fadeOut;

        // Outer bloom
        const gr2 = ctx.createRadialGradient(px, py, 0, px, py, 20);
        gr2.addColorStop(0, `hsla(${hue}, 65%, 65%, ${0.3 * intensity})`);
        gr2.addColorStop(0.4, `hsla(${hue}, 55%, 55%, ${0.08 * intensity})`);
        gr2.addColorStop(1, `hsla(${hue}, 45%, 45%, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, 20, 0, TAU);
        ctx.fillStyle = gr2;
        ctx.fill();

        // Inner glow
        const gr = ctx.createRadialGradient(px, py, 0, px, py, 6);
        gr.addColorStop(0, `hsla(${hue}, 85%, 85%, ${0.8 * intensity})`);
        gr.addColorStop(0.5, `hsla(${hue}, 65%, 60%, ${0.2 * intensity})`);
        gr.addColorStop(1, `hsla(${hue}, 50%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, TAU);
        ctx.fillStyle = gr;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, TAU);
        ctx.fillStyle = `hsla(${hue}, 90%, 93%, ${0.95 * intensity})`;
        ctx.fill();

        // Trail line — follows behind the signal
        const trailLen = 0.25;
        const ts = sig.speed > 0
          ? Math.max(0, p - trailLen)
          : Math.min(1, p + trailLen);
        const tx = from.x + (to.x - from.x) * ts;
        const ty = from.y + (to.y - from.y) * ts;

        const trailGr = ctx.createLinearGradient(tx, ty, px, py);
        trailGr.addColorStop(0, `hsla(${hue}, 45%, 50%, 0)`);
        trailGr.addColorStop(0.5, `hsla(${hue}, 55%, 55%, ${0.08 * intensity})`);
        trailGr.addColorStop(1, `hsla(${hue}, 60%, 60%, ${0.25 * intensity})`);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.strokeStyle = trailGr;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.lineCap = "butt";
      }

      // ── DRAW NODES ──
      for (const node of nodes) {
        const a = node.activation;
        const pulse = Math.sin(t * 1.5 + node.phase) * 0.5 + 0.5;

        // Activation bloom
        if (a > 0.05) {
          const glowR = node.radius * (4 + a * 5);
          const gr = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR);
          gr.addColorStop(0, `hsla(155, 65%, 65%, ${a * 0.4})`);
          gr.addColorStop(0.4, `hsla(155, 55%, 55%, ${a * 0.12})`);
          gr.addColorStop(1, "hsla(155, 45%, 45%, 0)");
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowR, 0, TAU);
          ctx.fillStyle = gr;
          ctx.fill();
        }

        // Subtle pulse
        if (pulse > 0.6) {
          const pulseR = node.radius * 2.5;
          const pgr = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseR);
          pgr.addColorStop(0, `hsla(155, 50%, 55%, ${(pulse - 0.6) * 0.06})`);
          pgr.addColorStop(1, "hsla(155, 40%, 45%, 0)");
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseR, 0, TAU);
          ctx.fillStyle = pgr;
          ctx.fill();
        }

        // Node body
        const bodyAlpha = 0.4 + a * 0.5 + pulse * 0.1;
        const lightness = 45 + a * 25 + pulse * 8;
        const bodyGr = ctx.createRadialGradient(
          node.x - node.radius * 0.3, node.y - node.radius * 0.3, 0,
          node.x, node.y, node.radius
        );
        bodyGr.addColorStop(0, `hsla(155, 60%, ${lightness + 12}%, ${bodyAlpha})`);
        bodyGr.addColorStop(1, `hsla(155, 50%, ${lightness}%, ${bodyAlpha * 0.7})`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, TAU);
        ctx.fillStyle = bodyGr;
        ctx.fill();

        // Ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 0.8, 0, TAU);
        ctx.strokeStyle = `hsla(155, 45%, 55%, ${0.18 + a * 0.35})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Bright center when activated
        if (a > 0.3) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 0.35, 0, TAU);
          ctx.fillStyle = `hsla(155, 85%, 92%, ${a * 0.9})`;
          ctx.fill();
        }
      }

      // Mouse glow
      if (mx > 0 && my > 0) {
        const mgr = ctx.createRadialGradient(mx, my, 0, mx, my, 100);
        mgr.addColorStop(0, "hsla(155, 50%, 55%, 0.05)");
        mgr.addColorStop(1, "hsla(155, 40%, 40%, 0)");
        ctx.beginPath();
        ctx.arc(mx, my, 100, 0, TAU);
        ctx.fillStyle = mgr;
        ctx.fill();
      }

    }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => { mx = -1; my = -1; };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastThoughtTime = performance.now();
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    animId = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function Hero() {
  const t = useTranslations("Hero");
  const sectionRef = useRef<HTMLElement>(null);


  return (
    <section ref={sectionRef} className="relative min-h-[60vh] flex items-center justify-center bg-turtle-950 overflow-hidden">
      <HeroCanvas />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(5, 46, 22, 0.5) 0%, transparent 100%)",
        }}
      />

      <Container className="relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            className="text-sm md:text-base font-semibold uppercase tracking-widest text-turtle-400 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {COMPANY.name}
          </motion.p>
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {t("tagline")}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-turtle-200 mt-6 mx-auto max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}

          >
            <Button href="#contact" className="text-lg px-10 py-4">
              {t("cta")}
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

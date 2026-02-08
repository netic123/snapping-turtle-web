"use client";

import { useRef, useEffect, useCallback } from "react";
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
  layer: number;
  activation: number; // 0-1, how "lit up" this node is
  phase: number;
}

interface Connection {
  from: number;
  to: number;
}

interface Signal {
  connIdx: number;
  progress: number; // 0 to 1
  speed: number;
  generation: number; // 0 = ambient, 1+ = burst generations
}

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mx = -1, my = -1;
    let t = 0;
    let lastTime = 0;
    let nodes: Node[] = [];
    let connections: Connection[] = [];
    let signals: Signal[] = [];
    let animId = 0;

    let lastBurstTime = 0;

    function burstFromLeft() {
      const now = performance.now();
      if (now - lastBurstTime < 5000) return; // 5s cooldown
      lastBurstTime = now;

      // Find all connections that start from layer-0 nodes
      const layer0Conns = connections
        .map((c, idx) => ({ c, idx }))
        .filter(({ c }) => nodes[c.from]?.layer === 0);
      // Activate all layer-0 nodes
      for (const node of nodes) {
        if (node.layer === 0) node.activation = 1;
      }
      // Fire a signal on every layer-0 connection
      for (const { idx } of layer0Conns) {
        signals.push({
          connIdx: idx,
          progress: 0,
          speed: 0.5 + Math.random() * 0.5,
          generation: 1,
        });
      }
    }

    const onBurst = () => burstFromLeft();
    canvas.addEventListener("hero-burst", onBurst);

    function initNetwork(w: number, h: number) {
      nodes = [];
      connections = [];
      signals = [];

      // Create neural network layers spread across the canvas
      // More layers, spread wide for a panoramic feel
      const layerCount = 6;
      const nodesPerLayer = [4, 6, 8, 8, 6, 4];
      const paddingX = w * 0.08;
      const paddingY = h * 0.12;

      for (let l = 0; l < layerCount; l++) {
        const count = nodesPerLayer[l];
        const lx = paddingX + (w - paddingX * 2) * (l / (layerCount - 1));

        for (let n = 0; n < count; n++) {
          const ly = paddingY + (h - paddingY * 2) * ((n + 0.5) / count);
          // Add some randomness to positions
          const jitterX = (Math.random() - 0.5) * 40;
          const jitterY = (Math.random() - 0.5) * 30;

          nodes.push({
            x: lx + jitterX,
            y: ly + jitterY,
            baseX: lx + jitterX,
            baseY: ly + jitterY,
            radius: l === 0 || l === layerCount - 1 ? 3 : 2.5 + Math.random() * 1.5,
            layer: l,
            activation: 0,
            phase: Math.random() * TAU,
          });
        }
      }

      // Connect each layer to the next (not fully connected — ~55% to keep it airy)
      // But guarantee every node has at least one outgoing AND one incoming connection
      let nodeIdx = 0;
      for (let l = 0; l < layerCount - 1; l++) {
        const currentCount = nodesPerLayer[l];
        const nextCount = nodesPerLayer[l + 1];
        const currentStart = nodeIdx;
        const nextStart = currentStart + currentCount;

        for (let i = 0; i < currentCount; i++) {
          let hasOutgoing = false;
          for (let j = 0; j < nextCount; j++) {
            if (Math.random() < 0.55) {
              connections.push({ from: currentStart + i, to: nextStart + j });
              hasOutgoing = true;
            }
          }
          // Guarantee at least one outgoing connection
          if (!hasOutgoing) {
            const j = Math.floor(Math.random() * nextCount);
            connections.push({ from: currentStart + i, to: nextStart + j });
          }
        }
        // Guarantee every node in the next layer has at least one incoming connection
        for (let j = 0; j < nextCount; j++) {
          const hasIncoming = connections.some(c => c.to === nextStart + j);
          if (!hasIncoming) {
            const i = Math.floor(Math.random() * currentCount);
            connections.push({ from: currentStart + i, to: nextStart + j });
          }
        }
        nodeIdx += currentCount;
      }

      // Also add a few skip connections (layer l to l+2) for visual interest
      nodeIdx = 0;
      for (let l = 0; l < layerCount - 2; l++) {
        const currentCount = nodesPerLayer[l];
        const skipCount = nodesPerLayer[l + 2];
        const currentStart = nodeIdx;
        let skipStart = nodeIdx + currentCount + nodesPerLayer[l + 1];

        for (let i = 0; i < currentCount; i++) {
          for (let j = 0; j < skipCount; j++) {
            if (Math.random() < 0.08) {
              connections.push({ from: currentStart + i, to: skipStart + j });
            }
          }
        }
        nodeIdx += currentCount;
      }

      // Spawn initial signals — staggered so they don't all fire at once
      const layer0Conns = connections
        .map((c, idx) => ({ c, idx }))
        .filter(({ c }) => nodes[c.from]?.layer === 0);
      for (let i = 0; i < 2; i++) {
        if (layer0Conns.length === 0) break;
        const pick = layer0Conns[Math.floor(Math.random() * layer0Conns.length)];
        signals.push({
          connIdx: pick.idx,
          progress: Math.random() * 0.8, // random starting progress
          speed: 0.4 + Math.random() * 0.4,
          generation: 0,
        });
      }
    }

    // Smooth ease-in-out for signal movement
    function easeInOut(x: number): number {
      return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
    }

    function spawnSignal() {
      if (connections.length === 0) return;
      // Only spawn from layer-0 (far left) nodes
      const layer0Conns = connections
        .map((c, idx) => ({ c, idx }))
        .filter(({ c }) => nodes[c.from]?.layer === 0);
      if (layer0Conns.length === 0) return;
      const pick = layer0Conns[Math.floor(Math.random() * layer0Conns.length)];
      signals.push({
        connIdx: pick.idx,
        progress: 0,
        speed: 0.4 + Math.random() * 0.4,
        generation: 0,
      });
    }

    function resize() {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        initNetwork(rect.width, rect.height);
      }
    }

    function draw(now: number) {
      if (!lastTime) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      t += dt;

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) { animId = requestAnimationFrame(draw); return; }

      // Full clear
      ctx.fillStyle = "#052e16";
      ctx.fillRect(0, 0, w, h);

      // Update node positions — gentle breathing movement
      for (const node of nodes) {
        node.x = node.baseX + Math.sin(t * 0.5 + node.phase) * 4 + Math.sin(t * 0.3 + node.phase * 2) * 3;
        node.y = node.baseY + Math.cos(t * 0.4 + node.phase * 1.3) * 4 + Math.cos(t * 0.25 + node.phase) * 2;

        // Mouse repulsion
        if (mx > 0 && my > 0) {
          const dx = node.x - mx;
          const dy = node.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < 150 && dist > 1) {
            const f = (1 - dist / 150) * 15;
            node.x += (dx / dist) * f;
            node.y += (dy / dist) * f;
          }
        }

        // Decay activation — slower decay for longer glow
        node.activation *= 0.985;
      }

      // Update signals
      for (let i = signals.length - 1; i >= 0; i--) {
        const sig = signals[i];
        sig.progress += sig.speed * dt;

        if (sig.progress >= 1) {
          // Activate the destination node
          const conn = connections[sig.connIdx];
          if (conn) {
            nodes[conn.to].activation = Math.min(1, nodes[conn.to].activation + 0.8);

            // Chain reaction — propagate to outgoing connections
            const nextConns = connections
              .map((c, idx) => ({ c, idx }))
              .filter(({ c }) => c.from === conn.to);
            const nextGen = sig.generation + 1;
            if (nextConns.length > 0 && nextGen <= 5) {
              // Always split into all outgoing connections
              const picks = nextConns;
              for (const { idx } of picks) {
                signals.push({
                  connIdx: idx,
                  progress: 0,
                  speed: (0.3 + Math.random() * 0.4) * (1 - nextGen * 0.08), // slightly slower each generation
                  generation: nextGen,
                });
              }
            }
          }
          signals.splice(i, 1);
        }
      }

      // Spawn new signals periodically — slow trickle from left
      if (Math.random() < dt * 1.2) {
        spawnSignal();
      }
      // Cap total signals to prevent performance issues
      if (signals.length > 500) {
        signals.splice(0, signals.length - 500);
      }

      // Build a set of connection indices that currently have signals on them
      // so we can make those connections glow
      const activeConns = new Map<number, { maxProgress: number; generation: number }>();
      for (const sig of signals) {
        const existing = activeConns.get(sig.connIdx);
        if (!existing || sig.progress > existing.maxProgress) {
          activeConns.set(sig.connIdx, { maxProgress: sig.progress, generation: sig.generation });
        }
      }

      // Hue shifts subtly across generations: green → teal → cyan
      function sigHue(gen: number): number {
        return 155 + Math.min(gen, 5) * 6; // 155 → 185
      }

      // ── DRAW CONNECTIONS ──
      for (let i = 0; i < connections.length; i++) {
        const conn = connections[i];
        const from = nodes[conn.from];
        const to = nodes[conn.to];

        const active = activeConns.get(i);
        const baseAlpha = 0.2 + (from.activation + to.activation) * 0.15;

        // Base connection line — always visible
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = `hsla(155, 35%, 50%, ${baseAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // If a signal is traveling on this connection, draw a glowing overlay
        if (active) {
          const hue = sigHue(active.generation);
          const glowAlpha = 0.15 + active.maxProgress * 0.2;
          const connGr = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
          connGr.addColorStop(0, `hsla(${hue}, 40%, 50%, ${glowAlpha * 0.3})`);
          connGr.addColorStop(Math.max(0, active.maxProgress - 0.1), `hsla(${hue}, 50%, 55%, ${glowAlpha})`);
          connGr.addColorStop(Math.min(1, active.maxProgress + 0.05), `hsla(${hue}, 50%, 55%, ${glowAlpha})`);
          connGr.addColorStop(Math.min(1, active.maxProgress + 0.15), `hsla(${hue}, 40%, 50%, 0)`);
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = connGr;
          ctx.lineWidth = 2;
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
        // Smooth eased position
        const eased = easeInOut(sig.progress);
        const sx = from.x + (to.x - from.x) * eased;
        const sy = from.y + (to.y - from.y) * eased;

        // Intensity fades at the very end so signals don't pop off
        const fadeIn = Math.min(sig.progress / 0.1, 1);
        const fadeOut = Math.min((1 - sig.progress) / 0.15, 1);
        const intensity = fadeIn * fadeOut;

        // Outer bloom — large and very soft
        const gr2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, 28);
        gr2.addColorStop(0, `hsla(${hue}, 65%, 65%, ${0.3 * intensity})`);
        gr2.addColorStop(0.35, `hsla(${hue}, 55%, 55%, ${0.08 * intensity})`);
        gr2.addColorStop(1, `hsla(${hue}, 45%, 45%, 0)`);
        ctx.beginPath();
        ctx.arc(sx, sy, 28, 0, TAU);
        ctx.fillStyle = gr2;
        ctx.fill();

        // Inner glow — warm center
        const gr = ctx.createRadialGradient(sx, sy, 0, sx, sy, 10);
        gr.addColorStop(0, `hsla(${hue}, 85%, 85%, ${0.75 * intensity})`);
        gr.addColorStop(0.4, `hsla(${hue}, 65%, 60%, ${0.2 * intensity})`);
        gr.addColorStop(1, `hsla(${hue}, 50%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(sx, sy, 10, 0, TAU);
        ctx.fillStyle = gr;
        ctx.fill();

        // Bright white-ish core
        ctx.beginPath();
        ctx.arc(sx, sy, 2.2, 0, TAU);
        ctx.fillStyle = `hsla(${hue}, 90%, 93%, ${0.95 * intensity})`;
        ctx.fill();

        // Glowing trail behind signal — smooth gradient with wider stroke
        const trailLen = 0.4;
        const trailStart = Math.max(0, sig.progress - trailLen);
        const easedTrail = easeInOut(trailStart);
        const tx1 = from.x + (to.x - from.x) * easedTrail;
        const ty1 = from.y + (to.y - from.y) * easedTrail;

        const trailGr = ctx.createLinearGradient(tx1, ty1, sx, sy);
        trailGr.addColorStop(0, `hsla(${hue}, 45%, 50%, 0)`);
        trailGr.addColorStop(0.6, `hsla(${hue}, 55%, 55%, ${0.15 * intensity})`);
        trailGr.addColorStop(1, `hsla(${hue}, 60%, 60%, ${0.4 * intensity})`);
        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = trailGr;
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";
        ctx.stroke();

        // Softer outer trail glow for a bloom effect on the trail
        const trailGr2 = ctx.createLinearGradient(tx1, ty1, sx, sy);
        trailGr2.addColorStop(0, `hsla(${hue}, 40%, 50%, 0)`);
        trailGr2.addColorStop(0.7, `hsla(${hue}, 50%, 55%, ${0.05 * intensity})`);
        trailGr2.addColorStop(1, `hsla(${hue}, 55%, 55%, ${0.12 * intensity})`);
        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = trailGr2;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      ctx.lineCap = "butt"; // reset

      // ── DRAW NODES ──
      for (const node of nodes) {
        const a = node.activation;
        const pulse = Math.sin(t * 1.5 + node.phase) * 0.5 + 0.5;

        // Large bloom when activated — layered for a smooth falloff
        if (a > 0.05) {
          const glowR = node.radius * (5 + a * 6);
          const gr = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR);
          gr.addColorStop(0, `hsla(155, 65%, 65%, ${a * 0.35})`);
          gr.addColorStop(0.4, `hsla(155, 55%, 55%, ${a * 0.1})`);
          gr.addColorStop(1, "hsla(155, 45%, 45%, 0)");
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowR, 0, TAU);
          ctx.fillStyle = gr;
          ctx.fill();
        }

        // Subtle ambient pulse glow
        if (pulse > 0.6) {
          const pulseR = node.radius * 3;
          const pgr = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseR);
          pgr.addColorStop(0, `hsla(155, 50%, 55%, ${(pulse - 0.6) * 0.08})`);
          pgr.addColorStop(1, "hsla(155, 40%, 45%, 0)");
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseR, 0, TAU);
          ctx.fillStyle = pgr;
          ctx.fill();
        }

        // Node body — soft gradient fill instead of flat color
        const bodyAlpha = 0.35 + a * 0.55 + pulse * 0.1;
        const lightness = 42 + a * 28 + pulse * 10;
        const bodyGr = ctx.createRadialGradient(
          node.x - node.radius * 0.3, node.y - node.radius * 0.3, 0,
          node.x, node.y, node.radius
        );
        bodyGr.addColorStop(0, `hsla(155, 60%, ${lightness + 15}%, ${bodyAlpha})`);
        bodyGr.addColorStop(1, `hsla(155, 50%, ${lightness}%, ${bodyAlpha * 0.7})`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, TAU);
        ctx.fillStyle = bodyGr;
        ctx.fill();

        // Soft ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 1, 0, TAU);
        ctx.strokeStyle = `hsla(155, 45%, 55%, ${0.12 + a * 0.35})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Bright center when activated — crisp white-green dot
        if (a > 0.25) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 0.35, 0, TAU);
          ctx.fillStyle = `hsla(155, 85%, 92%, ${a * 0.85})`;
          ctx.fill();
        }
      }

      // ── MOUSE GLOW ──
      if (mx > 0 && my > 0) {
        const mgr = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
        mgr.addColorStop(0, "hsla(155, 50%, 55%, 0.06)");
        mgr.addColorStop(1, "hsla(155, 40%, 40%, 0)");
        ctx.beginPath();
        ctx.arc(mx, my, 120, 0, TAU);
        ctx.fillStyle = mgr;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => { mx = -1; my = -1; };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("hero-burst", onBurst);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function Hero() {
  const t = useTranslations("Hero");
  const sectionRef = useRef<HTMLElement>(null);

  const triggerBurst = useCallback(() => {
    const canvas = sectionRef.current?.querySelector("canvas");
    if (canvas) canvas.dispatchEvent(new Event("hero-burst"));
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[60vh] flex items-center justify-center bg-turtle-950 overflow-hidden">
      <HeroCanvas />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(5, 46, 22, 0.4) 0%, transparent 100%)",
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
            onMouseEnter={triggerBurst}
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

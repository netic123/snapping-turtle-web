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

interface Ripple {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  maxRadius: number;
  hue: number;
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
    let ripples: Ripple[] = [];
    let connAfterglow: Float32Array = new Float32Array(0);
    let animId = 0;
    let lastThoughtTime = 0;
    let nextFireInterval = 3500;
    let isVisible = true;
    let lastMouseFireTime = 0;
    let mouseHoverTime = 0;
    let nearestNodeToMouse = -1;
    let nearestNodeDist = Infinity;

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

      // Prefer nodes with zero active signals, but fall back to low-activity nodes
      const quietNodes: number[] = [];
      const calmNodes: number[] = [];
      for (let i = 0; i < nodes.length; i++) {
        if (!nodeHasActiveSignals(i, connCounts)) {
          quietNodes.push(i);
        } else {
          let busyConns = 0, totalConns = 0;
          for (let ci = 0; ci < connections.length; ci++) {
            const c = connections[ci];
            if (c.from === i || c.to === i) {
              totalConns++;
              if (connCounts[ci] > 0) busyConns++;
            }
          }
          if (totalConns > 0 && busyConns < totalConns * 0.5) calmNodes.push(i);
        }
      }
      const candidates = quietNodes.length > 0 ? quietNodes : calmNodes;
      if (candidates.length === 0) return;

      const startIdx = candidates[Math.floor(Math.random() * candidates.length)];
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
      ripples = [];

      // Sparser grid for cleaner look
      const cols = 10;
      const rows = 5;
      const padX = w * 0.08;
      const padY = h * 0.06;
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
          const isDeepInside = inTextX && inTextY && !(
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
        const maxConns = 2 + Math.floor(Math.random() * 2); // 2-3 connections

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
      connAfterglow = new Float32Array(connections.length);

      // Fire a few thoughts immediately so the network looks alive on load
      for (let i = 0; i < 3; i++) fireThought();
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

      ctx.fillStyle = "#062a14";
      ctx.fillRect(0, 0, w, h);

      // Auto-fire thoughts
      if (now - lastThoughtTime > nextFireInterval) {
        lastThoughtTime = now;
        nextFireInterval = 3000 + Math.random() * 2000;
        fireThought();
      }

      // Update nodes
      nearestNodeToMouse = -1;
      nearestNodeDist = Infinity;
      for (let ni = 0; ni < nodes.length; ni++) {
        const node = nodes[ni];
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
          // Track nearest node for mouse-triggered signals
          if (dist < 80 && dist < nearestNodeDist) {
            nearestNodeToMouse = ni;
            nearestNodeDist = dist;
          }
        }

        node.activation = Math.max(0, node.activation * 0.98);
      }

      // Mouse-triggered signals — hovering near a node fires it
      if (nearestNodeToMouse >= 0) {
        mouseHoverTime += dt;
        if (mouseHoverTime > 0.3 && now - lastMouseFireTime > 800) {
          lastMouseFireTime = now;
          mouseHoverTime = 0;
          const startIdx = nearestNodeToMouse;
          nodes[startIdx].activation = 1;
          const mConnCounts = getConnSignalCounts();
          const outConns = connections
            .map((c, idx) => ({ c, idx }))
            .filter(({ c }) => c.from === startIdx || c.to === startIdx)
            .filter(({ idx }) => mConnCounts[idx] < 1);
          for (const { c, idx } of outConns) {
            const goingForward = c.from === startIdx;
            const spd = 0.2 + Math.random() * 0.15;
            signals.push({
              connIdx: idx,
              progress: goingForward ? 0 : 1,
              speed: goingForward ? spd : -spd,
              generation: 1,
            });
          }
        }
      } else {
        mouseHoverTime = 0;
      }

      function sigHue(gen: number): number {
        return 155 + Math.min(gen, 6) * 5;
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
          // Decrement count for the dying signal BEFORE split logic,
          // so outbound connections see accurate counts
          if (liveConnCounts[sig.connIdx] > 0) liveConnCounts[sig.connIdx]--;

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
              // Ripple ring at the chain-reaction node
              ripples.push({
                x: nodes[arrivedAt].x,
                y: nodes[arrivedAt].y,
                age: 0,
                maxAge: 0.5 + Math.random() * 0.2,
                maxRadius: 35 + Math.random() * 15,
                hue: sigHue(nextGen),
              });
              const speedMultiplier = 1 + nextGen * 0.15;
              for (const { c, idx } of allOutConns) {
                // Max 1 signal per connection
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
          // Afterglow — stamp the connection so it fades over time
          if (sig.connIdx < connAfterglow.length) {
            connAfterglow[sig.connIdx] = 1.5;
          }
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

      // Decay afterglow
      for (let i = 0; i < connAfterglow.length; i++) {
        if (connAfterglow[i] > 0) connAfterglow[i] = Math.max(0, connAfterglow[i] - dt);
      }

      // Edge fade — elements near canvas edges are dimmer
      const fadeMargin = Math.min(w, h) * 0.15;
      function edgeFade(x: number, y: number): number {
        const left = Math.min(x / fadeMargin, 1);
        const right = Math.min((w - x) / fadeMargin, 1);
        const top = Math.min(y / fadeMargin, 1);
        const bottom = Math.min((h - y) / fadeMargin, 1);
        return Math.min(left, right, top, bottom);
      }

      // ── DRAW CONNECTIONS ──
      for (let i = 0; i < connections.length; i++) {
        const conn = connections[i];
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        const active = activeConns.get(i);

        // Afterglow blend — recently-traversed connections glow brighter
        const glowFrac = i < connAfterglow.length ? connAfterglow[i] / 1.5 : 0;
        const eFade = Math.min(edgeFade(from.x, from.y), edgeFade(to.x, to.y));
        const baseAlpha = (0.1 + (from.activation + to.activation) * 0.1 + glowFrac * 0.15) * eFade;
        const baseLightness = 48 + glowFrac * 10;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = `hsla(${155 + glowFrac * 10}, ${30 + glowFrac * 20}%, ${baseLightness}%, ${baseAlpha})`;
        ctx.lineWidth = 1 + glowFrac * 0.8;
        ctx.stroke();

        // Nerve-fire pulse — sharp bright peak traveling with the signal
        if (active) {
          const hue = sigHue(active.generation);
          const genFrac = Math.min(active.generation / 14, 1);
          const pulseWidth = 2.5 + genFrac * 1.0;
          const p = Math.max(0.15, Math.min(0.85, active.maxProgress));

          const gr = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
          gr.addColorStop(0, `hsla(${hue}, 45%, 50%, 0.03)`);
          gr.addColorStop(p - 0.12, `hsla(${hue}, 45%, 50%, 0.05)`);
          gr.addColorStop(p - 0.04, `hsla(${hue}, 60%, 60%, 0.25)`);
          gr.addColorStop(p, `hsla(${hue}, 70%, 65%, 0.4)`);
          gr.addColorStop(p + 0.02, `hsla(${hue}, 55%, 55%, 0.08)`);
          gr.addColorStop(p + 0.12, `hsla(${hue}, 45%, 50%, 0)`);
          if (p + 0.12 < 1) gr.addColorStop(1, `hsla(${hue}, 45%, 50%, 0)`);

          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = gr;
          ctx.lineWidth = pulseWidth;
          ctx.stroke();
        }
      }

      // ── DRAW RIPPLES ──
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.age += dt;
        if (rp.age >= rp.maxAge) {
          ripples.splice(i, 1);
          continue;
        }
        const frac = rp.age / rp.maxAge;
        const radius = frac * rp.maxRadius;
        const alpha = (1 - frac) * 0.35;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, radius, 0, TAU);
        ctx.strokeStyle = `hsla(${rp.hue}, 60%, 60%, ${alpha})`;
        ctx.lineWidth = 1.5 * (1 - frac * 0.6);
        ctx.stroke();
      }

      // ── DRAW SIGNALS ──
      for (const sig of signals) {
        const conn = connections[sig.connIdx];
        if (!conn) continue;
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        const hue = sigHue(sig.generation);

        // Generation-dependent visual scaling
        const genFrac = Math.min(sig.generation / 14, 1);
        const sizeScale = 1 + genFrac * 0.5;
        const brightBoost = genFrac * 0.15;
        const pulseRate = 3 + genFrac * 8;
        const corePulse = Math.sin(t * pulseRate + sig.progress * 10) * 0.5 + 0.5;
        const sat = 65 + genFrac * 20;

        // Progress along the line (0→1 for forward, 1→0 for reverse)
        const p = Math.max(0, Math.min(1, sig.progress));
        const px = from.x + (to.x - from.x) * p;
        const py = from.y + (to.y - from.y) * p;

        // Fade based on how far along the signal is in its travel
        const traveled = sig.speed > 0 ? p : (1 - p);
        const fadeIn = Math.min(traveled / 0.1, 1);
        const fadeOut = Math.min((1 - traveled) / 0.15, 1);
        const intensity = fadeIn * fadeOut;

        // Outer bloom — scales with generation
        const bloomR = 20 * sizeScale;
        const gr2 = ctx.createRadialGradient(px, py, 0, px, py, bloomR);
        gr2.addColorStop(0, `hsla(${hue}, ${sat}%, 65%, ${(0.3 + brightBoost) * intensity})`);
        gr2.addColorStop(0.4, `hsla(${hue}, ${sat - 10}%, 55%, ${(0.08 + brightBoost * 0.3) * intensity})`);
        gr2.addColorStop(1, `hsla(${hue}, ${sat - 20}%, 45%, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, bloomR, 0, TAU);
        ctx.fillStyle = gr2;
        ctx.fill();

        // Inner glow — scales with generation
        const innerR = 6 * sizeScale;
        const gr = ctx.createRadialGradient(px, py, 0, px, py, innerR);
        gr.addColorStop(0, `hsla(${hue}, ${sat + 20}%, 85%, ${(0.8 + brightBoost) * intensity})`);
        gr.addColorStop(0.5, `hsla(${hue}, ${sat}%, 60%, ${(0.2 + brightBoost * 0.5) * intensity})`);
        gr.addColorStop(1, `hsla(${hue}, ${sat - 15}%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, innerR, 0, TAU);
        ctx.fillStyle = gr;
        ctx.fill();

        // Core — pulses faster for later generations
        const coreR = (1.8 + corePulse * 0.8) * sizeScale;
        const coreSat = 90 - genFrac * 30;
        const coreLight = 93 + genFrac * 5;
        ctx.beginPath();
        ctx.arc(px, py, coreR, 0, TAU);
        ctx.fillStyle = `hsla(${hue}, ${coreSat}%, ${coreLight}%, ${0.95 * intensity})`;
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
        trailGr.addColorStop(1, `hsla(${hue}, 60%, 60%, ${(0.25 + brightBoost) * intensity})`);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.strokeStyle = trailGr;
        ctx.lineWidth = 2 + genFrac * 0.5;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.lineCap = "butt";
      }

      // ── DRAW NODES ──
      for (const node of nodes) {
        const a = node.activation;
        const pulse = Math.sin(t * 1.5 + node.phase) * 0.5 + 0.5;
        const nFade = edgeFade(node.x, node.y);

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
        const bodyAlpha = (0.35 + a * 0.45 + pulse * 0.08) * nFade;
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
        ctx.strokeStyle = `hsla(155, 45%, 55%, ${(0.15 + a * 0.3) * nFade})`;
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

      // Mouse glow — larger, warmer
      if (mx > 0 && my > 0) {
        const mgr = ctx.createRadialGradient(mx, my, 0, mx, my, 130);
        mgr.addColorStop(0, "hsla(148, 55%, 58%, 0.08)");
        mgr.addColorStop(0.4, "hsla(150, 50%, 55%, 0.04)");
        mgr.addColorStop(1, "hsla(155, 40%, 40%, 0)");
        ctx.beginPath();
        ctx.arc(mx, my, 130, 0, TAU);
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-25" />;
}

export default function Hero() {
  const t = useTranslations("Hero");
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden bg-turtle-950"
      style={{ minHeight: "65svh" }}
    >
      {/* ── Animated gradient mesh ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-mesh-wrapper">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
          <div className="hero-blob hero-blob-4" />
        </div>
      </div>

      {/* ── Dot grid pattern ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(75, 168, 111, 0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Radial vignette for focus ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(5, 46, 22, 0.6) 100%)",
        }}
      />

      <Container className="relative z-10 py-16 md:py-20 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-[-0.02em] text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {t("tagline")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-lg text-turtle-200/60 mt-6 mx-auto max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {t("subtitle")}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} className="text-base px-8 py-3.5 shadow-2xl shadow-turtle-500/20 hero-cta-glow">
              {t("cta")}
            </Button>
            <button
              onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center justify-center gap-2 text-sm font-medium text-turtle-300/50 hover:text-turtle-200 transition-colors duration-300"
            >
              {t("ctaSecondary")}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </Container>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, #062a14 100%)",
        }}
      />
    </section>
  );
}

import React, { useRef, useEffect } from 'react';
import { P41Mode, CannonParams, PlanetaryEscapeParams, AtmosphericParams, KeplerNewtonBridgeParams } from '../types';

interface SimulationCanvasProps {
  mode: P41Mode;
  isRunning: boolean;
  speed: number;
  cannonParams: CannonParams;
  escapeParams: PlanetaryEscapeParams;
  atmosParams: AtmosphericParams;
  bridgeParams: KeplerNewtonBridgeParams;
  time: number;
  setTime: (updater: (prev: number) => number) => void;
  lang: 'en' | 'bn';
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  mode,
  isRunning,
  speed,
  cannonParams,
  escapeParams,
  atmosParams,
  bridgeParams,
  time,
  setTime,
  lang,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1) * speed;
      lastTime = now;

      if (isRunning) {
        setTime((t) => t + dt);
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Deep space backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#070614');
      bgGrad.addColorStop(1, '#110b22');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Starfield
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (let i = 0; i < 45; i++) {
        const sx = (i * 67 + 23) % width;
        const sy = (i * 53 + 17) % height;
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      if (mode === 'newtons_cannon') {
        renderNewtonsCannon(ctx, width, height, time, cannonParams, lang);
      } else if (mode === 'planetary_escape') {
        renderPlanetaryEscape(ctx, width, height, time, escapeParams, lang);
      } else if (mode === 'atmospheric_retention') {
        renderAtmosphericRetention(ctx, width, height, time, atmosParams, lang);
      } else if (mode === 'kepler_newton_bridge') {
        renderKeplerBridge(ctx, width, height, time, bridgeParams, lang);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mode, isRunning, speed, cannonParams, escapeParams, atmosParams, bridgeParams, time, lang, setTime]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        width={860}
        height={540}
        className="w-full max-w-4xl h-auto rounded-2xl shadow-2xl border border-slate-800 bg-[#080718]"
      />
    </div>
  );
};

// =========================================================================
// MODE 1: NEWTON'S CANNONBALL & CONIC SECTIONS
// =========================================================================
function renderNewtonsCannon(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: CannonParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'নিউটনের কামান ও কনিক্স কক্ষপথ: বৃত্তীয় বেগ (৭.৯১ km/s) বনাম মুক্তিবেগ (১১.২ km/s)'
      : "Newton's Cannonball & Conic Sections: Orbital Speed (7.91 km/s) vs. Escape Speed (11.2 km/s)",
    width / 2,
    30
  );

  const centerX = width * 0.44;
  const centerY = height * 0.54;
  const earthR_px = 120;
  const mountainH_px = 25;

  // Earth Globe
  const eGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, earthR_px);
  eGrad.addColorStop(0, '#3b82f6');
  eGrad.addColorStop(0.7, '#1e3a8a');
  eGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = eGrad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, earthR_px, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Mountain on Top of Earth
  const mtnTopX = centerX;
  const mtnTopY = centerY - earthR_px - mountainH_px;
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.moveTo(centerX - 12, centerY - earthR_px + 2);
  ctx.lineTo(centerX + 12, centerY - earthR_px + 2);
  ctx.lineTo(mtnTopX, mtnTopY);
  ctx.closePath();
  ctx.fill();

  // Cannon on Mountain Peak
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(mtnTopX, mtnTopY - 4, 12, 6);

  // Trajectory Kinematics:
  // v_c = 7.91 km/s (Circular orbit)
  // v_e = 11.20 km/s (Parabolic escape)
  const vLaunch = p.launchVelocityKmS;
  const r0 = earthR_px + mountainH_px;

  // Conic classification
  let conicClass = '';
  let conicColor = '';
  if (vLaunch < 7.5) {
    conicClass = lang === 'bn' ? 'উপ-কক্ষীয় (Sub-orbital Crash)' : 'Sub-Orbital Ballistic (Crashes into Earth)';
    conicColor = '#ef4444';
  } else if (Math.abs(vLaunch - 7.91) < 0.2) {
    conicClass = lang === 'bn' ? 'বৃত্তাকার কক্ষপথ (Circular Orbit: v = 7.91 km/s)' : 'Circular Orbit (v = 7.91 km/s)';
    conicColor = '#22c55e';
  } else if (vLaunch > 7.91 && vLaunch < 11.15) {
    conicClass = lang === 'bn' ? 'উপবৃত্তাকার কক্ষপথ (Elliptical Orbit)' : 'Closed Elliptical Orbit (v_0 < v < v_e)';
    conicColor = '#38bdf8';
  } else if (Math.abs(vLaunch - 11.2) < 0.25) {
    conicClass = lang === 'bn' ? 'অধিবৃত্তাকার মুক্তিবেগ (Parabolic Escape: v = 11.2 km/s)' : 'Parabolic Escape (v = v_e = 11.2 km/s)';
    conicColor = '#eab308';
  } else {
    conicClass = lang === 'bn' ? 'পরাবৃত্তাকার মহাশূন্যে পলায়ন (Hyperbolic Trajectory)' : 'Hyperbolic Trajectory (v > v_e, E > 0)';
    conicColor = '#f43f5e';
  }

  // Draw Ideal Orbit Track
  ctx.strokeStyle = conicColor;
  ctx.lineWidth = 2;
  ctx.setLineDash(vLaunch >= 11.2 ? [6, 4] : []);

  if (vLaunch < 7.5) {
    // Ballistic crash arc
    const crashAngle = 0.5 + (vLaunch / 7.5) * 1.6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, r0, -Math.PI / 2, -Math.PI / 2 + crashAngle);
    ctx.stroke();
  } else if (Math.abs(vLaunch - 7.91) < 0.2) {
    // Circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, r0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (vLaunch > 7.91 && vLaunch < 11.15) {
    // Ellipse with launch point at perigee
    // e = (v/v_c)^2 - 1
    const vRatio = vLaunch / 7.91;
    const e = Math.min(Math.pow(vRatio, 2) - 1, 0.75);
    const a = r0 / (1 - e);
    const b = a * Math.sqrt(1 - e * e);
    const c = a * e;

    ctx.save();
    ctx.translate(centerX, centerY - c);
    ctx.beginPath();
    ctx.ellipse(0, 0, b, a, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else {
    // Parabola / Hyperbola open curve
    ctx.beginPath();
    ctx.moveTo(mtnTopX, mtnTopY);
    for (let t = 0; t <= 180; t += 2) {
      const theta = (t * Math.PI) / 180;
      const r = (2 * r0) / (1 + Math.cos(theta));
      if (r > 380) break;
      const px = centerX + r * Math.sin(theta);
      const py = centerY - r * Math.cos(theta);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Animated Cannonball
  const animT = (time * (vLaunch / 5)) % (Math.PI * 2);
  let ballX = mtnTopX;
  let ballY = mtnTopY;

  if (vLaunch < 7.5) {
    const frac = (time * 1.5) % 1.0;
    const crashEnd = 0.5 + (vLaunch / 7.5) * 1.6;
    const curA = -Math.PI / 2 + frac * crashEnd;
    ballX = centerX + (r0 - frac * 25) * Math.cos(curA);
    ballY = centerY + (r0 - frac * 25) * Math.sin(curA);
  } else if (vLaunch < 11.2) {
    const curA = -Math.PI / 2 + animT;
    ballX = centerX + r0 * Math.cos(curA);
    ballY = centerY + r0 * Math.sin(curA);
  } else {
    const curA = Math.min((time * 0.8) % 3, 2.5);
    ballX = mtnTopX + curA * 110;
    ballY = mtnTopY - curA * 50;
  }

  // Draw Cannonball
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Trajectory Badge at top right
  const badgeX = width * 0.58;
  const badgeY = 65;
  const badgeW = width * 0.38;
  const badgeH = 140;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = conicColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = conicColor;
  ctx.font = 'bold 12px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(conicClass, badgeX + 16, badgeY + 26);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '11px "JetBrains Mono", monospace';
  const stats = [
    `Launch Velocity: ${vLaunch.toFixed(2)} km/s`,
    `Circular Orbital Speed: v_c = 7.91 km/s`,
    `Parabolic Escape Speed: v_e = 11.20 km/s`,
    `Ratio v / v_e: ${(vLaunch / 11.2).toFixed(3)}`,
    vLaunch >= 11.2
      ? `Excess Asymptotic Speed: v_∞ = ${Math.sqrt(vLaunch * vLaunch - 11.2 * 11.2).toFixed(2)} km/s`
      : `Bound System (E_total < 0)`,
  ];
  stats.forEach((s, idx) => {
    ctx.fillText(s, badgeX + 16, badgeY + 50 + idx * 17);
  });

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? 'নিউটনের কামান: বেগ বাড়ালে প্রক্ষেপক পৃথিবীর বক্রতার সাথে সমান্তরাল হয়ে কক্ষপথে প্রবেশ করে এবং ১১.২ km/s পেরোলে চিরতরে মহাকাশে পালিয়ে যায়।'
      : "Newton's Thought Experiment: Horizontal launch curves with Earth surface to enter orbit, escaping permanently beyond 11.2 km/s.",
    width * 0.1,
    height - 32
  );
}

// =========================================================================
// MODE 2: PLANETARY ESCAPE VELOCITIES COMPARISON
// =========================================================================
function renderPlanetaryEscape(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: PlanetaryEscapeParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'সৌরজগতের বিভিন্ন গ্রহে মুক্তিবেগ: v_e = √(2GM/R) = √(2gR)'
      : "Solar System Planetary Escape Velocities: v_e = √(2GM/R) = √(2gR)",
    width / 2,
    30
  );

  const planetData = {
    moon: { name: 'Moon (চাঁদ)', ve: 2.38, rKm: 1737, g: 1.62, color: '#94a3b8' },
    mars: { name: 'Mars (মঙ্গল)', ve: 5.03, rKm: 3390, g: 3.72, color: '#f97316' },
    earth: { name: 'Earth (পৃথিবী)', ve: 11.2, rKm: 6371, g: 9.81, color: '#38bdf8' },
    jupiter: { name: 'Jupiter (বৃহস্পতি)', ve: 59.5, rKm: 69911, g: 24.79, color: '#fbbf24' },
    sun: { name: 'Sun (সূর্য)', ve: 617.5, rKm: 696340, g: 274.0, color: '#ef4444' },
  };

  const current = planetData[p.selectedPlanet];

  // Visual Planet representation
  const pCenterX = width * 0.35;
  const pCenterY = height * 0.54;
  const pRadiusPx = 110;

  const grad = ctx.createRadialGradient(pCenterX, pCenterY, 15, pCenterX, pCenterY, pRadiusPx);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.3, current.color);
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(pCenterX, pCenterY, pRadiusPx, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = current.color;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Test Rocket Launching vertically
  const rocketSpeedFrac = p.rocketSpeedRatio; // e.g. 0.8 or 1.2
  const isEscaping = rocketSpeedFrac >= 1.0;

  let rocketDist = 0;
  if (isEscaping) {
    // Flies away
    rocketDist = pRadiusPx + ((time * 70) % 250);
  } else {
    // Reaches apogee and falls back
    const maxH = (rocketSpeedFrac * rocketSpeedFrac) * 85;
    const cycle = (time * 1.5) % 2.0;
    const sinH = Math.sin((cycle / 2) * Math.PI);
    rocketDist = pRadiusPx + sinH * maxH;
  }

  const rocketX = pCenterX;
  const rocketY = pCenterY - rocketDist;

  // Draw Rocket
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(rocketX, rocketY - 14);
  ctx.lineTo(rocketX - 6, rocketY + 6);
  ctx.lineTo(rocketX + 6, rocketY + 6);
  ctx.closePath();
  ctx.fill();

  // Rocket exhaust
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(rocketX - 4, rocketY + 6);
  ctx.lineTo(rocketX + 4, rocketY + 6);
  ctx.lineTo(rocketX, rocketY + 16);
  ctx.closePath();
  ctx.fill();

  // Right Side Data Card
  const cardX = width * 0.62;
  const cardY = 80;
  const cardW = width * 0.34;
  const cardH = 340;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = current.color;
  ctx.font = 'bold 14px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(current.name, cardX + 16, cardY + 28);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '11px "JetBrains Mono", monospace';
  const lines = [
    `Escape Speed v_e:`,
    `v_e = ${current.ve} km/s`,
    ``,
    `Surface Gravity g:`,
    `g = ${current.g} m/s²`,
    ``,
    `Planetary Radius R:`,
    `R = ${current.rKm.toLocaleString()} km`,
    ``,
    `Rocket Launch Speed:`,
    `${(rocketSpeedFrac * current.ve).toFixed(2)} km/s (${(rocketSpeedFrac * 100).toFixed(0)}% v_e)`,
    ``,
    `Mission Status:`,
    isEscaping ? `ESCAPE TO INFINITY ✅` : `GRAVITATIONAL CAPTURE ❌`,
  ];

  lines.forEach((l, i) => {
    ctx.fillText(l, cardX + 16, cardY + 56 + i * 16);
  });

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? 'বৃহস্পতির মুক্তিবেগ (৫৯.৫ km/s) অত্যন্ত বেশি হওয়ায় এটি হাইড্রোজেন ও হিলিয়ামের মতো হালকা গ্যাসও ধরে রাখতে পেরেছে।'
      : "Jupiter's colossal escape speed (59.5 km/s) enables it to retain even ultra-light hydrogen and helium atmospheres.",
    width * 0.1,
    height - 32
  );
}

// =========================================================================
// MODE 3: ATMOSPHERIC RETENTION (v_rms vs v_e)
// =========================================================================
function renderAtmosphericRetention(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: AtmosphericParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'বায়ুমণ্ডল ধারণের শর্ত ও ম্যাক্সওয়েল বেগ: v_rms = √(3RT/M) বনাম v_e'
      : "Atmospheric Retention Condition: Maxwell-Boltzmann v_rms = √(3RT/M) vs. Escape Speed v_e",
    width / 2,
    30
  );

  const T_K = p.temperatureKelvin;
  const gases = [
    { name: 'H₂', M: 2, color: '#f43f5e' },
    { name: 'He', M: 4, color: '#fb923c' },
    { name: 'H₂O', M: 18, color: '#38bdf8' },
    { name: 'N₂', M: 28, color: '#4ade80' },
    { name: 'O₂', M: 32, color: '#a855f7' },
    { name: 'CO₂', M: 44, color: '#facc15' },
  ];

  // R = 8.314 J/(mol K)
  // v_rms = sqrt(3 * 8314 * T / M) m/s = sqrt(3 * 8.314 * T / (M * 1e-3))
  const bodyVeMap = {
    moon: 2.38,
    mars: 5.03,
    earth: 11.2,
    jupiter: 59.5,
  };
  const veKmS = bodyVeMap[p.celestialBody];
  const retentionThresholdKmS = veKmS / 6.0; // Rule of thumb: if v_rms > v_e / 6, gas escapes

  // Draw Horizontal Bar Chart of Gas RMS speeds vs Escape Threshold
  const chartLeft = width * 0.18;
  const chartTop = 80;
  const chartW = width * 0.64;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(chartLeft - 30, chartTop - 15, chartW + 60, 310, 12);
  ctx.fill();
  ctx.stroke();

  // Header info
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    `Body: ${p.celestialBody.toUpperCase()}  |  Temperature: ${T_K} K  |  v_e = ${veKmS} km/s  |  Escape Threshold (v_e / 6) = ${retentionThresholdKmS.toFixed(2)} km/s`,
    chartLeft - 10,
    chartTop + 10
  );

  // Vertical threshold line for v_e / 6
  const maxPlotSpeedKmS = Math.max(veKmS * 0.6, 5.0);
  const threshX = chartLeft + (retentionThresholdKmS / maxPlotSpeedKmS) * chartW;

  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(threshX, chartTop + 30);
  ctx.lineTo(threshX, chartTop + 270);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 10px "JetBrains Mono", monospace';
  ctx.fillText('Escape Threshold (v_e / 6)', threshX - 30, chartTop + 284);

  // Draw each gas bar
  gases.forEach((gas, idx) => {
    const vRmsMs = Math.sqrt((3 * 8314.5 * T_K) / gas.M);
    const vRmsKmS = vRmsMs / 1000;
    const barY = chartTop + 45 + idx * 36;
    const barLen = Math.min((vRmsKmS / maxPlotSpeedKmS) * chartW, chartW);
    const escapes = vRmsKmS > retentionThresholdKmS;

    // Gas label
    ctx.fillStyle = gas.color;
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${gas.name}`, chartLeft - 10, barY + 14);

    // Bar
    ctx.fillStyle = gas.color;
    ctx.beginPath();
    ctx.roundRect(chartLeft, barY, barLen, 20, 4);
    ctx.fill();

    // Speed text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(
      `${vRmsKmS.toFixed(2)} km/s  [${escapes ? (lang === 'bn' ? 'বায়ুমণ্ডল থেকে মুক্ত ❌' : 'ESCAPES ❌') : (lang === 'bn' ? 'ধরে রাখতে পারে ✅' : 'RETAINED ✅')}]`,
      chartLeft + barLen + 8,
      barY + 14
    );
  });

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#4ade80';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? '💡 ব্যাখ্যা: চাঁদে মুক্তিবেগ মাত্র ২.৩৮ km/s হওয়ায় গ্যাস অণুর আরএমএস বেগ (v_rms) এর চেয়ে বেশি হয়ে বায়ুমণ্ডল মহাশূন্যে বিলীন হয়ে গেছে।'
      : "💡 Moon has zero atmosphere because its low escape velocity (2.38 km/s) is easily exceeded by thermal RMS gas speeds.",
    width * 0.1,
    height - 32
  );
}

// =========================================================================
// MODE 4: KEPLER ⟷ NEWTON BRIDGE PROOF
// =========================================================================
function renderKeplerBridge(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: KeplerNewtonBridgeParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'নিউটনের মহাকর্ষ থেকে কেপলারের ৩য় সূত্রের প্রমাণ: T² = (4π²/GM) r³'
      : "Bridging Newton's Law of Gravitation & Kepler's 3rd Harmonic Law",
    width / 2,
    30
  );

  const centerX = width * 0.35;
  const centerY = height * 0.52;
  const rKm = p.orbitalRadiusKm;
  const rNormPx = 70 + ((rKm - 7000) / 35000) * 120;

  // Central Mass (Earth)
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('M', centerX, centerY + 4);

  // Circular Orbit Track
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, rNormPx, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Orbital Mechanics:
  // v = sqrt(GM / r)
  // T = 2 * pi * r^(3/2) / sqrt(GM)
  const GM = 3.986e14 * p.centralMassFactor; // m^3/s^2
  const rMeters = rKm * 1000;
  const vOrbitMs = Math.sqrt(GM / rMeters);
  const periodSeconds = (2 * Math.PI * Math.pow(rMeters, 1.5)) / Math.sqrt(GM);
  const periodHours = periodSeconds / 3600;

  // Animated Satellite
  const orbitSpeed = (2 * Math.PI) / (periodHours * 8);
  const satAngle = time * orbitSpeed;
  const satX = centerX + rNormPx * Math.cos(satAngle);
  const satY = centerY + rNormPx * Math.sin(satAngle);

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(satX, satY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inward Gravitational Force Vector
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(satX, satY);
  ctx.lineTo(satX - 35 * Math.cos(satAngle), satY - 35 * Math.sin(satAngle));
  ctx.stroke();

  // Right Side Step-by-Step Derivation Card
  const cardX = width * 0.62;
  const cardY = 70;
  const cardW = width * 0.35;
  const cardH = 360;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 13px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(lang === 'bn' ? 'ধাপভিত্তিক প্রতিপাদন:' : 'Analytical Derivation:', cardX + 16, cardY + 28);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '11px "JetBrains Mono", monospace';
  const steps = [
    `1. Centripetal Force = Gravity:`,
    `   m·v² / r = G·M·m / r²`,
    ``,
    `2. Orbital Velocity:`,
    `   v = √(GM / r) = ${(vOrbitMs / 1000).toFixed(2)} km/s`,
    ``,
    `3. Orbital Period:`,
    `   T = 2πr / v = 2πr^(3/2) / √(GM)`,
    `   T = ${periodHours.toFixed(2)} hours`,
    ``,
    `4. Squaring Both Sides:`,
    `   T² = (4π² / GM) · r³`,
    ``,
    `5. Verification Ratio:`,
    `   T² / r³ = ${(Math.pow(periodSeconds, 2) / Math.pow(rMeters, 3)).toExponential(4)}`,
    `   [Identical for all orbits!]`,
  ];

  steps.forEach((s, i) => {
    ctx.fillText(s, cardX + 16, cardY + 54 + i * 15);
  });

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? 'উপসংহার: নিউটনের মহাকর্ষ সূত্র থেকেই কেপলারের ৩য় সূত্র সরাসরি প্রতিপাদিত হয় এবং প্রমাণ করে যে T² ∝ r³।'
      : "Conclusion: Newton's universal inverse-square law mathematically derives Kepler's 3rd harmonic law.",
    width * 0.1,
    height - 32
  );
}

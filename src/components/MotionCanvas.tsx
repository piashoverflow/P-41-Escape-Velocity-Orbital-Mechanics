import React, { useRef, useEffect, useState } from 'react';
import { SimulationParams, TelemetryState, Language, AppTheme } from '../types';
import { drawRoundRect, drawVectorArrow, fmtNum, fmtSci, PLANETS, GASES } from '../utils/physics';
import { t } from '../utils/i18n';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

interface MotionCanvasProps {
  language: Language;
  theme: AppTheme;
  params: SimulationParams;
  telemetry: TelemetryState;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onToggleSlowMo: () => void;
}

export const MotionCanvas: React.FC<MotionCanvasProps> = ({
  language,
  params,
  telemetry,
  isPlaying,
  onTogglePlay,
  onStep,
  onReset,
  onToggleSlowMo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 520,
  });
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.round(entry.contentRect.width);
      const h = Math.max(480, Math.min(640, Math.round(entry.contentRect.width * 0.58)));
      setContainerDimensions({ width: w, height: h });
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = containerDimensions;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#080d1a';
    ctx.fillRect(0, 0, width, height);

    if (params.showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    const currentPlanet = PLANETS[params.selectedPlanet];

    // ==========================================
    // PRESET 1: ESCAPE VELOCITY
    // ==========================================
    if (params.preset === 'escape_velocity') {
      const centerX = width * 0.45;
      const centerY = height * 0.55;
      const earthR = Math.min(width, height) * 0.32;

      // Draw Planet
      const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, earthR);
      grad.addColorStop(0, '#0284c7');
      grad.addColorStop(1, '#0369a1');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Launch Pad on top
      const launchX = centerX;
      const launchY = centerY - earthR;

      // Trajectory path
      const v0 = params.launchVelocityKmS;
      const ve = currentPlanet.ve;
      const isEscape = v0 >= ve;

      ctx.strokeStyle = isEscape ? '#22c55e' : '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(launchX, launchY);

      if (params.launchAngleDeg === 90) {
        // Vertical launch
        const topY = isEscape ? -50 : Math.max(20, launchY - (v0 / ve) * (height * 0.5));
        ctx.lineTo(launchX, topY);
      } else {
        // Angled trajectory
        const rad = (params.launchAngleDeg * Math.PI) / 180;
        const trajLen = isEscape ? width * 0.6 : (v0 / ve) * (width * 0.4);
        const endX = launchX + trajLen * Math.cos(rad);
        const endY = launchY - trajLen * Math.sin(rad) + (isEscape ? 0 : 40);
        ctx.quadraticCurveTo(launchX + trajLen * 0.5 * Math.cos(rad), launchY - trajLen * 0.8 * Math.sin(rad), endX, endY);
      }
      ctx.stroke();

      // Launch vector
      drawVectorArrow(ctx, launchX, launchY, launchX + 50 * Math.cos((params.launchAngleDeg * Math.PI) / 180), launchY - 50 * Math.sin((params.launchAngleDeg * Math.PI) / 180), '#38bdf8', `v₀=${v0}km/s`, 7);

      // Animated Rocket along path
      const tFlight = (telemetry.elapsedTime * 0.8) % 6;
      let rockX = launchX;
      let rockY = launchY;
      const rockAngle = - (params.launchAngleDeg * Math.PI) / 180;

      if (params.launchAngleDeg === 90) {
        if (isEscape) {
          const dist = tFlight * 120;
          rockY = launchY - dist;
        } else {
          const tPeak = 2.5;
          const maxH = (v0 / ve) * (height * 0.45);
          const currentH = maxH * (1 - Math.pow((tFlight - tPeak) / tPeak, 2));
          rockY = launchY - Math.max(0, currentH);
        }
      } else {
        const rad = (params.launchAngleDeg * Math.PI) / 180;
        if (isEscape) {
          const dist = tFlight * 100;
          rockX = launchX + dist * Math.cos(rad);
          rockY = launchY - dist * Math.sin(rad);
        } else {
          const tPeak = 2.5;
          const trajFrac = Math.min(1, tFlight / (2 * tPeak));
          const trajLen = (v0 / ve) * (width * 0.4);
          rockX = launchX + trajFrac * trajLen * Math.cos(rad);
          const arcH = ((v0 / ve) * (height * 0.35)) * 4 * trajFrac * (1 - trajFrac);
          rockY = launchY - arcH;
        }
      }

      // Draw Rocket Body & Exhaust
      ctx.save();
      ctx.translate(rockX, rockY);
      ctx.rotate(rockAngle + Math.PI / 2);

      if (isPlaying && (isEscape || rockY <= launchY)) {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(-4, 12);
        ctx.lineTo(0, 18 + Math.random() * 6);
        ctx.lineTo(4, 12);
        ctx.fill();
      }

      ctx.fillStyle = '#f8fafc';
      drawRoundRect(ctx, -5, -12, 10, 24, 4);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(-5, -12);
      ctx.lineTo(0, -20);
      ctx.lineTo(5, -12);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(-5, 6);
      ctx.lineTo(-9, 12);
      ctx.lineTo(-5, 12);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(5, 6);
      ctx.lineTo(9, 12);
      ctx.lineTo(5, 12);
      ctx.fill();
      ctx.restore();

      // Status Badge
      ctx.font = 'bold 13px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      if (isEscape) {
        ctx.fillStyle = '#22c55e';
        ctx.fillText(`🚀 মুক্তিবেগ অর্জিত (v₀ ≥ v_e = ${ve} km/s) — মহাকর্ষ ক্ষেত্র অতিক্রম করে অসীমে যাত্রা!`, centerX, 40);
      } else {
        ctx.fillStyle = '#f43f5e';
        ctx.fillText(`⚠️ মুক্তিবেগ অর্জিত হয়নি (v₀ < v_e = ${ve} km/s) — বস্তুটি পুনরায় ভূপৃষ্ঠে ফিরে আসবে`, centerX, 40);
      }
    }

    // ==========================================
    // PRESET 2: NEWTON'S CANNON
    // ==========================================
    else if (params.preset === 'newton_cannon') {
      const centerX = width * 0.45;
      const centerY = height * 0.54;
      const earthR = Math.min(width, height) * 0.3;

      // Earth
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mountain on top
      const mountX = centerX;
      const mountY = centerY - earthR;
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(mountX - 8, mountY);
      ctx.lineTo(mountX, mountY - 14);
      ctx.lineTo(mountX + 8, mountY);
      ctx.closePath();
      ctx.fill();

      // Active orbit path based on launch velocity
      const v = params.launchVelocityKmS;
      ctx.lineWidth = 2;

      // 1. Crash (v < 7.9)
      if (v < 7.9) {
        ctx.strokeStyle = '#f43f5e';
        ctx.beginPath();
        ctx.moveTo(mountX, mountY - 14);
        const crashAngle = Math.min(Math.PI * 0.8, (v / 7.9) * Math.PI * 0.7);
        const endX = centerX + earthR * Math.cos(-Math.PI / 2 + crashAngle);
        const endY = centerY + earthR * Math.sin(-Math.PI / 2 + crashAngle);
        ctx.quadraticCurveTo(mountX + 90, mountY - 10, endX, endY);
        ctx.stroke();

        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 12px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        ctx.fillText('💥 ভূপাতন (Sub-orbital Crash): বেগ কক্ষীয় দ্রুতির চেয়ে কম (v < 7.91 km/s)', centerX, 35);
      }
      // 2. Circular Orbit (v ≈ 7.91)
      else if (v >= 7.9 && v < 8.2) {
        ctx.strokeStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(centerX, centerY, earthR + 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 12px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        ctx.fillText('⭕ প্রথম মহাজাগতিক বেগ / বৃত্তাকার কক্ষপথ (v = √gR ≈ 7.91 km/s)', centerX, 35);
      }
      // 3. Elliptical Orbit (8.2 <= v < 11.19)
      else if (v >= 8.2 && v < 11.19) {
        ctx.strokeStyle = '#a855f7';
        const aOrb = (earthR + 14) * (1 + (v - 8.2) * 0.35);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + (aOrb - earthR - 14) * 0.5, earthR + 14, aOrb, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 12px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        ctx.fillText('🪐 উপবৃত্তাকার কক্ষপথ (7.91 < v < 11.2 km/s)', centerX, 35);
      }
      // 4. Parabolic Escape (v = 11.2)
      else if (v >= 11.19 && v <= 11.5) {
        ctx.strokeStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(mountX, mountY - 14);
        ctx.quadraticCurveTo(mountX + 200, mountY - 14, width, centerY + 100);
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 12px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        ctx.fillText('🚀 দ্বিতীয় মহাজাগতিক বেগ / অধিবৃত্তীয় মুক্তি (v = v_e = 11.2 km/s)', centerX, 35);
      }
      // 5. Hyperbolic (v > 11.5)
      else {
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(mountX, mountY - 14);
        ctx.lineTo(width, mountY - 40);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 12px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        ctx.fillText('🌌 পরাবৃত্তীয় মুক্তি ও আন্তঃনাক্ষত্রিক গতি (Hyperbolic Escape: v > 11.2 km/s)', centerX, 35);
      }

      // Animated Cannonball along path
      const tCannon = telemetry.elapsedTime * 1.5;
      let ballX = mountX;
      let ballY = mountY - 14;

      if (v < 7.9) {
        const crashPeriod = 3.0;
        const progress = Math.min(1, (tCannon % crashPeriod) / (crashPeriod * 0.8));
        const crashAngle = Math.min(Math.PI * 0.8, (v / 7.9) * Math.PI * 0.7);
        const endX = centerX + earthR * Math.cos(-Math.PI / 2 + crashAngle);
        const endY = centerY + earthR * Math.sin(-Math.PI / 2 + crashAngle);

        const cpX = mountX + 90;
        const cpY = mountY - 10;
        const u = 1 - progress;
        ballX = u * u * mountX + 2 * u * progress * cpX + progress * progress * endX;
        ballY = u * u * (mountY - 14) + 2 * u * progress * cpY + progress * progress * endY;

        if (progress >= 0.98) {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(endX, endY, 12 + Math.random() * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (v >= 7.9 && v < 8.2) {
        const orbR = earthR + 14;
        const ang = -Math.PI / 2 + tCannon * 0.8;
        ballX = centerX + orbR * Math.cos(ang);
        ballY = centerY + orbR * Math.sin(ang);
      } else if (v >= 8.2 && v < 11.19) {
        const aOrb = (earthR + 14) * (1 + (v - 8.2) * 0.35);
        const bOrb = earthR + 14;
        const ang = -Math.PI / 2 + tCannon * 0.7;
        const ellipseCenterY = centerY + (aOrb - earthR - 14) * 0.5;
        ballX = centerX + bOrb * Math.sin(ang);
        ballY = ellipseCenterY - aOrb * Math.cos(ang);
      } else {
        const escProg = (tCannon * 0.35) % 3;
        ballX = mountX + escProg * 140;
        ballY = (mountY - 14) + (v >= 11.5 ? -escProg * 25 : Math.pow(escProg, 1.8) * 40);
      }

      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // ==========================================
    // PRESET 3: ATMOSPHERIC RETENTION
    // ==========================================
    else if (params.preset === 'atmospheric_retention') {
      const centerX = width * 0.45;
      const centerY = height * 0.55;
      const planetR = Math.min(width, height) * 0.28;
      const atmoR = planetR + 65;

      // Atmosphere ring
      const atmoGrad = ctx.createRadialGradient(centerX, centerY, planetR, centerX, centerY, atmoR);
      atmoGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      atmoGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = atmoGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, atmoR, 0, Math.PI * 2);
      ctx.fill();

      // Planet Body
      ctx.fillStyle = currentPlanet.color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, planetR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Gas particles buzzing
      const numParticles = 24;
      const gasColor = telemetry.isRetained ? '#22c55e' : '#f43f5e';
      for (let i = 0; i < numParticles; i++) {
        const pAng = (i / numParticles) * Math.PI * 2 + telemetry.elapsedTime * 0.2;
        const pDist = planetR + 15 + Math.sin(i * 3 + telemetry.elapsedTime * 4) * 25;
        const px = centerX + pDist * Math.cos(pAng);
        const py = centerY + pDist * Math.sin(pAng);

        ctx.fillStyle = gasColor;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Retention Verdict Banner
      ctx.font = 'bold 13px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      if (telemetry.isRetained) {
        ctx.fillStyle = '#22c55e';
        ctx.fillText(`🟢 বায়ুমণ্ডলে ${GASES[params.selectedGas].name} স্থায়ীভাবে সংরক্ষিত (v_rms < ⅕ v_e)`, centerX, 40);
      } else {
        ctx.fillStyle = '#f43f5e';
        ctx.fillText(`🔴 উচ্চ আরএমএস বেগের কারণে ${GASES[params.selectedGas].name} মহাশূন্যে বিলীন হয়ে যাবে (v_rms ≥ ⅕ v_e)`, centerX, 40);
      }
    }

    // ==========================================
    // PRESET 4: NEWTON-KEPLER BRIDGE
    // ==========================================
    else if (params.preset === 'newton_kepler_bridge') {
      const centerX = width * 0.45;
      const centerY = height * 0.5;
      const earthR = Math.min(width, height) * 0.22;

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthR, 0, Math.PI * 2);
      ctx.fill();

      const rPix = earthR + (params.orbitAltitudeKm / 36000) * (height * 0.25);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, rPix, 0, Math.PI * 2);
      ctx.stroke();

      // Satellite position
      const satAngle = telemetry.elapsedTime * 0.8;
      const sx = centerX + rPix * Math.cos(satAngle);
      const sy = centerY + rPix * Math.sin(satAngle);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(sx, sy, 6, 0, Math.PI * 2);
      ctx.fill();

      // Force & Velocity Vectors
      drawVectorArrow(ctx, sx, sy, sx - 35 * Math.cos(satAngle), sy - 35 * Math.sin(satAngle), '#38bdf8', 'F_g = F_c', 6);
      drawVectorArrow(ctx, sx, sy, sx - 35 * Math.sin(satAngle), sy + 35 * Math.cos(satAngle), '#22c55e', 'v', 6);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('GMm/r² = mv²/r  ➔  v = √(GM/r)  ➔  T² = (4π²/GM) r³  (কেপলারের ৩য় সূত্র)', centerX, 40);
    }
  }, [containerDimensions, params, telemetry, language]);

  return (
    <div ref={containerRef} className="flex-1 w-full flex flex-col gap-3">
      <div className="relative w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-md">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: `${containerDimensions.height}px` }}
          className="block"
        />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 transition-colors"
            title={isFullScreen ? t(language, 'exitFullScreen') : t(language, 'fullScreen')}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Control Deck */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-cyan-600 hover:bg-cyan-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? t(language, 'pause') : t(language, 'play')}</span>
          </button>

          <button
            onClick={onStep}
            disabled={isPlaying}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{t(language, 'step')}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t(language, 'reset')}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSlowMo}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              params.slowMo
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            🐢 {t(language, 'slowMo')}
          </button>
        </div>
      </div>
    </div>
  );
};

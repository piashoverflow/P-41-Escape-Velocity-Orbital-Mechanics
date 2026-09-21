import React, { useRef, useEffect } from 'react';
import { SimulationParams, TelemetryState, Language } from '../types';
import { t } from '../utils/i18n';
import { fmtNum, fmtSci, PLANETS, GASES, R_GAS, G_UNIVERSAL } from '../utils/physics';
import { 
  Activity, 
  BarChart3, 
  Zap, 
  Rocket, 
  Wind, 
  Orbit 
} from 'lucide-react';

interface AnalyticsPanelProps {
  language: Language;
  params: SimulationParams;
  telemetry: TelemetryState;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  language,
  params,
  telemetry,
}) => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const planet = PLANETS[params.selectedPlanet];
  const gas = GASES[params.selectedGas];

  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Dark background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(35, 15);
    ctx.lineTo(35, h - 22);
    ctx.lineTo(w - 10, h - 22);
    ctx.stroke();

    ctx.font = '9px JetBrains Mono';
    ctx.fillStyle = '#94a3b8';

    if (params.preset === 'atmospheric_retention') {
      // Maxwell-Boltzmann Distribution Curve
      ctx.fillText('P(v)', 12, 18);
      ctx.fillText('v (km/s)', w - 45, h - 8);

      const vRms = Math.sqrt((3 * R_GAS * params.planetTempK) / gas.molarMass) / 1000; // km/s
      const vPeak = Math.sqrt((2 * R_GAS * params.planetTempK) / gas.molarMass) / 1000;
      const vEsc = planet.ve;

      // Plot curve: f(v) ~ v^2 * exp(-v^2 / (2 * v_p^2))
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const maxV = Math.max(vEsc * 1.3, vRms * 3, 15);
      let started = false;

      for (let px = 0; px <= w - 45; px += 2) {
        const v = (px / (w - 45)) * maxV;
        const norm = v / (vPeak || 1);
        const yVal = Math.pow(norm, 2) * Math.exp(-norm * norm) * 2.2;
        const py = (h - 22) - Math.min(yVal * (h - 40), h - 30);

        if (!started) {
          ctx.moveTo(35 + px, py);
          started = true;
        } else {
          ctx.lineTo(35 + px, py);
        }
      }
      ctx.stroke();

      // v_rms vertical marker
      const rmsX = 35 + (vRms / maxV) * (w - 45);
      if (rmsX <= w - 10) {
        ctx.strokeStyle = '#eab308';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(rmsX, 15);
        ctx.lineTo(rmsX, h - 22);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#eab308';
        ctx.fillText(`v_rms`, rmsX - 12, 14);
      }

      // v_e threshold line
      const escX = 35 + (vEsc / maxV) * (w - 45);
      if (escX <= w - 10) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(escX, 15);
        ctx.lineTo(escX, h - 22);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`v_e`, escX - 8, 14);
      }
    } else if (params.preset === 'newton_kepler_bridge') {
      // Kepler's 3rd law: T^2 vs r^3
      ctx.fillText('T² (h²)', 12, 18);
      ctx.fillText('r³ (×10¹² m³)', w - 65, h - 8);

      // Linear Kepler curve
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(35, h - 22);
      ctx.lineTo(w - 20, 20);
      ctx.stroke();

      // Current planet probe point
      const r = planet.R + params.orbitAltitudeKm * 1000;
      const tSec = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / (G_UNIVERSAL * planet.M));
      const tHours = tSec / 3600;
      const rNorm = (params.orbitAltitudeKm - 300) / (40000 - 300);
      const ptX = 35 + Math.max(0, Math.min(1, rNorm)) * (w - 55);
      const ptY = (h - 22) - Math.max(0, Math.min(1, rNorm)) * (h - 42);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(ptX, ptY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`T=${fmtNum(tHours, 1)}h`, ptX - 16, ptY - 8);
    } else {
      // Escape Velocity & Newton Cannon: Energy vs Velocity (E = 1/2 v^2 - GM/R)
      ctx.fillText('E (MJ/kg)', 10, 18);
      ctx.fillText('v₀ (km/s)', w - 45, h - 8);

      // Zero-energy threshold (Parabolic Escape)
      const zeroY = h * 0.45;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(35, zeroY);
      ctx.lineTo(w - 10, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('E=0 (Escape)', w - 65, zeroY - 4);

      // Parabolic curve: E = 0.5 * v^2 - GM/R
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const maxV = 20; // km/s
      const vesc = planet.ve;

      for (let px = 0; px <= w - 45; px += 2) {
        const v = (px / (w - 45)) * maxV;
        // Specific energy in MJ/kg: 0.5 * (v^2 - vesc^2)
        const eSpec = 0.5 * (v * v - vesc * vesc);
        const normE = (eSpec / 150); // scale factor
        const py = zeroY - normE * (h * 0.4);

        if (px === 0) ctx.moveTo(35 + px, Math.max(15, Math.min(h - 24, py)));
        else ctx.lineTo(35 + px, Math.max(15, Math.min(h - 24, py)));
      }
      ctx.stroke();

      // Current probe point
      const curX = 35 + (params.launchVelocityKmS / maxV) * (w - 45);
      const curE = 0.5 * (params.launchVelocityKmS * params.launchVelocityKmS - vesc * vesc);
      const curY = zeroY - (curE / 150) * (h * 0.4);

      ctx.fillStyle = curE >= 0 ? '#10b981' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(Math.min(w - 12, curX), Math.max(15, Math.min(h - 24, curY)), 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [params, telemetry, planet, gas]);

  // Trajectory Bengali/English label
  const getTrajectoryLabel = () => {
    switch (telemetry.trajectoryType) {
      case 'crash':
        return language === 'bn' ? 'পৃষ্ঠে পতন (Suborbital Crash)' : 'Suborbital Crash';
      case 'circular':
        return language === 'bn' ? 'বৃত্তাকার কক্ষপথ (Circular Orbit)' : 'Circular Orbit (e = 0)';
      case 'elliptical':
        return language === 'bn' ? 'উপবৃত্তাকার কক্ষপথ (Elliptical Orbit)' : 'Elliptical Orbit (0 < e < 1)';
      case 'parabolic_escape':
        return language === 'bn' ? 'পরাবৃত্তীয় মুক্তি (Parabolic Escape)' : 'Parabolic Escape (e = 1, E = 0)';
      case 'hyperbolic_escape':
        return language === 'bn' ? 'অধিবৃত্তীয় মহাশূন্য মুক্তি (Hyperbolic)' : 'Hyperbolic Escape (e > 1, E > 0)';
    }
  };

  return (
    <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-3">
      {/* 1. Live Telemetry Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <div className="p-1.5 bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-200">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'telemetryTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Planet & Launch Speed */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'currentSpeed')}</span>
            <span className="font-mono font-black text-cyan-700 text-sm mt-0.5">
              {fmtNum(telemetry.currentSpeedKmS, 2)} km/s
            </span>
          </div>

          {/* Escape Speed */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'escapeVelocity')}</span>
            <span className="font-mono font-black text-emerald-700 text-sm mt-0.5">
              {fmtNum(telemetry.escapeSpeedKmS, 2)} km/s
            </span>
          </div>

          {/* Circular Orbit Speed */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'circularSpeed')}</span>
            <span className="font-mono font-black text-indigo-700 text-sm mt-0.5">
              {fmtNum(telemetry.circularSpeedKmS, 2)} km/s
            </span>
          </div>

          {/* Trajectory classification */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'trajectoryType')}</span>
            <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 truncate">
              {getTrajectoryLabel()}
            </span>
          </div>

          {/* Atmospheric Retention details if in atmospheric mode */}
          {params.preset === 'atmospheric_retention' && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'vRms')}</span>
                <span className="font-mono font-black text-amber-700 text-sm mt-0.5">
                  {fmtNum(telemetry.vRmsKmS, 2)} km/s
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">অনুপাত (v_rms / v_e)</span>
                <span className={`font-mono font-black text-sm mt-0.5 ${telemetry.isRetained ? 'text-emerald-700' : 'text-red-600'}`}>
                  {fmtNum(telemetry.retentionRatio * 100, 1)}% {telemetry.isRetained ? '✓ স্থায়ী' : '✗ অপসৃত'}
                </span>
              </div>
            </>
          )}

          {/* Kepler specifics */}
          {params.preset === 'newton_kepler_bridge' && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'orbitalPeriod')}</span>
                <span className="font-mono font-black text-indigo-700 text-sm mt-0.5">
                  {fmtNum(telemetry.orbitalPeriodHours, 2)} hours
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'keplerRatio')}</span>
                <span className="font-mono font-black text-slate-900 text-xs mt-0.5">
                  {fmtSci(telemetry.keplerConstant, 2)} s²/m³
                </span>
              </div>
            </>
          )}
        </div>

        {/* Real-time Graph */}
        <div className="mt-1 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            <span>
              {params.preset === 'atmospheric_retention' 
                ? 'ম্যাক্সওয়েল-বোল্টজম্যান বেগ বণ্টন (v_rms vs v_e)'
                : params.preset === 'newton_kepler_bridge'
                ? 'কেপলারের ৩য় সূত্র সরলরৈখিক গ্রাফ (T² vs r³)'
                : 'যান্ত্রিক শক্তি ও মুক্তিবেগ কনিক ডায়াগ্রাম'}
            </span>
          </span>
          <div className="w-full h-28 bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            <canvas ref={chartCanvasRef} width={340} height={112} className="w-full h-full block" />
          </div>
        </div>
      </div>

      {/* 2. Step-by-Step Mathematical Proof */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="p-1 bg-cyan-50 text-cyan-700 rounded-md border border-cyan-200">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'exactMathTitle')}
          </h3>
        </div>

        {params.preset === 'escape_velocity' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-cyan-800 font-black block">১. শক্তির নিত্যতা থেকে মুক্তিবেগ প্রতিপাদন:</span>
              <p className="text-slate-700 font-medium">
                E_total = ½ m v_e² - GMm / R = 0 (অসীমে বিভব ও গতিশক্তি = ০)
              </p>
              <p className="text-emerald-700 font-bold mt-1">
                ➔ v_e = √(2GM / R) = √(2gR) = {fmtNum(telemetry.escapeSpeedKmS, 2)} km/s
              </p>
              <p className="text-slate-500 text-[11px] mt-1 font-sans">
                *লক্ষণীয়: মুক্তিবেগ নিক্ষিপ্ত বস্তুর ভর (m) বা নিক্ষেপণ কোণের (θ) উপর নির্ভর করে না!
              </p>
            </div>
          </div>
        )}

        {params.preset === 'newton_cannon' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-indigo-800 font-black block">২. নিউটনের কামানের ৫টি কনিক দশা:</span>
              <p className="text-slate-700 font-medium">
                • v &lt; v_c (7.91 km/s): উপবৃত্তাকার পতন (Crash)<br />
                • v = v_c: বৃত্তাকার কক্ষপথ (e = 0)<br />
                • v_c &lt; v &lt; v_e: উপবৃত্তাকার কক্ষপথ (0 &lt; e &lt; 1)<br />
                • v = v_e (11.2 km/s): পরাবৃত্তীয় উন্মুক্ত পথ (Parabola, e = 1)<br />
                • v &gt; v_e: অধিবৃত্তীয় মহাশূন্য মুক্তি (Hyperbola, e &gt; 1)
              </p>
            </div>
          </div>
        )}

        {params.preset === 'atmospheric_retention' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-amber-800 font-black block">৩. জিন্স এসকেপ মানদণ্ড (Jeans Escape Criterion):</span>
              <p className="text-slate-700 font-medium">
                v_rms = √(3RT / M) = {fmtNum(telemetry.vRmsKmS, 2)} km/s
              </p>
              <p className="text-slate-700 font-medium">
                v_e = {fmtNum(telemetry.escapeSpeedKmS, 2)} km/s &nbsp;(1/6 v_e = {fmtNum(telemetry.escapeSpeedKmS / 6, 2)} km/s)
              </p>
              <p className={`font-bold mt-1 ${telemetry.isRetained ? 'text-emerald-700' : 'text-red-600'}`}>
                {telemetry.isRetained 
                  ? '➔ v_rms < ⅙ v_e : গ্যাসটি বায়ুমণ্ডলে কোটি বছর স্থায়ী হবে!'
                  : '➔ v_rms > ⅙ v_e : ম্যাক্সওয়েল টেইলের অণুগুলো মহাশূন্যে হারিয়ে যাবে!'}
              </p>
            </div>
          </div>
        )}

        {params.preset === 'newton_kepler_bridge' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-indigo-800 font-black block">৪. নিউটনের সূত্র থেকে কেপলারের ৩য় সূত্র:</span>
              <p className="text-slate-700 font-medium">
                GMm / r² = m v² / r = m (4π² r² / T²) / r
              </p>
              <p className="text-emerald-700 font-bold mt-1">
                ➔ T² = (4π² / GM) · r³ &nbsp;⇒&nbsp; T² ∝ r³
              </p>
              <p className="text-slate-900 font-bold mt-1">
                ধ্রুবক K = 4π² / (GM) = {fmtSci(telemetry.keplerConstant, 3)} s²/m³
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

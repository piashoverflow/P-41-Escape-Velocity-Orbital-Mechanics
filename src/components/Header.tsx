import React from 'react';
import { Play, Pause, RotateCcw, Rocket, Orbit, Wind, Link2, Sparkles } from 'lucide-react';
import { P41Mode } from '../types';

interface HeaderProps {
  mode: P41Mode;
  setMode: (mode: P41Mode) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean | ((prev: boolean) => boolean)) => void;
  onReset: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  showMath: boolean;
  setShowMath: (show: boolean | ((prev: boolean) => boolean)) => void;
  lang: 'en' | 'bn';
  setLang: (lang: 'en' | 'bn') => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  isRunning,
  setIsRunning,
  onReset,
  speed,
  setSpeed,
  showMath,
  setShowMath,
  lang,
  setLang,
}) => {
  const modes = [
    {
      id: 'newtons_cannon' as P41Mode,
      labelEn: "Newton's Cannon & Conics",
      labelBn: 'নিউটনের কামান ও কনিক্স',
      icon: Orbit,
    },
    {
      id: 'planetary_escape' as P41Mode,
      labelEn: 'Planetary Escape Speeds',
      labelBn: 'বিভিন্ন গ্রহে মুক্তিবেগ',
      icon: Rocket,
    },
    {
      id: 'atmospheric_retention' as P41Mode,
      labelEn: 'Atmospheric Retention',
      labelBn: 'বায়ুমণ্ডল ধারণ (v_rms vs v_e)',
      icon: Wind,
    },
    {
      id: 'kepler_newton_bridge' as P41Mode,
      labelEn: 'Newton ⟷ Kepler Proof',
      labelBn: 'নিউটনের মহাকর্ষ ও কেপলার ৩য় সূত্র',
      icon: Link2,
    },
  ];

  return (
    <header className="bg-slate-900/90 border-b border-amber-500/20 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Rocket className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold font-mono bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                P-41
              </span>
              <h1 className="text-lg font-bold text-white tracking-wide">
                {lang === 'bn' ? 'মুক্তিবেগ, কনিক্যাল কক্ষপথ ও কেপলারীয় সম্পর্ক' : 'Escape Velocity, Orbital Conics & Kepler Bridge'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {lang === 'bn'
                ? 'মুক্তিবেগ v_e = √(2gR) ≈ ১১.২ km/s • নিউটনের কামান • চাঁদে কেন বায়ুমণ্ডল নেই • T² ∝ a³ প্রমাণ'
                : "Escape Speed v_e = √(2gR) ≈ 11.2 km/s • Newton's Cannonball • Atmosphere Retention • T² ∝ a³"}
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto max-w-full">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? m.labelBn : m.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning((p) => !p)}
            className={`p-2 rounded-lg text-white font-medium flex items-center gap-1 transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-md'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-md'
            }`}
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowMath((p) => !p)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showMath
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'bn' ? 'তত্ত্ব ও প্রমাণ' : 'Theory & Proof'}</span>
          </button>

          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-400"
          >
            {lang === 'en' ? 'বাংলা' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { SimulationParams, Language } from '../types';
import { t } from '../utils/i18n';
import { PLANETS, GASES } from '../utils/physics';
import { 
  Sliders, 
  RotateCcw, 
  Rocket, 
  Target, 
  Wind, 
  Orbit, 
  Eye, 
  Sparkles 
} from 'lucide-react';

interface ControlPanelProps {
  language: Language;
  params: SimulationParams;
  onChangeParams: (updater: (prev: SimulationParams) => SimulationParams) => void;
  onResetDefaults: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  language,
  params,
  onChangeParams,
  onResetDefaults,
}) => {
  const updateParam = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    onChangeParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-3">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-3">
        {/* Header with Reset Defaults */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-200">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-black text-slate-800 tracking-wider uppercase">
              {t(language, 'controlParameters')}
            </h2>
          </div>

          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1 text-[11px] font-bold text-cyan-700 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100 px-2.5 py-1 rounded-lg border border-cyan-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t(language, 'resetDefaults')}</span>
          </button>
        </div>

        {/* Planet Selector (Tabs 1 & 3) */}
        {(params.preset === 'escape_velocity' || params.preset === 'atmospheric_retention') && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-700">{t(language, 'selectPlanet')}</span>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(PLANETS) as Array<keyof typeof PLANETS>).map((key) => {
                const pl = PLANETS[key];
                const isSelected = params.selectedPlanet === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      updateParam('selectedPlanet', key);
                      updateParam('planetTempK', pl.defaultTemp);
                      if (key === 'moon') updateParam('launchVelocityKmS', 2.38);
                      else if (key === 'earth') updateParam('launchVelocityKmS', 11.2);
                    }}
                    className={`px-2 py-1.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pl.color }} />
                    <span className="truncate">{language === 'bn' ? pl.nameBn.split(' ')[0] : pl.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 1: Escape Velocity */}
        {params.preset === 'escape_velocity' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'launchVelocity')}</span>
                <span className="font-mono font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  v₀ = {params.launchVelocityKmS.toFixed(2)} km/s
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="18"
                step="0.2"
                value={params.launchVelocityKmS}
                onChange={(e) => updateParam('launchVelocityKmS', parseFloat(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'launchAngle')}</span>
                <span className="font-mono font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  θ = {params.launchAngleDeg}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={params.launchAngleDeg}
                onChange={(e) => updateParam('launchAngleDeg', parseFloat(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>অনুভূমিক (0°)</span>
                <span>খাড়া ঊর্ধ্বমুখী (90°)</span>
              </div>
            </div>

            <button
              onClick={() => updateParam('launchVelocityKmS', 11.19)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl text-cyan-800 text-xs font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ঠিক মুক্তিবেগে সেট করুন (v₀ = 11.2 km/s)</span>
            </button>
          </div>
        )}

        {/* Tab 2: Newton's Cannon */}
        {params.preset === 'newton_cannon' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">কামান হতে গোলা নিক্ষেপ দ্রুতি:</span>
                <span className="font-mono font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  v₀ = {params.launchVelocityKmS.toFixed(2)} km/s
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="14"
                step="0.1"
                value={params.launchVelocityKmS}
                onChange={(e) => updateParam('launchVelocityKmS', parseFloat(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <span className="text-[11px] font-bold text-slate-600">কনিক গতিপথের ধাপ নির্বাচন:</span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => updateParam('launchVelocityKmS', 6.5)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border rounded-lg text-slate-700 font-bold text-left"
              >
                💥 ভূপাতন (v &lt; 7.9)
              </button>
              <button
                onClick={() => updateParam('launchVelocityKmS', 7.91)}
                className="p-1.5 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg text-cyan-900 font-bold text-left"
              >
                ⭕ বৃত্তাকার (v = 7.91)
              </button>
              <button
                onClick={() => updateParam('launchVelocityKmS', 9.5)}
                className="p-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-indigo-900 font-bold text-left"
              >
                🪐 উপবৃত্ত (7.9 &lt; v &lt; 11.2)
              </button>
              <button
                onClick={() => updateParam('launchVelocityKmS', 11.2)}
                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-emerald-900 font-bold text-left"
              >
                🚀 অধিবৃত্ত (v = 11.2)
              </button>
              <button
                onClick={() => updateParam('launchVelocityKmS', 13.0)}
                className="p-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-purple-900 font-bold text-left col-span-2"
              >
                🌌 পরাবৃত্তীয় মুক্তি (v &gt; 11.2 km/s)
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Atmospheric Retention */}
        {params.preset === 'atmospheric_retention' && (
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-700">{t(language, 'selectGas')}</span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {(Object.keys(GASES) as Array<keyof typeof GASES>).map((key) => {
                const g = GASES[key];
                const isSelected = params.selectedGas === key;
                return (
                  <button
                    key={key}
                    onClick={() => updateParam('selectedGas', key)}
                    className={`p-1.5 rounded-lg border font-bold text-left ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{g.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'planetTemp')}</span>
                <span className="font-mono font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  {params.planetTempK} K
                </span>
              </div>
              <input
                type="range"
                min="80"
                max="450"
                step="5"
                value={params.planetTempK}
                onChange={(e) => updateParam('planetTempK', parseFloat(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Newton-Kepler Bridge */}
        {params.preset === 'newton_kepler_bridge' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'orbitAltitude')}</span>
                <span className="font-mono font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  h = {params.orbitAltitudeKm} km
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="36000"
                step="400"
                value={params.orbitAltitudeKm}
                onChange={(e) => updateParam('orbitAltitudeKm', parseFloat(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => updateParam('orbitAltitudeKm', 400)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border rounded-lg text-slate-700 font-bold text-left"
              >
                🛰️ ISS (400 km)
              </button>
              <button
                onClick={() => updateParam('orbitAltitudeKm', 35786)}
                className="p-1.5 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg text-cyan-900 font-bold text-left"
              >
                📡 ভূ-স্থির (35,786 km)
              </button>
            </div>
          </div>
        )}

        {/* Visualizer Toggles */}
        <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
          <div className="text-[11px] font-black text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-600" />
            <span>{t(language, 'visualizerToggles')}</span>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showVectors}
              onChange={(e) => updateParam('showVectors', e.target.checked)}
              className="accent-cyan-600 rounded"
            />
            <span>{t(language, 'showVectors')}</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showGrid}
              onChange={(e) => updateParam('showGrid', e.target.checked)}
              className="accent-cyan-600 rounded"
            />
            <span>{t(language, 'showGrid')}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { P41Mode, CannonParams, PlanetaryEscapeParams, AtmosphericParams, KeplerNewtonBridgeParams } from '../types';
import { Sliders, Rocket, Orbit, Wind, Link2 } from 'lucide-react';

interface ControlDeckProps {
  mode: P41Mode;
  cannonParams: CannonParams;
  setCannonParams: React.Dispatch<React.SetStateAction<CannonParams>>;
  escapeParams: PlanetaryEscapeParams;
  setEscapeParams: React.Dispatch<React.SetStateAction<PlanetaryEscapeParams>>;
  atmosParams: AtmosphericParams;
  setAtmosParams: React.Dispatch<React.SetStateAction<AtmosphericParams>>;
  bridgeParams: KeplerNewtonBridgeParams;
  setBridgeParams: React.Dispatch<React.SetStateAction<KeplerNewtonBridgeParams>>;
  lang: 'en' | 'bn';
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  mode,
  cannonParams,
  setCannonParams,
  escapeParams,
  setEscapeParams,
  atmosParams,
  setAtmosParams,
  bridgeParams,
  setBridgeParams,
  lang,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
        <Sliders className="w-4 h-4 text-amber-400" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          {lang === 'bn' ? 'প্যারামিটার ও কন্ট্রোল' : 'Controls & Presets'}
        </h2>
      </div>

      {/* MODE 1: CANNON */}
      {mode === 'newtons_cannon' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'নিক্ষেপ বেগ (Launch Speed km/s)' : 'Launch Speed (km/s)'}</span>
              <span className="font-mono text-amber-400">{cannonParams.launchVelocityKmS.toFixed(2)} km/s</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="16.0"
              step="0.05"
              value={cannonParams.launchVelocityKmS}
              onChange={(e) =>
                setCannonParams((p) => ({ ...p, launchVelocityKmS: parseFloat(e.target.value) }))
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {[
              { name: 'Sub-orbital (5 km/s)', v: 5.0 },
              { name: 'Circular (7.91 km/s)', v: 7.91 },
              { name: 'Elliptical (9.5 km/s)', v: 9.5 },
              { name: 'Escape (11.2 km/s)', v: 11.2 },
            ].map((btn) => (
              <button
                key={btn.name}
                onClick={() => setCannonParams((p) => ({ ...p, launchVelocityKmS: btn.v }))}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[10px] text-slate-300 font-mono text-left"
              >
                {btn.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: PLANETARY ESCAPE */}
      {mode === 'planetary_escape' && (
        <div className="space-y-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block mb-1.5">
              {lang === 'bn' ? 'গ্রহ নির্বাচন করুন:' : 'Select Celestial Body:'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'moon' as const, name: 'Moon (2.38 km/s)' },
                { id: 'mars' as const, name: 'Mars (5.03 km/s)' },
                { id: 'earth' as const, name: 'Earth (11.2 km/s)' },
                { id: 'jupiter' as const, name: 'Jupiter (59.5 km/s)' },
              ].map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => setEscapeParams((p) => ({ ...p, selectedPlanet: pl.id }))}
                  className={`p-1.5 rounded border text-[11px] font-mono text-left ${
                    escapeParams.selectedPlanet === pl.id
                      ? 'bg-amber-500/30 text-amber-300 border-amber-500/50 font-bold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {pl.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'রকেটের বেগ অনুপাত (Speed / v_e)' : 'Rocket Speed / v_e Ratio'}</span>
              <span className="font-mono text-emerald-400">{escapeParams.rocketSpeedRatio.toFixed(2)} x</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.5"
              step="0.05"
              value={escapeParams.rocketSpeedRatio}
              onChange={(e) =>
                setEscapeParams((p) => ({ ...p, rocketSpeedRatio: parseFloat(e.target.value) }))
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* MODE 3: ATMOSPHERE */}
      {mode === 'atmospheric_retention' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'তাপমাত্রা (Temperature Kelvin)' : 'Atmosphere Temp (K)'}</span>
              <span className="font-mono text-rose-400">{atmosParams.temperatureKelvin} K</span>
            </div>
            <input
              type="range"
              min="100"
              max="500"
              step="10"
              value={atmosParams.temperatureKelvin}
              onChange={(e) =>
                setAtmosParams((p) => ({ ...p, temperatureKelvin: parseInt(e.target.value, 10) }))
              }
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div>
            <span className="text-slate-400 font-medium block mb-1">
              {lang === 'bn' ? 'গ্রহ পরিবর্তন:' : 'Switch Planet:'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {(['earth', 'moon', 'mars', 'jupiter'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setAtmosParams((p) => ({ ...p, celestialBody: b }))}
                  className={`p-1.5 rounded border text-[11px] font-mono capitalize ${
                    atmosParams.celestialBody === b
                      ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 font-bold'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: BRIDGE */}
      {mode === 'kepler_newton_bridge' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'কক্ষীয় ব্যাসার্ধ r (Orbital Radius)' : 'Orbital Radius r (km)'}</span>
              <span className="font-mono text-cyan-400">{bridgeParams.orbitalRadiusKm.toLocaleString()} km</span>
            </div>
            <input
              type="range"
              min="7000"
              max="42000"
              step="500"
              value={bridgeParams.orbitalRadiusKm}
              onChange={(e) =>
                setBridgeParams((p) => ({ ...p, orbitalRadiusKm: parseFloat(e.target.value) }))
              }
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

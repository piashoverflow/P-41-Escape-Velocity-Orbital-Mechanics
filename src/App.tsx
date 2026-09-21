import React, { useState } from 'react';
import { Header } from './components/Header';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlDeck } from './components/ControlDeck';
import { MathFormulaOverlay } from './components/MathFormulaOverlay';
import { P41Mode, CannonParams, PlanetaryEscapeParams, AtmosphericParams, KeplerNewtonBridgeParams } from './types';

export default function App() {
  const [mode, setMode] = useState<P41Mode>('newtons_cannon');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [showMath, setShowMath] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'bn'>('bn');
  const [time, setTime] = useState<number>(0);

  const [cannonParams, setCannonParams] = useState<CannonParams>({
    launchVelocityKmS: 7.91,
    mountainHeightKm: 300,
    showTrajectoryHistory: true,
    centralBody: 'earth',
  });

  const [escapeParams, setEscapeParams] = useState<PlanetaryEscapeParams>({
    selectedPlanet: 'earth',
    rocketSpeedRatio: 1.0,
  });

  const [atmosParams, setAtmosParams] = useState<AtmosphericParams>({
    temperatureKelvin: 300,
    celestialBody: 'earth',
    selectedGases: ['H2', 'He', 'H2O', 'N2', 'O2', 'CO2'],
  });

  const [bridgeParams, setBridgeParams] = useState<KeplerNewtonBridgeParams>({
    orbitalRadiusKm: 12000,
    centralMassFactor: 1.0,
  });

  const handleReset = () => {
    setTime(0);
  };

  return (
    <div className="min-h-screen bg-[#070614] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <Header
        mode={mode}
        setMode={setMode}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        onReset={handleReset}
        speed={speed}
        setSpeed={setSpeed}
        showMath={showMath}
        setShowMath={setShowMath}
        lang={lang}
        setLang={setLang}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 flex flex-col items-center justify-center">
          <SimulationCanvas
            mode={mode}
            isRunning={isRunning}
            speed={speed}
            cannonParams={cannonParams}
            escapeParams={escapeParams}
            atmosParams={atmosParams}
            bridgeParams={bridgeParams}
            time={time}
            setTime={setTime}
            lang={lang}
          />
        </div>

        <div className="lg:col-span-1">
          <ControlDeck
            mode={mode}
            cannonParams={cannonParams}
            setCannonParams={setCannonParams}
            escapeParams={escapeParams}
            setEscapeParams={setEscapeParams}
            atmosParams={atmosParams}
            setAtmosParams={setAtmosParams}
            bridgeParams={bridgeParams}
            setBridgeParams={setBridgeParams}
            lang={lang}
          />
        </div>
      </main>

      <MathFormulaOverlay
        mode={mode}
        show={showMath}
        onClose={() => setShowMath(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-900 px-4 py-2.5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-mono text-slate-400">P-41 Escape Velocity & Orbital Conics Lab</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Developed by</span>
            <span className="font-bold text-amber-400">Shamsuddin Piash</span>
            <span>• BUET ME '25</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

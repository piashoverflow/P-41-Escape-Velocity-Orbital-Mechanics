import React, { useState, useEffect, useRef } from 'react';
import { Language, PresetMode, AppTheme, SimulationParams, TelemetryState } from './types';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { MotionCanvas } from './components/MotionCanvas';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { TheoryModal } from './components/TheoryModal';
import { PLANETS, GASES, R_GAS, G_UNIVERSAL } from './utils/physics';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [theme, setTheme] = useState<AppTheme>('clean_bright');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const initialParams: SimulationParams = {
    preset: 'escape_velocity',
    theme: 'clean_bright',
    launchVelocityKmS: 11.2,
    launchAngleDeg: 45,
    selectedPlanet: 'earth',
    selectedGas: 'O2',
    planetTempK: 288,
    orbitAltitudeKm: 600,
    showVectors: true,
    showOrbitTrack: true,
    showGrid: true,
    slowMo: false,
  };

  const [params, setParams] = useState<SimulationParams>(initialParams);

  // Compute Telemetry State
  const computeTelemetry = (p: SimulationParams, simTime: number = 0): TelemetryState => {
    const planet = PLANETS[p.selectedPlanet];
    const gas = GASES[p.selectedGas];

    const v0 = p.launchVelocityKmS;
    const ve = planet.ve;
    const vc = planet.vc;

    // Trajectory type classification
    let traj: 'crash' | 'circular' | 'elliptical' | 'parabolic_escape' | 'hyperbolic_escape' = 'crash';
    if (v0 < vc * 0.96) {
      traj = 'crash';
    } else if (Math.abs(v0 - vc) <= 0.15) {
      traj = 'circular';
    } else if (v0 < ve * 0.99) {
      traj = 'elliptical';
    } else if (Math.abs(v0 - ve) <= 0.15) {
      traj = 'parabolic_escape';
    } else {
      traj = 'hyperbolic_escape';
    }

    // Atmospheric retention
    const vRms = Math.sqrt((3 * R_GAS * p.planetTempK) / gas.molarMass) / 1000; // km/s
    const ratio = vRms / ve;
    const isRet = vRms < ve / 6;

    // Newton-Kepler Bridge
    const rOrbit = planet.R + p.orbitAltitudeKm * 1000;
    const vOrb = Math.sqrt((G_UNIVERSAL * planet.M) / rOrbit) / 1000; // km/s
    const tSec = 2 * Math.PI * Math.sqrt(Math.pow(rOrbit, 3) / (G_UNIVERSAL * planet.M));
    const tHours = tSec / 3600;
    const kConst = (4 * Math.PI * Math.PI) / (G_UNIVERSAL * planet.M);

    return {
      elapsedTime: simTime,
      currentSpeedKmS: v0,
      escapeSpeedKmS: ve,
      circularSpeedKmS: vc,
      trajectoryType: traj,
      currentAltKm: p.orbitAltitudeKm,
      currentRangeKm: v0 * simTime,
      vRmsKmS: vRms,
      retentionRatio: ratio,
      isRetained: isRet,
      orbitalSpeedKmS: vOrb,
      orbitalPeriodHours: tHours,
      keplerConstant: kConst,
    };
  };

  const [telemetry, setTelemetry] = useState<TelemetryState>(() => computeTelemetry(initialParams, 0));

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const handleReset = () => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    setTelemetry(computeTelemetry(params, 0));
  };

  const handleResetDefaults = () => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    const restored = { ...initialParams, preset: params.preset };
    setParams(restored);
    setTelemetry(computeTelemetry(restored, 0));
  };

  const handlePresetSelect = (newPreset: PresetMode) => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    let newV = params.launchVelocityKmS;
    if (newPreset === 'escape_velocity') newV = 11.2;
    if (newPreset === 'newton_cannon') newV = 7.91;
    const next = { ...params, preset: newPreset, launchVelocityKmS: newV };
    setParams(next);
    setTelemetry(computeTelemetry(next, 0));
  };

  const handleStep = () => {
    setTelemetry((prev) => computeTelemetry(params, prev.elapsedTime + 1));
  };

  const handleParamsUpdate = (updater: (prev: SimulationParams) => SimulationParams) => {
    setParams((prev) => {
      const next = updater(prev);
      setTelemetry((prevTel) => computeTelemetry(next, prevTel.elapsedTime));
      return next;
    });
  };

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const simDt = dt * (params.slowMo ? 0.25 : 1.0);
      setTelemetry((prev) => computeTelemetry(params, prev.elapsedTime + simDt));

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, params]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-slate-800">
      {/* 1. Header */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        preset={params.preset}
        onSelectPreset={handlePresetSelect}
        onOpenTheory={() => setIsModalOpen(true)}
        onReset={handleReset}
      />

      {/* 2. Main 3-Column Workspace */}
      <main className="max-w-[1780px] w-full mx-auto p-3 sm:p-4 flex-1 flex flex-col lg:flex-row gap-4 items-start">
        <ControlPanel
          language={language}
          params={params}
          onChangeParams={handleParamsUpdate}
          onResetDefaults={handleResetDefaults}
        />

        <MotionCanvas
          language={language}
          theme={theme}
          params={params}
          telemetry={telemetry}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
          onStep={handleStep}
          onReset={handleReset}
          onToggleSlowMo={() => setParams((prev) => ({ ...prev, slowMo: !prev.slowMo }))}
        />

        <AnalyticsPanel
          language={language}
          params={params}
          telemetry={telemetry}
        />
      </main>

      {/* 3. Theory Modal */}
      <TheoryModal
        language={language}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

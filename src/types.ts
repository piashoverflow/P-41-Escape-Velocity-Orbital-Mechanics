export type Language = 'bn' | 'en';
export type AppTheme = 'clean_bright' | 'midnight';
export type PresetMode = 'escape_velocity' | 'newton_cannon' | 'atmospheric_retention' | 'newton_kepler_bridge';

export interface SimulationParams {
  preset: PresetMode;
  theme: AppTheme;

  // Launch & Cannon
  launchVelocityKmS: number; // km/s (1 to 18 km/s)
  launchAngleDeg: number; // deg (0 = horizontal orbital, 90 = vertical escape)
  selectedPlanet: 'earth' | 'moon' | 'mars' | 'jupiter';

  // Atmospheric Gas
  selectedGas: 'H2' | 'He' | 'H2O' | 'N2' | 'O2' | 'CO2';
  planetTempK: number; // Kelvin

  // Newton-Kepler Bridge
  orbitAltitudeKm: number; // km (300 to 40000 km)

  // Toggles
  showVectors: boolean;
  showOrbitTrack: boolean;
  showGrid: boolean;
  slowMo: boolean;
}

export interface TelemetryState {
  elapsedTime: number;
  currentSpeedKmS: number;
  escapeSpeedKmS: number; // 11.2 km/s on Earth
  circularSpeedKmS: number; // 7.91 km/s on Earth
  trajectoryType: 'crash' | 'circular' | 'elliptical' | 'parabolic_escape' | 'hyperbolic_escape';
  currentAltKm: number;
  currentRangeKm: number;

  // Atmosphere
  vRmsKmS: number;
  retentionRatio: number; // v_rms / v_e
  isRetained: boolean;

  // Newton-Kepler Bridge
  orbitalSpeedKmS: number;
  orbitalPeriodHours: number;
  keplerConstant: number;
}

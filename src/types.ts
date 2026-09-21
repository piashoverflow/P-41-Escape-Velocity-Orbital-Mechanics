export type P41Mode = 'newtons_cannon' | 'planetary_escape' | 'atmospheric_retention' | 'kepler_newton_bridge';

export interface CannonParams {
  launchVelocityKmS: number; // 3 to 16 km/s
  mountainHeightKm: number; // 200 to 1000 km
  showTrajectoryHistory: boolean;
  centralBody: 'earth' | 'moon' | 'mars';
}

export interface PlanetaryEscapeParams {
  selectedPlanet: 'moon' | 'mars' | 'earth' | 'jupiter' | 'sun';
  rocketSpeedRatio: number; // fraction of escape velocity (0.2 to 1.5)
}

export interface AtmosphericParams {
  temperatureKelvin: number; // 100 to 500 K
  celestialBody: 'earth' | 'moon' | 'mars' | 'jupiter';
  selectedGases: string[]; // ['H2', 'He', 'H2O', 'N2', 'O2', 'CO2']
}

export interface KeplerNewtonBridgeParams {
  orbitalRadiusKm: number; // 7,000 to 42,000 km
  centralMassFactor: number; // 0.5 to 2.0
}

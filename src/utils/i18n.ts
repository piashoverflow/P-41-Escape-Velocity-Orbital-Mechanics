import { Language } from '../types';

export const translations = {
  bn: {
    // Header
    brandTitle: 'মুক্তিবেগ ও মহাকাশ গতিবিদ্যা',
    brandSubtitle: 'ল্যাব',
    tabEscape: 'মুক্তিবেগ তত্ত্ব (Escape v_e)',
    tabCannon: 'নিউটনের কামান (Newton Cannon)',
    tabAtmosphere: 'গ্রহের বায়ুমণ্ডল (Gas Retention)',
    tabBridge: 'নিউটনের মহাকর্ষ ও কেপলার ৩য় সূত্র',
    theoryButton: 'থিওরি ও সূত্রাবলী',
    udvashBadge: 'উদ্ভাস (Udvash)',

    // Controls
    controlParameters: 'কন্ট্রোল প্যারামিটারস',
    resetDefaults: 'ডিফল্ট রিসেট',
    launchVelocity: 'নিক্ষেপণ বেগ (v₀)',
    launchAngle: 'নিক্ষেপণ কোণ (θ)',
    selectPlanet: 'গ্রহ বা উপগ্রহ নির্বাচন:',
    selectGas: 'পরীক্ষাধীন গ্যাস নির্বাচন:',
    planetTemp: 'গ্রহের তাপমাত্রা (T)',
    orbitAltitude: 'কক্ষপথের উচ্চতা (h)',

    // Toggles
    visualizerToggles: 'ভিজ্যুয়ালাইজার অপশনস',
    showVectors: 'বেগ ও মহাকর্ষীয় বল ভেক্টর',
    showOrbitTrack: 'কক্ষপথ ও কনিক গতিপথ (Conic Trails)',
    showGrid: 'স্থানাঙ্ক গ্রিড (Grid)',

    // Telemetry
    telemetryTitle: 'লাইভ পরিমাপ ও টেলিমেট্রি',
    currentSpeed: 'নিক্ষেপণ বেগ (v₀)',
    escapeVelocity: 'প্রয়োজনীয় মুক্তিবেগ (v_e)',
    circularSpeed: 'কক্ষীয় দ্রুতি (v_c = √gR)',
    trajectoryType: 'গতিপথের কনিক প্রকৃতি',
    vRms: 'গ্যাস অণুর আরএমএস বেগ (v_rms)',
    retentionStatus: 'বায়ুমণ্ডলে গ্যাস ধারণ স্থায়িত্ব',
    orbitalPeriod: 'আবর্তনকাল (T = 2πr / v)',
    keplerRatio: 'কেপলার অনুপাত (T² / r³)',

    // Math Box
    exactMathTitle: 'গাণিতিক সমীকরণ ও বিশ্লেষণ',
    play: 'শুরু করুন',
    pause: 'থামুন',
    step: 'ধাপ (Step)',
    slowMo: '০.২৫x স্লো-মো',
    reset: 'রিসেট',
    fullScreen: 'পূর্ণ পর্দা',
    exitFullScreen: 'ছোট পর্দা',
  },
  en: {
    // Header
    brandTitle: 'Escape Velocity & Orbital Dynamics',
    brandSubtitle: 'LAB',
    tabEscape: 'Escape Velocity (v_e)',
    tabCannon: "Newton's Orbital Cannon",
    tabAtmosphere: 'Atmospheric Gas Retention',
    tabBridge: 'Newton-Kepler Bridge',
    theoryButton: 'Theory & Derivations',
    udvashBadge: 'Udvash',

    // Controls
    controlParameters: 'Control Parameters',
    resetDefaults: 'Reset Defaults',
    launchVelocity: 'Launch Velocity (v₀)',
    launchAngle: 'Launch Angle (θ)',
    selectPlanet: 'Select Planet:',
    selectGas: 'Select Gas Species:',
    planetTemp: 'Atmospheric Temperature (T)',
    orbitAltitude: 'Orbit Altitude (h)',

    // Toggles
    visualizerToggles: 'Visualizer Options',
    showVectors: 'Velocity & Gravity Vectors',
    showOrbitTrack: 'Conic Orbit Trails',
    showGrid: 'Coordinate Grid',

    // Telemetry
    telemetryTitle: 'Live Orbital Telemetry',
    currentSpeed: 'Launch Speed (v₀)',
    escapeVelocity: 'Escape Velocity (v_e)',
    circularSpeed: 'Circular Velocity (v_c)',
    trajectoryType: 'Conic Section Trajectory',
    vRms: 'Gas Molecule RMS Speed (v_rms)',
    retentionStatus: 'Atmospheric Retention',
    orbitalPeriod: 'Orbital Period (T)',
    keplerRatio: 'Kepler Ratio (T² / r³)',

    // Math Box
    exactMathTitle: 'Mathematical Equations & Proof',
    play: 'Play',
    pause: 'Pause',
    step: 'Step',
    slowMo: '0.25x Slow-Mo',
    reset: 'Reset',
    fullScreen: 'Fullscreen',
    exitFullScreen: 'Exit Fullscreen',
  },
};

export function t(lang: Language, key: keyof typeof translations['bn']): string {
  return translations[lang][key] || translations['bn'][key] || key;
}

export const G_UNIVERSAL = 6.67430e-11;
export const R_GAS = 8.31446; // J / (mol K)

export const PLANETS = {
  earth: { nameBn: 'পৃথিবী (Earth)', nameEn: 'Earth', M: 5.972e24, R: 6371e3, g: 9.81, ve: 11.19, vc: 7.91, defaultTemp: 288, color: '#38bdf8' },
  moon: { nameBn: 'চাঁদ (Moon)', nameEn: 'Moon', M: 7.348e22, R: 1737e3, g: 1.62, ve: 2.38, vc: 1.68, defaultTemp: 250, color: '#94a3b8' },
  mars: { nameBn: 'মঙ্গল (Mars)', nameEn: 'Mars', M: 6.417e23, R: 3390e3, g: 3.71, ve: 5.03, vc: 3.55, defaultTemp: 210, color: '#ef4444' },
  jupiter: { nameBn: 'বৃহস্পতি (Jupiter)', nameEn: 'Jupiter', M: 1.898e27, R: 69911e3, g: 24.79, ve: 59.5, vc: 42.1, defaultTemp: 165, color: '#f59e0b' },
};

export const GASES = {
  H2: { name: 'হাইড্রোজেন (H₂)', molarMass: 0.002016, desc: 'মহাবিশ্বের সবচেয়ে হালকা গ্যাস' },
  He: { name: 'হিলিয়াম (He)', molarMass: 0.004003, desc: 'নিষ্ক্রিয় হালকা গ্যাস' },
  H2O: { name: 'জলীয় বাষ্প (H₂O)', molarMass: 0.018015, desc: 'বায়ুমণ্ডলীয় বাষ্প' },
  N2: { name: 'নাইট্রোজেন (N₂)', molarMass: 0.028013, desc: 'বায়ুমণ্ডলের ৭৮%' },
  O2: { name: 'অক্সিজেন (O₂)', molarMass: 0.031999, desc: 'বায়ুমণ্ডলের ২১%' },
  CO2: { name: 'কার্বন ডাইঅক্সাইড (CO₂)', molarMass: 0.04401, desc: 'ভারী গ্রিনহাউস গ্যাস' },
};

export function fmtNum(val: number, decimals: number = 2): string {
  if (!isFinite(val)) return '0.00';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtSci(val: number, decimals: number = 2): string {
  if (!isFinite(val) || val === 0) return '0.00';
  const exponent = Math.floor(Math.log10(Math.abs(val)));
  const mantissa = val / Math.pow(10, exponent);
  return `${mantissa.toFixed(decimals)} × 10^{${exponent}}`;
}

export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function drawVectorArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  label?: string,
  headLen: number = 10
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);
  const length = Math.hypot(dx, dy);

  if (length < 2) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLen * Math.cos(angle - Math.PI / 6),
    toY - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headLen * Math.cos(angle + Math.PI / 6),
    toY - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  if (label) {
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.fillStyle = color;
    const midX = (fromX + toX) / 2 + Math.cos(angle + Math.PI / 2) * 12;
    const midY = (fromY + toY) / 2 + Math.sin(angle + Math.PI / 2) * 12;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, midX, midY);
  }
  ctx.restore();
}

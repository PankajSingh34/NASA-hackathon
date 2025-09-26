interface AnomalyResult {
  score: number; // 0-1 anomaly intensity
  zScore: number;
  isAnomaly: boolean;
  reason: string;
}

export function detectAnomaly(series: number[]): AnomalyResult {
  if (!series.length) return { score: 0, zScore: 0, isAnomaly: false, reason: 'empty-series' };
  const mean = series.reduce((a,b)=> a + b, 0) / series.length;
  const variance = series.reduce((a,b)=> a + Math.pow(b - mean, 2), 0) / series.length;
  const std = Math.sqrt(variance) || 1;
  const latest = series[series.length - 1];
  const z = (latest - mean) / std;
  const score = Math.min(1, Math.abs(z) / 6);
  return {
    score,
    zScore: z,
    isAnomaly: Math.abs(z) > 2.5,
    reason: Math.abs(z) > 2.5 ? 'z-threshold-exceeded' : 'normal'
  };
}

export type Point = { t: number; v: number };

export type Thresholds = {
  pressureDropHpa: number; // alert when pressure falls at least this much per 3 h
  humidityPct: number;
  multiNodeCheck: boolean;
  minNodesAgree: number;
};

export type NodeInput = {
  nodeId: string;
  online: boolean;
  isRaining: boolean;
  pressure: Point[]; // ascending by time
  humidity: Point[];
  temperature: Point[];
};

export type NodeAssessment = {
  nodeId: string;
  score: number | null; // null = not enough history yet
  raining: boolean;
  pressureDrop3h: number | null; // positive = falling
  humidityRise1h: number | null;
  tempChange3h: number | null;
};

export type RiskLevel = "collecting" | "low" | "moderate" | "high" | "raining";

export type Assessment = {
  level: RiskLevel;
  score: number | null;
  alert: boolean;
  nodesOnline: number;
  nodesAssessed: number;
  nodesFlagged: number;
  nodesRaining: number;
  nodesRequired: number;
  pressureDrop3h: number | null;
  humidityRise1h: number | null;
  tempChange3h: number | null;
  nodes: NodeAssessment[];
};

const MIN = 60_000;
const HOUR = 60 * MIN;

export const ONLINE_WINDOW_MS = 20 * MIN; // node counts as offline after 20 min of silence
export const FLAG_SCORE = 70;
export const MODERATE_SCORE = 40;

function mean(xs: (number | null)[]): number | null {
  const v = xs.filter((x): x is number => x !== null);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}

/** Least-squares slope (units per hour) over the last `windowMs`. */
function slopePerHour(points: Point[], windowMs: number, now: number, minPoints: number, minSpanMs: number): number | null {
  const pts = points.filter((p) => p.t >= now - windowMs);
  if (pts.length < minPoints) return null;
  if (pts[pts.length - 1].t - pts[0].t < minSpanMs) return null;

  const t0 = pts[0].t;
  const xs = pts.map((p) => (p.t - t0) / HOUR);
  const ys = pts.map((p) => p.v);
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;

  let num = 0;
  let den = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  return den === 0 ? null : num / den;
}

export function assessNode(n: NodeInput, th: Thresholds, now: number): NodeAssessment {
  const pSlope = slopePerHour(n.pressure, 3 * HOUR, now, 6, 45 * MIN);
  const hSlope = slopePerHour(n.humidity, HOUR, now, 4, 20 * MIN);
  const tSlope = slopePerHour(n.temperature, 3 * HOUR, now, 6, 45 * MIN);

  const pressureDrop3h = pSlope === null ? null : -pSlope * 3;
  const humidityRise1h = hSlope;
  const tempChange3h = tSlope === null ? null : tSlope * 3;
  const humidity = n.humidity.length ? n.humidity[n.humidity.length - 1].v : null;

  const base = {
    nodeId: n.nodeId,
    raining: n.isRaining,
    pressureDrop3h,
    humidityRise1h,
    tempChange3h,
  };

  // Rain sensor is ground truth
  if (n.isRaining) return { ...base, score: 100 };
  // Pressure trend is the primary signal; without it we can't judge
  if (pressureDrop3h === null) return { ...base, score: null };

  let score = 0;

  if (pressureDrop3h >= th.pressureDropHpa) score += 45;
  else if (pressureDrop3h >= th.pressureDropHpa / 2) score += 20;

  if (humidity !== null) {
    if (humidity >= th.humidityPct) score += 30;
    else if (humidity >= th.humidityPct - 10) score += 15;
  }

  if (humidityRise1h !== null && humidityRise1h >= 5) score += 10;
  if (tempChange3h !== null && tempChange3h <= -1) score += 5;

  return { ...base, score };
}

export function assess(nodes: NodeInput[], th: Thresholds, now = Date.now()): Assessment {
  const online = nodes.filter((n) => n.online);
  const results = online.map((n) => assessNode(n, th, now));
  const assessed = results.filter((r) => r.score !== null);
  const raining = results.filter((r) => r.raining).length;
  const flagged = assessed.filter((r) => (r.score as number) >= FLAG_SCORE).length;

  const required = th.multiNodeCheck ? Math.max(1, Math.min(th.minNodesAgree, assessed.length)) : 1;

  const score = assessed.length > 0 ? Math.round(mean(assessed.map((r) => r.score)) as number) : null;

  let level: RiskLevel;
  if (raining > 0) level = "raining";
  else if (assessed.length === 0) level = "collecting";
  else if (flagged >= required) level = "high";
  else if ((score ?? 0) >= MODERATE_SCORE || flagged > 0) level = "moderate";
  else level = "low";

  return {
    level,
    score,
    alert: level === "high" || level === "raining",
    nodesOnline: online.length,
    nodesAssessed: assessed.length,
    nodesFlagged: flagged,
    nodesRaining: raining,
    nodesRequired: required,
    pressureDrop3h: mean(results.map((r) => r.pressureDrop3h)),
    humidityRise1h: mean(results.map((r) => r.humidityRise1h)),
    tempChange3h: mean(results.map((r) => r.tempChange3h)),
    nodes: results,
  };
}

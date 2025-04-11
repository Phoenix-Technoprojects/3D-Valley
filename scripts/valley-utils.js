// valley-utils.js

// Calculates the readiness quotient with a more nuanced formula
export function calculateReadinessQuotient({ TRL, FRL, MRKL, MRL, ORL }) {
  const techFactor = TRL;
  const financialKnowledge = (FRL + MRKL) / 2;
  const operationalMarket = (MRL + ORL) / 2;

  // Penalty zones for low maturity (Valley of Death trap)
  const penaltyZone =
    (techFactor >= 4 && techFactor <= 6) &&
    (MRL >= 1 && MRL <= 4) &&
    (FRL >= 3 && FRL <= 5);

  // Readiness quotient formula (complexified)
  const quotient =
    (0.5 * techFactor + 0.3 * financialKnowledge + 0.2 * operationalMarket) *
    (penaltyZone ? 0.65 : 1); // 35% penalty in Valley of Death and 80% project efficiency
	
  const inValley = quotient < 5;

  return { quotient , inValley };
}

// Calculates the survival rate based on quotient and complexity (0 to 10)
export function calculateSurvivalRate(quotient, complexity) {
  // Sigmoid-like curve: higher complexity lowers survival
  const baseSurvival = 100 * (1 - 1 / (1 + Math.exp(quotient - 5)));
  const complexityPenalty = 1 - complexity / 20; // max 50% penalty
  const survival = baseSurvival * complexityPenalty;
  return Math.max(0, Math.min(100, Math.round(survival)));
}

// Classify valley status and survival
export function classifyValleyStatus(quotient, complexity) {
  const survival = calculateSurvivalRate(quotient, complexity);
  return {
    status: quotient < 50 ? 'Valley of Death' : 'Safe Zone',
    survivalRate: survival
  };
}

// Compute average metrics for heatmap
export function computeReadinessMetrics(d) {
  return {
    avgFRL_MRKL: (d.FRL + d.MRKL) / 2,
    avgMRL_ORL: (d.MRL + d.ORL) / 2,
    TRL: d.TRL
  };
}


// Color scale for TRL levels (0–9) mapped to gradient
export function getTRLColor(TRL) {
  const colors = [
    '#4B0000', '#7F0000', '#FF0000', '#FF7F00',
	'#FFFF00', '#7FFF7F', '#00FFFF', '#007FFF',
    '#0000FF', '#00007F'
  ];
  return colors[Math.min(Math.max(TRL, 0), 9)];
}

// Color scale for TRL levels (0–9) mapped for heatmap
export function getTRLColor2D(TRL) {
  const colors = [
    '#00007F', '#0000FF', '#007FFF', '#00FFFF',
	'#7FFF7F', '#FFFF00', '#FF7F00', '#FF0000',
	'#7F0000', '#4B0000'
  ];
  return colors[Math.min(Math.max(TRL, 0), 9)];
}

// Helper for rounding to 2 decimal places
export function round(val) {
  return Math.round(val * 100) / 100;
}

// Optional label function for tooltips or legend
export function readinessLabel(quotient) {
  if (quotient < 3) return 'Low Readiness';
  if (quotient < 6) return 'Moderate Readiness';
  return 'High Readiness';
}

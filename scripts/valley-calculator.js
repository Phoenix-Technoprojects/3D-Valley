// valley-calculator.js

import { calculateReadinessQuotient, calculateSurvivalRate } from './valley-utils.js';

// Create input panel
export function createCalculator(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="calculator-card">
      <h2 class="calculator-title">Valley Readiness Calculator</h2>
      <div class="calculator-grid-3x2">
        <div class="calculator-input">
          <label for="trl">TRL Level (0-9)</label>
          <input type="number" id="trl" min="0" max="9">
        </div>
        <div class="calculator-input">
          <label for="frl">FRL Level (0-9)</label>
          <input type="number" id="frl" min="0" max="9">
        </div>
        <div class="calculator-input">
          <label for="mrkl">MRKL Level (0-9)</label>
          <input type="number" id="mrkl" min="0" max="9">
        </div>
        <div class="calculator-input">
          <label for="mrl">MRL Level (0-9)</label>
          <input type="number" id="mrl" min="0" max="9">
        </div>
        <div class="calculator-input">
          <label for="orl">ORL Level (0-9)</label>
          <input type="number" id="orl" min="0" max="9">
        </div>
        <div class="calculator-input">
          <label for="complexity">Project Complexity (0-10)</label>
          <input type="number" id="complexity" min="0" max="10">
        </div>
      </div>
      <div class="calculator-button-wrapper">
        <button id="calculateBtn" class="calculate-btn">Calculate Readiness</button>
      </div>
      <div id="calculatorResult" class="calculator-result"></div>
    </div>
  `;

  document.getElementById('calculateBtn').addEventListener('click', () => {
    const trl = parseInt(document.getElementById('trl').value);
    const frl = parseInt(document.getElementById('frl').value);
    const mrkl = parseInt(document.getElementById('mrkl').value);
    const mrl = parseInt(document.getElementById('mrl').value);
    const orl = parseInt(document.getElementById('orl').value);
    const complexity = parseFloat(document.getElementById('complexity').value);

    if ([trl, frl, mrkl, mrl, orl, complexity].some(v => isNaN(v))) {
      document.getElementById('calculatorResult').innerHTML = '<p>Please enter valid values for all inputs.</p>';
      return;
    }

    const { quotient, inValley } = calculateReadinessQuotient({
      TRL: trl,
      FRL: frl,
      MRKL: mrkl,
      MRL: mrl,
      ORL: orl
    });
    const survival = calculateSurvivalRate(quotient, complexity);

    let statusMessage = '';

    if (quotient < 2.5 && survival < 40) {
      statusMessage = '<span class="valley-critical">Preparation & Infancy Stage</span>';
    } else if (quotient >= 2.5 && quotient <= 5 && survival < 60) {
      statusMessage = '<span class="valley-warning">At Risk: In or Near the Valley of Death</span>';
    } else if (quotient > 5 && quotient < 7.5 && survival < 80) {
      statusMessage = '<span class="valley-transition">Transition Phase — Stabilizing</span>';
    } else {
      statusMessage = '<span class="valley-safe">Final Stage — Likely to Survive</span>';
    }

    const resultHTML = `
      <p><strong>Readiness Quotient:</strong> ${quotient}</p>
      <p><strong>Status:</strong> ${statusMessage}</p>
      <p><strong>Estimated Survival Rate:</strong> ${survival}%</p>
    `;
    document.getElementById('calculatorResult').innerHTML = resultHTML;
  });
}

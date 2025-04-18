// valley-calculator.js

import { calculateReadinessQuotient, calculateSurvivalRate } from './valley-utils.js';

const readinessData = [
  {
    id: "TRL",
    name: "Technology Readiness Level",
    description: "Indicates the maturity of a particular technology.",
    levels: [
      "Basic principles observed",
      "Technology concept formulated",
      "Experimental proof of concept",
      "Technology validated in lab",
      "Technology validated in relevant environment",
      "Technology demonstrated in relevant environment",
      "System prototype demonstration in operational environment",
      "System complete and qualified",
      "Actual system proven in operational environment"
    ]
  },
  {
    id: "MRL",
    name: "Manufacturing Readiness Level",
    description: "Assesses the maturity of manufacturing capabilities.",
    levels: [
      "Basic manufacturing implications identified",
      "Manufacturing concepts identified",
      "Manufacturing proof of concept demonstrated",
      "Capability to produce the technology in a lab",
      "Capability to produce in relevant environment",
      "Capability to produce prototype in pilot environment",
      "Capability to produce at low rate initial production",
      "Capability in place for limited production",
      "Manufacturing processes stable, capable, and in control"
    ]
  },
  {
    id: "SRL",
    name: "System Readiness Level",
    description: "Evaluates the integration and readiness of system components.",
    levels: [
      "System concept identified",
      "Subsystem relationships defined",
      "Basic integration concept developed",
      "Interfaces defined and validated",
      "Subsystems tested in lab",
      "Subsystems tested in relevant environment",
      "System prototype validated",
      "System validated in real-world environment",
      "System operationally ready"
    ]
  },
  {
    id: "PRL",
    name: "People Readiness Level",
    description: "Measures workforce alignment, capability, and readiness.",
    levels: [
      "Skills gap identified",
      "Initial training strategy developed",
      "Awareness and buy-in achieved",
      "Basic training completed",
      "Key teams formed",
      "Workforce engaged",
      "Workforce capable",
      "Leadership and teams aligned",
      "Fully staffed and operational"
    ]
  },
  {
    id: "MRKL",
    name: "Market Readiness Level",
    description: "Indicates how ready the market is for the offering.",
    levels: [
      "Market need hypothesized",
      "Target audience identified",
      "Preliminary demand signals",
      "Market analysis completed",
      "Market segmentation verified",
      "Initial customer engagement",
      "Early adopters onboarded",
      "Established market presence",
      "Strong competitive positioning"
    ]
  },
  {
    id: "ORL",
    name: "Operations Readiness Level",
    description: "Evaluates operational preparedness to scale and support the system.",
    levels: [
      "Ops framework conceptualized",
      "Operational requirements defined",
      "Core team identified",
      "Initial process flow outlined",
      "Tooling and resources scoped",
      "Standard Operating Procedures in place",
      "Initial operations trials",
      "Operational continuity ensured",
      "Fully functioning operations"
    ]
  },
  {
    id: "CRL",
    name: "Customer Readiness Level",
    description: "Assesses customer maturity, engagement, and adoption.",
    levels: [
      "Customer needs observed",
      "Early feedback loop initiated",
      "Personas created",
      "First customer contact",
      "Alpha/beta testing in place",
      "Customer onboarding",
      "User engagement metrics validated",
      "Customer success strategy applied",
      "Customer base matured"
    ]
  },
  {
    id: "FRL",
    name: "Financial Readiness Level",
    description: "Assesses financial robustness, sustainability, and investment readiness.",
    levels: [
      "Cost structure identified",
      "Funding source explored",
      "Basic budget defined",
      "Financial plan drafted",
      "Break-even analysis completed",
      "Initial funding secured",
      "Revenue strategy validated",
      "Financial KPIs tracking",
      "Sustainable growth achieved"
    ]
  }
];

function createDropdown(id, name, levels) {
  let options = levels.map((desc, i) => `<option value="${(i+1)}">${(i+1)} - ${desc}</option>`).join('');
  return `
    <div class="calculator-input">
      <label for="${id}">${name}</label>
      <select id="${id}">${options}</select>
    </div>
  `;
}

export function createCalculator(containerId) {
  const container = document.getElementById(containerId);

  let inputFieldsHTML = readinessData
    .filter(d => ["TRL", "FRL", "MRKL", "MRL", "ORL"].includes(d.id))
    .map(d => createDropdown(d.id.toLowerCase(), d.name, d.levels))
    .join('');

  container.innerHTML = `
    <div class="calculator-card">
      <div class="calculator-grid-3x2">
        ${inputFieldsHTML}
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

    const { quotient, inValley } = calculateReadinessQuotient({ TRL: trl, FRL: frl, MRKL: mrkl, MRL: mrl, ORL: orl });
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

    // Future implementation for lead capture / data submission
    // Example: send results to server via POST
    /*
    fetch('/submit-readiness', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trl, frl, mrkl, mrl, orl, complexity, quotient, survival })
    });
    */
  });
}

// valley-3d.js

import { calculateReadinessQuotient, classifyValleyStatus, getTRLColor } from './valley-utils.js';

export function renderValley3D(containerId, quotientData) {
  const { trl, frl, mrkl, mrl, orl, complexity } = quotientData;
  const readiness = calculateReadinessQuotient(trl, frl, mrkl, mrl, orl);
  const survival = classifyValleyStatus(readiness, complexity);

  const X = [];
  const Y = [];
  const Z = [];

  for (let i = 0; i <= 9; i++) {
    const rowX = [];
    const rowY = [];
    const rowZ = [];
    for (let j = 0; j <= 9; j++) {
      rowX.push(i);
      rowY.push(j);
      const centerX = 5;
	  const centerY = 5;
	  rowZ.push(
	  // Gaussian valley centered at (centerX,centerY)
	  10 * (1 - Math.exp(-((i-centerX)**2 + (j-centerY)**2)/8)));
	  
 // Valley depth: lower TRL = deeper valley
    }
    X.push(rowX);
    Y.push(rowY);
    Z.push(rowZ);
  }

  const surface = {
    type: 'surface',
    x: X,
    y: Y,
    z: Z,
    colorscale: 'Jet',
	reversescale: true,
    showscale: true,
    opacity: 0.3,
  };

  const marker = {
    type: 'scatter3d',
    mode: 'markers+text',
    x: [(frl + mrkl) / 2],
    y: [(mrl + orl) / 2],
    z: [trl],
    marker: {
      size: 8,
      color: getTRLColor(trl),
      symbol: 'circle',
    },
    
	hovertemplate: `
    <b>Your Project</b><br>
    X: %{x}<br>
    Y: %{y}<br>
    Z: %{z}<extra></extra>
  `
  };

  const layout = {
    title: 'Project Readiness (Deeper = Riskier)',
	titlefont: { color: 'white' },
    autosize: true,
    scene: {
      xaxis: { 
	  title: 'Comm. Readiness',
	  titlefont: { color: 'white' },
      tickfont: { color: 'white' },
      gridcolor: 'white',
      zerolinecolor: 'white'
	  },
	  
      yaxis: { 
	  title: 'Ops. Readiness',
	  titlefont: { color: 'white' },
      tickfont: { color: 'white' },
      gridcolor: 'white',
      zerolinecolor: 'white'
	  },
      
	  zaxis: { 
	  title: 'Tech. Readiness',
	  titlefont: { color: 'white' },
      tickfont: { color: 'white' },
      gridcolor: 'white',
      zerolinecolor: 'white'
	  },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.2 }
      },
    },
    margin: { l: 0, r: 0, b: 0, t: 30 },
  };
  layout.paper_bgcolor = 'rgba(0,0,0,0)';
  layout.plot_bgcolor = 'rgba(0,0,0,0)',

  Plotly.newPlot(containerId, [surface, marker], layout);
}

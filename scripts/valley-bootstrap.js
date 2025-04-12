// valley-bootstrap.js
import { createCalculator } from './valley-calculator.js';
import { renderValley3D } from './valley-3d.js';
import { renderHeatmap } from './valley-heatmap.js';

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. 3D Render (initialisation)
  renderValley3D('valley-3d', { trl:5, frl:5, mrkl:5, mrl:5, orl:5, complexity:5 });
  
  // 2. Build the calculator UI
  createCalculator('calculator');

  // 3. Pre-draw the heatmap using your sample scenarios
  /*fetch('./scripts/valley-data.json')
     .then(res => res.json())
     .then(scenarios => renderHeatmap(scenarios, 'valley-heatmap'));*/

  // 4. Listen for calculate button and then render 3D plot
  const btn = document.querySelector('#calculator button');
  btn.addEventListener('click', () => {
    // gather inputs
    const trl = +document.getElementById('trl').value;
    const frl = +document.getElementById('frl').value;
    const mrkl = +document.getElementById('mrkl').value;
    const mrl = +document.getElementById('mrl').value;
    const orl = +document.getElementById('orl').value;
    const complexity = +document.getElementById('complexity').value;

    const inputs = { trl, frl, mrkl, mrl, orl, complexity };
    // render the 3D valley with the new inputs
    renderValley3D('valley-3d', inputs);
  });
});

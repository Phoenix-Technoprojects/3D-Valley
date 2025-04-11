// valley-heatmap.js

import { computeReadinessMetrics, getTRLColor2D } from './valley-utils.js';

export function renderHeatmap(data, containerId = 'heatmap-container') {
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };
  const width = 500 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3.select(`#${containerId}`)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'heatmap-svg')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const cellSize = width / 10;

  // Scales for axes
  const xScale = d3.scaleLinear().domain([0, 9]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, 9]).range([height, 0]);

  // Axes
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(10));

  svg.append('g')
    .call(d3.axisLeft(yScale).ticks(10));

  // Axis labels
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
	.style('fill', '#ffffff') 
    .text('Commercial Readiness');

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -45)
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
	.style('fill', '#ffffff') 
    .text('Operational Readiness');

  const centerX = 5;
  const centerY = 5;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

  function baseTRL(i, j) {
    const dx = i - centerX;
    const dy = j - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return Math.round(9 - (distance / maxDistance) * 9);
  }

  /**function categorizeRegion(trl) {
    if (trl <= 2) return 'Initialisation Zone';
    else if (trl > 2 && trl < 4) return 'Transition Corridor';
    else if (trl >= 4 && trl <= 6) return 'Valley of Death';
	else if (trl > 6 && trl < 8) return 'Survival Ridge';
    else if (trl >= 8) return 'Launch-Ready Zone';
  }*/

  // Generate 10x10 heatmap grid using concentric TRL values
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const trl = baseTRL(i, j);
      //const region = categorizeRegion(trl);

      svg.append('rect')
        .attr('x', xScale(i))
        .attr('y', yScale(j + 1))
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('fill', getTRLColor2D(trl))
        .attr('stroke', '#222')
        .attr('stroke-width', 0.25)
        //.append('title')
        //.text(`TRL: ${trl} (${region})`);
    }
  }

  // Overlay cells from data
  data.forEach(d => {
    const metrics = computeReadinessMetrics(d);
    const x = Math.floor(metrics.avgFRL_MRKL);
    const y = Math.floor(metrics.avgMRL_ORL);

    svg.append('rect')
      .attr('x', xScale(x))
      .attr('y', yScale(y + 1))
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', getTRLColor2D(d.TRL))
      .attr('stroke', '#222')
      .attr('stroke-width', 0.5)
      .append('title')
      .text(`TRL: ${d.TRL}, Complexity: ${d.Complexity}`);
  });
}

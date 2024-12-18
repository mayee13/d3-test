import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { dijkstra } from '../algorithm/dijkstra';

const visuaizeDijkstra = () => {
    // construct simple, still graph, with artifical data
    const svgRef = useRef();

    useEffect(() => {
        const data = {
            nodes: [
              { id: 'A' },
              { id: 'B' },
              { id: 'C' },
            ],
            links: [
              { source: 'A', target: 'B', weight: 1 },
              { source: 'A', target: 'C', weight: 3 },
              { source: 'B', target: 'C', weight: 1 },
            ],
          };

          const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Define arrow marker
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 14)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#7f8c8d');

    const simulation = d3
      .forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id((d) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links (edges)
    const link = svg
      .selectAll('.link')
      .data(data.links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#7f8c8d')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');

    // Create node elements (nodes)
    const node = svg
      .selectAll('.node')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .attr('fill', 'steelblue')
      .call(
        d3
          .drag()
          .on('start', dragStart)
          .on('drag', drag)
          .on('end', dragEnd)
      );

    // Add labels to the nodes
    svg
      .selectAll('.label')
      .data(data.nodes)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', 12)
      .attr('y', 4)
      .text((d) => d.id);

    // Update the positions of the links and nodes
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });

    // Drag event functions
    function dragStart(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function drag(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnd(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    }, []); 

    // create button and handler functiosn to run dijkstra's (+ reset button)

    // 
    return <div>
        <svg ref={svgRef}></svg>
        
        </div>;
}
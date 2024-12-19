// src/NetworkGraph.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { dijkstra } from '../algorithm/dijkstra';

const NetworkGraph = ({data, onSaveClick, onBackClick}) => {
  const svgRef = useRef();

  // constants for creating graph 
  const [numNodes, setNumNodes] = useState(data.nodes.length); 
  const [links, setLinks] = useState(data.links); 
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newWeight, setNewWeight] = useState(0); 

  // constants for visualization 
  const [visited, setVisited] = useState([]); 
  const [path, setPath] = useState([]); 
  const [current, setCurrent] = useState(null); 
  const [dijkstraStart, setDijkstraStart] = useState("A"); 
  const [dijkstraEnd, setDijkstraEnd] = useState("A")
  const [running, setRunning] = useState(false); 

  // console.log(numNodes); 
  const handleNumNodeChange = (event) => {
    setNumNodes(event.target.value); 
    setLinks([])
  }

  const handleStartChange = (event) => {
    // console.log("changing start to...")
    // console.log(event.target.value)
    setNewStart(event.target.value); 
  }

  const handleEndChange = (event) => {
    // console.log("changing end to...")
    // console.log(event.target.value)
    setNewEnd(event.target.value); 
  }

  const handleLinksChange = (event) => {
    // console.log("adding link between...")
    // console.log(newStart)
    // console.log(newEnd)
    if (newStart !== "Select a node" && newEnd !== "Select a node") {
        addNewLink(newStart, newEnd); 
    }
  }

  const addNewLink = (startNode, endNode) => {
    // console.log("adding new link...")
    // console.log(startNode)
    // console.log(endNode)
    const updatedLinks = [...links, { source: startNode, target: endNode, weight: newWeight }];
    setLinks(updatedLinks); 
  }

  const handleClearEdges = (event) => {
    setLinks([]);
  }

  const handleNewWeight = (event) => {
    setNewWeight(event.target.value); 
  }

  const handleDijkstraStart = (event) => {
    setDijkstraStart(event.target.value);
  }

  const handleDijkstraEnd = (event) => {
    setDijkstraEnd(event.target.value); 
  }

  const handleDijkstra = async (event) => {
    setRunning(true); 
    const path = await dijkstra(links, dijkstraStart, dijkstraEnd, (updatedVisited, updatedCurrent) => {
        setVisited(updatedVisited);
        setCurrent(updatedCurrent); 
    }); 
    console.log("handeling dijkstras...")
    // console.log(path)
    const pathLinks = [];
    for (const link of path.steps) {
        pathLinks.push({start: link.source, end: link.target}); 
    }
    // console.log("pathsLinks..."); 
    // console.log(pathLinks);
    setPath(pathLinks); 
  }

  const handleReset = () => {
    setRunning(false); 
    setVisited([]);
    setPath([]);
    setCurrent(null); 
  }

  const handleSaveClick = () => {
    const nodes = []; 

    if (numNodes <= 26) {
        for (let i = 0; i < numNodes; i++) {
            nodes.push({id: String.fromCharCode(65 + i)});
        }
    }
    onSaveClick({nodes: nodes, links: links}); 
  }

  useEffect(() => {
    // console.log("current links...")
    // console.log(links)
    console.log("network graph visited...")
    console.log(visited)
    console.log("network graph current...")
    console.log(current)
    const width = 600;
    const height = 400;

    const nodes = []; 

    if (numNodes <= 26) {
        for (let i = 0; i < numNodes; i++) {
            nodes.push({id: String.fromCharCode(65 + i)});
        }
    }
    

    const currLinks = []; 
    for (const element of links) {
        currLinks.push({source: element.source, target: element.target, weight: element.weight})
    }

    // Initialize canvas to hold the graph
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll("*").remove();

    // Define arrow marker
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 25)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#7f8c8d');

    const simulation = d3
      .forceSimulation(nodes)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody())
      .force(
        'link',
        d3.forceLink(currLinks).id((d) => d.id).distance(100)
      )
      .on('tick', ticked);

    const linkSelection = svg
      .selectAll('.link')
      .data(currLinks)
      .enter()
      .append('line')
      .attr('class', 'link')
      // .attr('stroke', (d) => matches(path, d) ? 'green' : 'black') // check current path
      .attr('stroke-width', 1) 
      .attr('marker-end', 'url(#arrow)');

    // linkSelection.attr('fill', (d) => {
    //     if (matches(path, d)) return 'green';
    //     return 'black'; 
    // })

    const nodeSelection = svg
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 10)
      // .attr('fill', (d) => visited.includes(d.id) ? 'orange' : 'steelblue')
      // .attr('stroke', (d) => path.includes(d.id) ? 'green' : 'none')
      .call(
        d3
          .drag()
          .on('start', dragStart)
          .on('drag', drag)
          .on('end', dragEnd)
      );

    //   nodeSelection.attr('fill', (d) => {
    //     if (d.id === current) return 'red'; 
    //     if (path.includes(d.id)) return 'green';  // Shortest path nodes
    //     if (visited.includes(d.id)) return 'orange';  // Visited nodes
    //     return 'steelblue';  // Default
    //   });

      const labelSelection = svg
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text((d) => d.id) // Display the node ID
      .attr('font-size', 10)
      .attr('fill', "white")
      .attr('text-anchor', 'middle') // Center-align the text horizontally
      .attr('dy', 4); // Position the text slightly above the circle

      const linkLabels = svg
        .selectAll('.link-label')
        .data(currLinks)
        .enter()
        .append('text')
        .attr('class', 'link-label')
        .text((d) => d.weight) // Show the weight as text
        .attr('font-size', 12)
        .attr('fill', 'black');

    function ticked() {
      nodeSelection
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);

      linkSelection
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

    labelSelection
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y); // Align the text exactly with the node center
    linkLabels
        .attr('x', (d) => (d.source.x + d.target.x) / 2 + 2)
        .attr('y', (d) => (d.source.y + d.target.y) / 2 + 2);
    }

    function dragStart(event, d) {
        // console.log('drag start');
      simulation.alphaTarget(0.5).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function drag(event, d) {
        // console.log('dragging');
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnd(event, d) {
        // console.log('drag end');
      simulation.alphaTarget(0.1);
      d.fx = null;
      d.fy = null;
    }
    
  }, [numNodes, links]);

  useEffect(() => {
    // Update node and link colors only when visited, path, or current changes
    const svg = d3.select(svgRef.current);

    svg
    .selectAll('circle')
    .attr('fill', d =>
      d.id === current
        ? 'red'
        : visited.includes(d.id)
        ? 'orange'
        : 'steelblue'
    );

  svg
    .selectAll('.link')
    .attr('stroke', d =>
      matches(path, d)
        ? 'green'
        : 'black'
    )
    .attr('stroke-width', d =>
    matches(path, d)
      ? 2
      : 1);

     function matches(path, link) {
        // console.log('matches...')
        // console.log(link)
        for (const step of path) {
            // console.log(step)
            if (step.start === link.source.id && step.end === link.target.id) {
                return true; 
            }
        }
        return false; 
    }
  }, [numNodes, links, visited, path, current]); 

 
const elements = []; 
elements.push(<option key = {-1}>Select a node</option>)
if (numNodes <= 26) {
    for (let i = 0; i < numNodes; i++) {
        const value = String.fromCharCode(65 + i); 
        elements.push(<option key = {value}>{value}</option>);
    }
}

  return (
    <div>
        <div><span>Select number of nodes: </span><input type = "number" value = {numNodes} onChange={handleNumNodeChange} max="26" 
  min="1"></input></div>
        <div><span>Add start of new edge: </span><select value = {newStart} onChange={handleStartChange}>{elements}</select></div>
        <div><span>Add end of new edge: </span><select value = {newEnd} onChange={handleEndChange}>{elements}</select></div>
        <div><span>Add weight of new edge: </span><input type = "number" value = {newWeight} onChange={handleNewWeight}></input></div>
        <div><button onClick = {handleLinksChange}> Add New Edge </button> <button onClick = {handleClearEdges}>Clear Edges</button></div>
        <div><span>Add start node: </span><select value = {dijkstraStart} onChange={handleDijkstraStart}>{elements}</select></div>
        <div><span>Add end node: </span><select value = {dijkstraEnd} onChange={handleDijkstraEnd}>{elements}</select></div>
        <div><button onClick = {handleDijkstra}> Run Dijkstra's </button><button onClick = {handleReset}>Reset</button></div>
        <div><button onClick={handleSaveClick}>Save</button></div>
        <div><button onClick={onBackClick}>Back</button></div>
        <div>
            <svg ref={svgRef}></svg>
        </div>
    </div>
    
  );
};

export default NetworkGraph;

import { Heap } from "./heap";

export const dijkstra = (links, startNode, endNode) => {
    const nodeMap = new Map(); 

    for (const link of links) {
        if (nodeMap.has(link.source)) {
            nodeMap.get(link.source).push(link); 
        } else { 
            nodeMap.set(link.source, [link]); 
        }
    }

    const visited = new Set(); // set of visited endNodes 
    
    const active = new Heap(comparePaths);
    const startPath = {start: startNode, end: startNode, steps: [], weight: 0}
    active.add(startPath); 

    while (!active.isEmpty()) {
        const minPath = active.remove(); 
        if (minPath.start === startNode && minPath.end === endNode) {
            return minPath;  
        } 

        if (visited.has(minPath.end)) {
            continue; 
        }

        visited.add(minPath.end);
        for (const link of nodeMap.get(minPath.end)) {
            if (!visited.has(link.target)) {
                const newPath = {
                    start: startNode, 
                    end: link.target, 
                    steps: minPath.steps.concat([link]), 
                    weight: minPath.weight + link.weight
                }
                active.add(newPath); 
            }
        }

    }
    return undefined; 
}

const comparePaths = (pathA, pathB) => {
    return pathA.weight - pathB.weight; 
}
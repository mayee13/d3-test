import { Heap } from "./heap";

// function runDijkstra (active, visited, setVisited, setCurrent, nodeMap, startNode, endNode, resolve) {
//     if (active.isEmpty()) {
//         resolve();
//         return; 
//     }
// }

export const dijkstra = async (links, startNode, endNode, updateVisual) => {
    console.log("inside dijkstras...")
    const nodeMap = new Map(); 

    for (const link of links) {
        if (nodeMap.has(link.source)) {
            nodeMap.get(link.source).push(link); 
        } else { 
            nodeMap.set(link.source, [link]); 
        }
    }

    // console.log("nodemap")
    // console.log(nodeMap); 

    const visited = new Set(); // set of visited endNodes 
    
    const active = new Heap(comparePaths);
    const startPath = {start: startNode, end: startNode, steps: [], weight: 0}
    active.add(startPath); 

    while (!active.isEmpty()) {
        const minPath = active.remove();
        console.log("dijkstra visited")
        console.log(visited)
        console.log("dijkstra current")
        console.log(minPath.end)
        
        await new Promise((resolve) => {
            setTimeout(() => {
                // setVisited([...visited]); // set visited nodes to current set
                // setCurrent(minPath.end); // set currentNode beign processed to current end of path
                updateVisual([...visited], minPath.end)
                resolve(); 
            }, 1000)
        });

        // console.log("while loop...")
        // console.log(minPath) 
        if (minPath.start === startNode && minPath.end === endNode) {
            visited.add(minPath.end);
            // console.log("dijkstra visited")
            // console.log(visited)
            // console.log("dijkstra current")
            // console.log(minPath.end)
            // updateVisual([...visited], minPath.end)
            return minPath;  
        } 

        if (visited.has(minPath.end)) {
            continue; 
        }

        visited.add(minPath.end);
        
        if (!nodeMap.has(minPath.end)) {
            continue; 
        }
        for (const link of nodeMap.get(minPath.end)) {
            if (!visited.has(link.target)) {
                const newPath = {
                    start: startNode, 
                    end: link.target, 
                    steps: minPath.steps.concat([link]), 
                    weight: minPath.weight + parseInt(link.weight)
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
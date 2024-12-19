import React, { useState, useEffect } from 'react';
// import BarChart from './components/BarChart';
import NetworkGraph from './components/NetWorkGraph';
// import DirectedGraph from './components/DirectedGraph';

const App = () => {
    const [graphs, setGraphs] = useState([]);
    const [currentGraph, setCurrentGraph] = useState({ nodes: ["A"], links: [] });
    const [graphName, setGraphName] = useState("");
    const [pageState, setPageState] = useState(1);

    // Fetch saved graphs on component mount
    useEffect(() => {
        fetchSavedGraphs();
    }, []);


    const saveGraph = async (graph) => {
        console.log("saving graph...")
        if (!graphName) {
            alert("Please enter a name for your graph.");
            return;
          }
          try {
            const response = await fetch("http://127.0.0.1:5000/save-graph", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: graphName,
                nodes: graph.nodes,
                links: graph.links,
              }),
            });
      
            const data = await response.json();
            if (data.message === "Graph saved or updated successfully!") {
              console.log(data.message)
              alert(data.message);
              fetchSavedGraphs(); // Refresh the list of saved graphs
            }
          } catch (error) {
            console.error("Error saving graph:", error);
          }
    }

    // TODO: Fetch saved graphs on component mount
    const fetchSavedGraphs = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/saved-graphs");
            const data = await response.json();
            setGraphs(data);
          } catch (error) {
            console.error("Error fetching saved graphs:", error);
          }
    }

    const fetchGraphByName = async (name) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/graph/${name}`);
            const data = await response.json();
            if (!data.error) {
              setCurrentGraph(data);
              setGraphName(data.name);
              setPageState(2); 
            } else {
              console.error(data.error);
            }
          } catch (error) {
            console.error("Error fetching graph:", error);
          }
    }
    
    const doCreate = () => {
        if (!graphName) {
            alert("Please enter a name for your graph.");
            return;
        }
        setPageState(2); 
    }

    const doBackClick = () => {
        setPageState(1); 
        setCurrentGraph({ nodes: [], links: [] })
        setGraphName("")
    }

    if (pageState === 1) {
        return (<div>
            <h2>Saved Graphs</h2>
        <ul>
          {graphs.map((graph) => (
            <li key={graph.name}>
              <button onClick={() => fetchGraphByName(graph.name)}>
                {graph.name}
              </button>
            </li>
          ))}
        </ul>
        <input type="text" value={graphName} onChange={(e) => setGraphName(e.target.value)}></input>
        <button onClick={doCreate}>Create</button>
        </div>)
    }
    return (
        <div style={{ padding: '20px' }}>
            <h1>Testing Network Graphs</h1>
            <NetworkGraph data = {currentGraph} onSaveClick={saveGraph} onBackClick={doBackClick}/>
        </div>
    );
};

export default App;
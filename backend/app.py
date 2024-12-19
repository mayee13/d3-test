from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json

app = Flask(__name__)
CORS(app)

# Create SQLite database and table
def init_db():
    conn = sqlite3.connect('graphs.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS graphs (
            name TEXT PRIMARY KEY,
            nodes TEXT,
            links TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Route to save a graph
@app.route('/save-graph', methods=['POST'])
def save_graph():
    data = request.json
    name = data['name']
    nodes = json.dumps(data['nodes'])  # Serialize nodes as JSON string
    links = json.dumps(data['links'])  # Serialize links as JSON string
    conn = sqlite3.connect('graphs.db')
    cursor = conn.cursor()
    # Check if graph with the same name already exists
    cursor.execute('SELECT * FROM graphs WHERE name = ?', (name,))
    existing_graph = cursor.fetchone()

    if existing_graph:
        # If graph exists, replace it (UPDATE)
        cursor.execute('''
            UPDATE graphs
            SET nodes = ?, links = ?
            WHERE name = ?
        ''', (nodes, links, name))
    else:
        # If graph does not exist, insert a new record (INSERT)
        cursor.execute('''
            INSERT INTO graphs (name, nodes, links)
            VALUES (?, ?, ?)
        ''', (name, nodes, links))

    conn.commit()
    conn.close()
    return jsonify({'message': 'Graph saved or updated successfully!'})

# Route to retrieve all saved graphs (ID and number of nodes)
@app.route('/saved-graphs', methods=['GET'])
def get_saved_graphs():
    conn = sqlite3.connect('graphs.db')
    cursor = conn.cursor()
    cursor.execute('SELECT name, nodes FROM graphs')
    graphs = [{'name': row[0], 'nodes': row[1]} for row in cursor.fetchall()]
    conn.close()
    return jsonify(graphs)

# Route to retrieve details of a specific graph by its name
@app.route('/graph/<name>', methods=['GET'])
def get_graph(name):
    conn = sqlite3.connect('graphs.db')
    cursor = conn.cursor()
    cursor.execute('SELECT name, nodes, links FROM graphs WHERE name = ?', (name,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return jsonify({
            'name': row[0],
            'nodes': json.loads(row[1]),  # Deserialize nodes
            'links': json.loads(row[2])  # Deserialize links
        })
    else:
        return jsonify({'error': f'Graph "{name}" not found'}), 404

if __name__ == '__main__':
    init_db()
    app.run(debug=True)


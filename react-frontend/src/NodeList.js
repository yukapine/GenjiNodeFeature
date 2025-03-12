import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./NodeList.css"

const NodeList = () => {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNodes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/nodes');
            console.log(response.data);
            setNodes(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch nodes');
            console.error('Error fetching nodes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNodes();
    }, []);

    if (error) {
        return (
            <div className="p-4 border rounded bg-red-100 text-red-700">
                {error}
            </div>
        );
    }

    return (
        <div className="mt-4 p-4 border rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Database Nodes</h2>
                <button 
                    onClick={fetchNodes}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Refresh
                </button>
            </div>
            
            {loading ? (
                <div className="text-center p-4">Loading...</div>
            ) : nodes.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                    No nodes found in the database
                </div>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2 bg-gray-100 text-left">Index</th>
                            <th className="border p-2 bg-gray-100 text-left">ID</th>
                            <th className="border p-2 bg-gray-100 text-left">Chapter Name</th>
                            <th className="border p-2 bg-gray-100 text-left">Kanji</th>
                            <th className="border p-2 bg-gray-100 text-left">Translation</th>
                            <th className="border p-2 bg-gray-100 text-left">Chapter Number</th>
                            <th className="border p-2 bg-gray-100 text-left">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nodes.map((node, index) => (
                            <tr key={index}>
                                <td className="border p-2">{index}</td>
                                <td className="border p-2">{node.id}</td>
                                <td className="border p-2">{node.chapter_name}</td>
                                <td className="border p-2">{node.kanji}</td>
                                <td className="border p-2">{node.translation}</td>
                                
                                <td className="border p-2">{node.chapter_number}</td>
                                <td className="border p-2">{node.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default NodeList;
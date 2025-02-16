import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DatabaseStatus = () => {
    const [dbInfo, setDbInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDatabaseInfo = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/database-info');
            setDbInfo(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch database information');
            console.error('Error fetching database info:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDatabaseInfo();
        const interval = setInterval(fetchDatabaseInfo, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
            <h2 className="text-lg font-semibold mb-2">Database Connection</h2>
            {loading ? (
                <p className="text-gray-600">Checking database connection...</p>
            ) : error ? (
                <div className="text-red-600">
                    {error}
                </div>
            ) : dbInfo ? (
                <div>
                    <p className="text-green-600 font-medium mb-1">✓ Connected to Neo4j</p>
                    <div className="text-sm text-gray-600">
                        <p>Database: {dbInfo.name}</p>
                        <p>URL: {dbInfo.url}</p>
                    </div>
                </div>
            ) : (
                <p className="text-red-600">Not connected to database</p>
            )}
        </div>
    );
};

export default DatabaseStatus;
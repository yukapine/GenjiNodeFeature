const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const neo4j = require("neo4j-driver");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length) {
        console.log('Request body:', req.body);
    }
    next();
});

// Driver to connect to database

const driver = neo4j.driver(
    "neo4j://localhost:7687",
    neo4j.auth.basic("neo4j", "password")
);
const session = driver.session({ database: 'neo4j' });

const testConnection = async () => {
    const session = driver.session();
    try {
        const result = await session.run('RETURN 1 as num');
        console.log('Neo4j connection successful. Result:', result.records[0].get('num'));
        const testResult = await session.run(
            'CREATE (n:Test {name: "test"}) RETURN n'
        );
        console.log('Test node creation result:', testResult.records[0].get('n'));
    } catch (error) {
        console.error('Neo4j connection failed:', error);
        throw error;
    } finally {
        await session.close();
    }
};

app.post("/add-node", async (req, res) => {
    console.log("Received add-node request");
    const { name, type } = req.body;

    if (!name || !type) {
        console.log("Missing fields");
        return res.status(400).json({ message: "Name and type are required" });
    }

    const session = driver.session();

    try {
        const result = await session.run(
            "CREATE (n:Test {name: $name, type: $type}) RETURN n",
            { name, type }
        );
        const createdNode = result.records[0].get('n');
        console.log("Node created successfully:", createdNode);
        res.status(200).json({ 
            message: "Node added successfully!",
            node: createdNode
        });
    } catch (error) {
        console.error("Error creating node:", error.message, error.stack);
        res.status(500).json({ message: "Error adding node", error: error.message });
    } finally {
        await session.close();
    }
});

app.get("/nodes", async (req, res) => {
    const session = driver.session({ database: 'neo4j' }); 
    //const session = driver.session();
    try {
        const result = await session.run("MATCH (n:Chapter) RETURN n LIMIT 10");
        const nodes = result.records.map(record => record.get('n').properties);
        res.json(nodes);
    } catch (error) {
        console.error("Error fetching nodes:", error);
        res.status(500).json({ message: "Error fetching nodes" });
    } finally {
        await session.close();
    }
});

app.get("/database-info", async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.run("CALL db.info()");
        const dbInfo = {
            name: result.records[0].get('name'),
            //version: result.records[0].get('version'),
            url: "neo4j://localhost:7687"
        };
        res.json(dbInfo);
    } catch (error) {
        console.error("Error fetching database info:", error);
        try {
            await session.run("RETURN 1");
            res.json({
                name: "neo4j",  
                //version: "Unknown",
                url: "neo4j://localhost:7687"
            });
        } catch (fallbackError) {
            res.status(500).json({ 
                message: "Error connecting to database",
                error: error.message 
            });
        }
    } finally {
        await session.close();
    }
});

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

const PORT = 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await testConnection();
});
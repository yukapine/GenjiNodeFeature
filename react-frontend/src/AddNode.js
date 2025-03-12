import { useState } from "react";
import axios from "axios";
import "./AddNode.css";

const AddNode = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [id, setID] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting data:', { id, name, type });  
    try {
        const response = await axios.post("http://localhost:5000/add-node", { id, name, type });
        console.log('Response:', response);  
        alert(response.data.message);
        setID("");
        setName("");
        setType("");
    } catch (error) {
        console.error('Error details:', error); 
        alert("Error adding node");
    }
};

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow">
      <input
        type="text"
        placeholder="Node ID"
        value={id}
        onChange={(e) => setID(e.target.value)}
        className="block mb-2 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Node Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block mb-2 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Node Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="block mb-2 p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Node
      </button>
    </form>
  );
};

export default AddNode;
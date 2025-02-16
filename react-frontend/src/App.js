import React from "react";
import AddNode from "./AddNode";
import NodeList from './NodeList';
import DatabaseStatus from './DatabaseStatus';

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
       <div className="container mx-auto p-4">
          <DatabaseStatus />
          <AddNode />
          <NodeList />
      </div>
    </div>
  );
};

export default App;
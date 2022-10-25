import React from "react";
import FilterOptions from "./FilterOptions";
import BookData from "./Data.json";
import "./App.css"
function App() {
  return (
    <div className="App">
      <FilterOptions placeholder="Search...." data={BookData}/>
    </div> 
  );
}

export default App;
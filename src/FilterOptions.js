import React, {useState} from "react";
import "./FilterOptions.css";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';


function FilterOptions({ placeholder, data }) {
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");
  
    const handleFilter = (event) => {
      const searchWord = event.target.value;
      setWordEntered(searchWord);
      const newFilter = data.filter((value) => {
        return value.title.toLowerCase().includes(searchWord.toLowerCase());
      });
  
      if (searchWord === "") {
        setFilteredData([]);
      } else {
        setFilteredData(newFilter);
      }
    };
  
    const clearInput = () => {
      setFilteredData([]);
      setWordEntered("");
    };

    return(
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className="searchIcon">
          {filteredData.length === 0 ? (
            <SearchIcon />
          ) : (
            <CloseIcon id="clearBtn" onClick={clearInput} />
          )}
        </div>
      </div>
      {filteredData.length !== 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <a className="dataItem" key={value.title} href={value.link} target="_blank" rel="noreferrer">
                <p>{value.title} </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
    );
}

export default FilterOptions;
//handleclick(){
    //     console.log("sdsd");
    //     let l = document.getElementById("list");
    //     l.classList.toggle("open");
    // }
    //     render(){
    //         return(
    //         <div>
    //             <div className="nav" style={{backgroundColor: '#333' , overflow:'hidden'}}>
    //                 <div 
    //                     style={{
    //                     float: 'left',
    //                     color: '#f2f2f2',
    //                     textAlign: 'center',
    //                     padding: '14px 16px',
    //                     backgroundColor: '#333', 
    //                     overflow:'hidden'}}>
    //                     Group 30 Project
    //                 </div>
    //             </div>
    //             <div className="search" style={{background: '#fff', width: '90%', 
    //                                          maxWidth: '800px', display: 'flex', padding: '2px', 
    //                                          borderRadius: '4px' }}>
    //                 <div id="select" onClick={this.handleclick} style={{background: '#160053', width: '300px', alignItems: 'center',
    //                                          justifyContent: 'space-between', display: 'flex', padding: '25px 20px', 
    //                                          color: '#fff', cursor: 'pointer', position: 'relative', borderRadius: '4px'}}>
    //                     <p>All Categories</p>
    //                     <ul id="list" style={{ position: 'absolute', top: '120%', left: '0', listStyle: 'none', background: '#fff', 
    //                                  color: '#555', width: '100%', borderRadius: '4px', maxheight: '0', overflow: 'hidden',
    //                                  transition: 'max-height 0.5s'}}>
    //                         <li style={{ padding: '10px 20px', cursor: 'pointer'}}>All Categories</li>
    //                         <li style={{ padding: '10px 20px', cursor: 'pointer'}}>Healthcare Professionals</li>
    //                         <li style={{ padding: '10px 20px', cursor: 'pointer'}}>Organizations</li>
    //                     </ul>
    //                 </div>
    //                 <input type="text" placeholder="Search..." style={{ padding: '10px 25px', width: '100%', border: 'none', outline: 'none',
    //                    fontSize:'18px'}}></input>
    //             </div>
    //             </div>
    //         );
    //     }

           
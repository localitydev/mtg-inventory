import './App.css';
import { useState } from 'react';

// Custom Components
import CardThumbnail from "./Components/CardThumbnail";

const mtg = require('mtgsdk');

function App() {

    const [searchText, setSearchText]     = useState("");         // Inputted Card name
    const [searchResults, setSearchResults] = useState([]);

    // Run when input is changed
    const onInputText = function(e){
        console.log(e.target.value);

        // Set the searchText to what is typed.
        setSearchText(e.target.value);
    };


    // Queuing the MTG Database
    const searchForCard = function(e){
        console.log("Searching for the card:", searchText);
        e.preventDefault();

        setSearchResults([]);

        mtg.card.where({name: searchText}).then(cards => setSearchResults(cards));
    };

    return (
        <div className="App">
            
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <span className="navbar-brand mb-0 h1">MTG Inventory</span>
            </nav>

            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>Search for card</h1>

                        <form className="form-inline" onSubmit={searchForCard}>
                            <div className="form-group mb-2">
                                <label htmlFor="cardName">Card Name</label>
                                <input type="text" className="form-control" onChange={(e) => {onInputText(e)}} id="cardName" />
                            </div>
                            <button type="submit" className="btn btn-primary mb-2">Search</button>
                        </form>
                    </div>
                </div>

                <div className="row">
                {
                    searchResults.map( (card, index) => {

                        return(
                            <div className="col-3" key={index} style={{paddingBottom: 20+'px'}}>
                                <CardThumbnail card={card}/>
                            </div>
                        )                                
                    } )
                }
                </div>
            </div>

        </div>
    );
}

export default App;

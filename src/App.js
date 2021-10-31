import './App.css';
import { useState } from 'react';

// Custom Components
import Card from './Components/Card';

// AirTable Setup
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_APIKEY }).base( process.env.REACT_APP_AIRTABLE_BASE );



const mtg = require('mtgsdk');

function App() {

    const [searchText, setSearchText] = useState("");           // Inputted Card name
    const [setText, setSetText] = useState("");                 // Inputted Set name
    const [searchResults, setSearchResults] = useState([]);     // Search Results Array/Container

// Application Listeners
    // Card Name
    const onInputText = function(e){
        console.log(e.target.value);

        // Set the searchText to what is typed.
        setSearchText(e.target.value);
    };

    // Set Nem
    const onSetText = function(e){
        console.log("MTG Set:", e.target.value);
        setSetText(e.target.value);
    };

// Application Functions
    // Search MTG API for card name in given set
    const searchForCard = function(e){
        console.log(`Searching for ${searchText} in the set ${setText}`);
        e.preventDefault();

        setSearchResults([]);   // Resets the list so cards can be remounted.

        // MTG SDK Search MTG `where` parameters equal values.
        mtg.card.where({
            name: searchText,
            setName: setText
        }).then(cards => {
            console.log("Search Results:", cards);
            setSearchResults(cards);
            return cards;
        }).catch((err) => {console.log(err); return err;});
    };

    return (
        <div className="App">
            
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <span className="navbar-brand mb-0 h1">MTG Inventory</span>
            </nav>

            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className="mb-3 mt-5">Search for card</h1>
                    </div>
                </div>

                <form className="row" onSubmit={searchForCard}>
                    <div className="col-8">
                        <div className="form-group mb-2 row">
                            <div className="col-2 text-right">
                                <label htmlFor="cardName">Card Name</label>
                            </div>
                            <div className="col-6">
                                <input type="text" className="form-control" onChange={(e) => {onInputText(e)}} id="cardName" />
                            </div>
                        </div>

                        <div className="form-group mb-2 row">
                            <div className="col-2 text-right">
                                <label htmlFor="cardName">Set Name</label>
                            </div>

                            <div className="col-6">
                                <input type="text" className="form-control" onChange={(e) => {onSetText(e)}} id="setName" />
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <button type="submit" className="pr-5 pl-5 btn btn-primary mb-2">Search</button>
                    </div>

                </form>

                <hr />
            </div>

            <div className="container">
                <div className="row">
                {
                    searchResults.map( (card, index) => {
                        if(card.imageUrl){
                            return(
                                <div className="col-4" key={index} style={{paddingBottom: 20+'px'}}>
                                    <Card card={card} />
                                </div>
                            )
                        }else{
                            return(null);
                        }
                                                        
                    } )
                }
                </div>
            </div>

        </div>
    );
}

export default App;
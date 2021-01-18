import './App.css';
import { useState } from 'react';

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

        var results = [];
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

                        {/* SET CARD IMAGE TO A GIVEN CARD URL. IF THERE IS NO IMAGE, SET IMAGE TO DEFAULT BACK */}
                        var cardImage;
                        if(card.imageUrl){
                            cardImage = <img className="img-fluid" src={card.imageUrl} className="card-img-top" alt="" />
                        }else{
                            cardImage = <img className="img-fluid" src="https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=0&type=card" className="card-img-top" alt="" />
                        }

                        {/* Get title for SET name */}
                        const [setName, setSetName] = useState("not available");
                        mtg.set.find(card.set)
                        .then(result => {
                            setSetName(result.set.name);
                        })

                        console.log("The card:", card);
                        
                        return(
                            <div className="col-3" key={index} style={{paddingBottom: 20+'px'}}>
                                <div className="card">
                                    {cardImage}
                                    <div className="card-body">
                                        <h5 className="card-title">{card.name}</h5>
                                        {/* <p className="card-text">{card.originalText}</p> */}
                                        <a href="#" className="btn btn-primary">Go somewhere</a>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Rarity: {card.rarity}</li>
                                        <li className="list-group-item">Set: {setName}</li>
                                        <li className="list-group-item">Artist: {card.artist}</li>
                                    </ul>
                                </div>
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

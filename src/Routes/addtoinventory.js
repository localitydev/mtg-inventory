import React from "react";
import { useState, useEffect } from "react";

// Custom Components
import Card from '../Components/Card';

const mtg = require('mtgsdk');      // MTG SDK

var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_APIKEY }).base( process.env.REACT_APP_AIRTABLE_BASE );

const AddToInventory = () => {
    console.log("[ROUTE] Add To Inventory");
    const [searchText, setSearchText] = useState("");           // Inputted Card name
    const [setText, setSetText] = useState("");                 // Inputted Set name
    const [searchResults, setSearchResults] = useState({});     // Search Results Array/Container
    const [searchStatus, setSearchStatus] = useState(0);

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

    const buildList = () => {

        switch(searchResults.object){
            case "list":
                console.log(`buildList() :: search results returned a LIST object`);

                return searchResults.data.map( (card, index) => {
                    return(
                        <div className="col-sm-3" key={index} style={{paddingBottom: 20+'px'}}>
                            <Card card={card} />
                        </div>
                    )
                } );

                break;
            case "error":
                console.log(`buildList() :: search results returned an ERROR object`);
                return(<h1>There is an Error.</h1>);
                break;
            default:
                console.log(`buildList() :: default state`);
                return(<h1>Nothing yet.</h1>)
                break;
        }        
    }

// Application Functions
    // Search MTG API for card name in given set
    const searchForCard = function(e){
        setSearchResults({});   // RESETS the DOM objects
        console.log(`Searching for "${searchText}" in the set "${setText}"`);
        e.preventDefault();

        let fetchUrl = `https://api.scryfall.com/cards/search?q=${encodeURI(searchText)}+lang%3Aen&unique=prints`;

        fetch(fetchUrl)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setSearchResults(result);
                }
            );
    };

    useEffect( () => {
        buildList()
    }, [] );

    return (
        <React.Fragment>
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
                    buildList()
                }
                </div>
            </div>
        </React.Fragment>
    );
}

export default AddToInventory;
import React from "react";
import { useState, useEffect } from "react";

// Custom Components
import Card from '../Components/Card';

const AddToInventory = () => {
    console.log("[ROUTE] Add To Inventory");
    const [searchText, setSearchText] = useState("");           // Inputted Card name
    const [setText, setSetText] = useState("");                 // Inputted Set name
    const [searchResults, setSearchResults] = useState({});     // Search Results Array/Container

    const [focusInput, setFocusInput] = useState();

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
                    let releaseYear = new Date(card.released_at).getFullYear();
                    console.log(`Release Year: ${releaseYear}`);
                    // if(releaseYear === 1997){
                        return(
                            <div className="col-sm-4" key={index} style={{paddingBottom: 20+'px'}}>
                                <Card card={card} />
                            </div>
                        )
                    // }else{
                    //     return "";
                    // }
                                
                } );
            case "error":
                console.log(`buildList() :: search results returned an ERROR object`);
                return(<h1>There is an Error.</h1>);
            default:
                console.log(`buildList() :: default state`);
                return(<h1>Nothing yet.</h1>)
        }        
    }

// Application Functions
    // Search MTG API for card name in given set
    const searchForCard = function(e){
        setSearchResults({});   // RESETS the DOM objects
        console.log(`Searching for "${searchText}" in the set "${setText}"`);
        e.preventDefault();

        let search = searchText;

        if(setText){
            search = search+" set:"+setText;
        }

        let fetchUrl = `https://api.scryfall.com/cards/search?q=${encodeURI(search)}+lang%3Aen&unique=prints`;

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
        if(focusInput){
            focusInput.focus();
        }
    }, [focusInput] );

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
                                <input type="text" className="form-control" ref={inputEle => setFocusInput(inputEle)} onChange={(e) => {onInputText(e)}} id="cardName" />
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
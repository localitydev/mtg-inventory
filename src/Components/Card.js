import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const mtg = require('mtgsdk');      // MTG SDK

var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_APIKEY }).base( process.env.REACT_APP_AIRTABLE_BASE );

const Card = (props) => {

    // Card Properties (Variables)
        const [cardInfo, setCardInfo] = useState({});
        const [cardSet, setCardSet] = useState("");       // Variable houses Set's full name versus Abbreviation
        const [adding, setAdding] = useState(false);     // State Variable for Adding to Inventory

    // Card Functions
    const addToInventory = () => {
        console.log("Adding Card(s) to inventory", cardInfo);
        
        setAdding(true);

        // TODO - Check for Card in Inventory
        // Check for existing card
        base('Inventory').select({
            fields: ["multiverseid", "quantity"],
            filterByFormula: "{multiverseid} = " + cardInfo.multiverseid
        })
        
        /** After database retrieval there should be either 1 or no results.
         * - IF 1 result -> +1 that Card
         * - ELSE
         * -    Add card to inventory
         */
        .eachPage(function page(cards, fetchNextPage) {
            // This function (`page`) will get called for each page of cards.
            
            console.log("Cards found: ", cards);

            if(cards.length !== 0){
                // Update card quantity
                base('Inventory').update([
                    {
                      "id": cards[0].id,
                      "fields": {
                        "quantity" : cards[0].fields.quantity + 1
                      }
                    }
                  ], function(err, records) {
                    setAdding(false);

                    if (err) {
                      console.error("Update Card Error.", err);
                      return;
                    }
                    console.log("Card Updated Successfully!");
                    
                  });
            }else{
                console.log("Add this card to inventory:", cardInfo);

                // Value of the card's color.
                var cardInfoColors = (cardInfo.colors) ? cardInfo.colors.join(",") : "" ;
                var cardInfoColorIdentity = (cardInfo.colorIdentity) ? cardInfo.colorIdentity.join(",") : "" ;
                var cardInfoTypes = (cardInfo.types) ? cardInfo.types.join(",") : "" ;

                // Add card to inventory
                base('Inventory').create([
                    {
                      "fields": {
                        "artist": cardInfo.artist,
                        "cmc": cardInfo.cmc,
                        "colors": cardInfoColors,
                        "colorIdentity": cardInfoColorIdentity,
                        "imageUrl": cardInfo.imageUrl,
                        "multiverseid": cardInfo.multiverseid,
                        "manaCost":cardInfo.manaCost,
                        "name": cardInfo.name,
                        "quantity": 1,
                        "setID": cardInfo.set,
                        "setName": cardInfo.setName,
                        "type": cardInfo.type,
                        "types": cardInfoTypes
                      }
                    }
                  ], function(err, records) {
                    setAdding(false);
                    
                    if (err) {
                      console.error("Create Card Error", err);
                      return;
                    }
                    console.log("Card Creation Complete.");
                  });
            }
        
        }, function done(err) {
            console.log("Add card complete", cardInfo);
            if (err) { console.error(err); return; }
        });

        // If card found, update quanity
        // ELSE add Card
    }

    // Card Event Listeners
    


    // USES
    useEffect(() => {
        // When card is mounted. Take card info and set it.
        setCardInfo(props.card);

        /** Find Set name from SetID
         * - The setID is returned with the card but not the set name.
         * - This will get us the set name to display
         */
        mtg.set.find(props.card.set)
        .then(result => {
            console.log(`Full Set Name: `, result);
 
            // Set the state of the card's `Set` to returned value
            setCardSet(result.set.name);
         });
    })


    return (
        <React.Fragment>
            <div className="card text-center">
                <img className="img-fluid" src={props.card.imageUrl} alt="" />
                <div className="card-body">
                    <h5 className="card-title text-left">{props.card.name}</h5>
                    <p className="text-right pr-2">{cardSet}</p>

                    <div style={{position: "absolute", bottom: "20px", width:"100%"}} className="row g-0 justify-content-center align-items-center">
                        <div className="col-auto p-0">
                            <input style={{"width":"50px"}} type="number" step="1" min="1" onChange={()=>{}}/>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-primary" disabled={adding} onClick={addToInventory}>Add Card</button>
                        </div>
                        <div className="col-auto p-0">
                            <input style={{position:"relative", bottom:"-4px", width:"20px", height:"20px"}} type="checkbox" id="isFoil" />
                            <label htmlFor="isFoil" style={{marginLeft: "2px"}} onChange={()=>{}} className="form-check-label" >Foil</label>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Card;
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import CardStats from '../Components/CardStats';

var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_APIKEY }).base( process.env.REACT_APP_AIRTABLE_BASE );

const OneSidedCard = (props) => {

    // Card OBJECT
    const [card, setCard] = useState({});

    const [manaCost, setManaCost] = useState({__html: ""});
    const [oracleText, setOracleText] = useState({__html: ""});

    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [show, setShow] = useState("");
    const [planeswalker, setPlaneswalker] = useState(false);
    const [creature, setCreature] = useState(false);

    // COMPONENT FUNCTIONS
    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    }

    const decreaseQuantity = () => {
        if(quantity > 1){
            setQuantity(quantity - 1);
        }
    }

    const addToInventory = () => {
        console.log("Adding Card to inventory");
        
        setAdding(true);
        
        base('Inventory').select({
            fields: ["scryfall_id", "quantity"],
            filterByFormula: `{scryfall_id} = '${card.id}'`
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
                        "quantity" : cards[0].fields.quantity + quantity
                      }
                    }
                  ], function(err, records) {
                    setAdding(false);
                    setShow("show");
                    setQuantity(1);
    
                    if (err) {
                      console.error("Update Card Error.", err);
                      return;
                    }
                    console.log("Card Updated Successfully!");
                    
                  });
            }else{
                console.log("Adding card to inventory:", card);
    
                // Add card to inventory
                base('Inventory').create([
                    {
                      "fields": {
                          "artist": card.artist,
                          "cmc" : card.cmc,
                          "colors" : card.colors.join(','),
                          "colorIdentity" : card.color_identity.join(','),
                          "cardFace": card.image_uris.normal,
                          "keywords" : card.keywords.join(','),
                          "loyalty" : card.loyalty,
                          "manaCost" : card.mana_cost,
                          "name" : card.name,
                          "oracleText" : card.oracle_text,
                          "planeswalker" : planeswalker,
                          "price" : parseFloat(card.prices['usd']),
                          "priceFoil" : parseFloat(card.prices['usd_foil']),
                          "power" : card.power,
                          "quantity": quantity,
                          "rarity" : card.rarity,
                          "releasedAt" : card.released_at,
                          "scryfall_id" : card.id,
                          "set" : card.set,
                          "setName" : card.set_name,
                          "toughness" : card.toughness,
                          "typeLine" : card.type_line,
                      }
                    }
                  ], function(err, records) {
                    setAdding(false);
                    setShow("show");
                    setQuantity(1);
                    
                    if (err) {
                      console.error("Create Card Error", err);
                      return;
                    }
                    console.log("New card added to inventory.");
                  });
                  setQuantity(1);
            }
        
        }, function done(err) {
            console.log("Add card complete.");
            if (err) { console.error(err); return; }
        });
    
    }

    // UTILITY FUNCTIONS
    const renderText = (input) => {
        console.log(`Render text with images: ${input}`);
  
        // This function will replace the {T} with proper images of that icon
        // example text: {T}: Add {C}. If you control an Urza's Power-Plant and an Urza's Tower, add {C}{C} instead.
  
        let newText = input.replaceAll(/{(.*?)}/g, (match) => {
          console.log(`Replacing match: ${match}`);
  
          return "<img class='mtgIcon' src='/svg/"+match+".svg' />";
        });
  
        return {__html: newText};
      }

    useEffect(() => {
        setCard(props.card);
        setManaCost(renderText(props.card.mana_cost));
        setOracleText(renderText(props.card.oracle_text));
        setPlaneswalker(props.card.type_line.includes('Planeswalker'));
        setCreature(props.card.type_line.includes('Creature'));
    }, []);

console.log("Properties of one-sided-card", props);

    return(
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <img className="img-fluid" src={props.card.image_uris.normal} />
                    </div>
                    <div className="col-5">
                    
                        <h1 className="card-title h4">
                            {card.name}
                            <span className="float-end card-mana_cost" dangerouslySetInnerHTML={manaCost}></span>
                        </h1>
                        
                        <hr />
                        
                        <p className="card-type">
                            {card.type_line}
                        </p>
    
                        <hr />
    
                        <p className="card-type">
                            Set: {card.set_name} ({card.set})
                        </p>
    
                        <hr />
    
                        
                        <div className="card-desc">
                            <p style={{whiteSpace: "break-spaces"}} dangerouslySetInnerHTML={oracleText}></p>
                            <p><em>{card.flavor_text || ""}</em></p>
                        </div>
    
                        <hr />
    
                        <CardStats card={props.card} />
    
                        <hr />
    
                        <p className="card-artist">
                            Illustrated by {card.artist}
                        </p>
    
                        <hr />
    
                        <div className="row">
                            <div className="col">
                                Price: ${(card.prices) && card.prices.usd || ""}
                            </div>
                            <div className="col">
                                Foil: ${(card.prices) && card.prices.usd_foil || ""}
                            </div>
                        </div>
    
                        <hr />
    
                        <p>Released At: {card.released_at}</p>
                    </div>
                    <div className="col-3">
                        <div className="px-5 d-flex justify-content-between align-items-center">
                            <div>
                                <button onClick={()=>{decreaseQuantity()}} className="input-group-text"><i className="bi bi-dash-lg"></i></button>
                            </div>
    
                            <div className="" style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold', fontSize: '40px'}}>
                                {quantity}
                            </div>
    
                            <div>
                                <button onClick={()=>{increaseQuantity()}} className="input-group-text float-end"><i className="bi bi-plus-lg"></i></button>
                            </div>
                        </div>
    
                        <div className="px-5 d-grid mt-3">
                            <button className={`btn btn-block btn-primary`} onClick={event => addToInventory()}>Add to inventory</button>
                        </div>
    
                        <div className={`mt-5 alert alert-success alert-dismissible fade ${show}`} role="alert">
                            <strong>Card(s) added.</strong>
                            <button type="button" className="btn-close" aria-label="Close" onClick={()=>{setShow("")}}></button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
    

    
}

export default OneSidedCard;
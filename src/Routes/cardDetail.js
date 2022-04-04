import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import { useParams } from "react-router-dom";

var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_APIKEY }).base( process.env.REACT_APP_AIRTABLE_BASE );

const CardDetail = (props) => {

    // URL Params
    const params = useParams();

    const [amount, setAmount] = useState(1);
    const [cardObj, setCardObj] = useState({});
    const [adding, setAdding] = useState(false);
    const [planeswalker, setPlaneswalker] = useState(false);
    const [show, setShow] = useState(false);

    // Card Mana Cost
    const [manaCost, setManaCost] = useState({__html: ""});
    
    // Card Image(s)
    const [cardFace, setCardFace] = useState("");
    const [cardBack, setCardBack] = useState("");
    
    // Card Text (ReRendered)
    const [cardText, setCardText] = useState({__html: ""});
    const [cardTextBack, setCardTextBack] = useState("");

    // Card P/T or Loyalty (ReRendered)
    const [combatText, setCombatText] = useState("");



// FUNCTIONS
    const increaseAmount = () => {
        setAmount(amount + 1);
    }

    const decreaseAmount = () => {
        if(amount > 1){
            setAmount(amount - 1);
        }
    }

    const getCardData = async () => {
        const response = await fetch(
            `https://api.scryfall.com/cards/${params.scryfallId}`
        ).then(response => response.json())
        .then((card) => {
            console.log("getCardData response", card);
            // Hold card Obj
            setCardObj(card);

            // Does card have a card back?
            if(card.card_back_id){
                // Normal MTG Cards
                setCardFace(card.image_uris.normal);
                setManaCost(renderText(card.mana_cost));
                setCardText(renderText(card.oracle_text));

                // Set combat Text
                if(card.power && card.toughness){
                    setCombatText(`${card.power}/${card.toughness}`)
                }else if(card.loyalty){
                    setCombatText(`Loyalty: ${card.loyalty}`)
                }
            }else{
                // Two-Sided MTG Cards
                let cardFace = card.card_faces[0];
                
                setCardFace(cardFace.image_uris.normal);
                setManaCost(renderText(cardFace.mana_cost));
                setCardText(renderText(cardFace.oracle_text));
                setCardTextBack(card.card_faces[1].oracle_text);

                if(cardFace.power && cardFace.toughness){
                    setCombatText(`Power/Toughness: ${cardFace.power}/${cardFace.toughness}`)
                }else if(cardFace.loyalty){
                    setCombatText(`Loyalty: ${cardFace.loyalty}`)
                }
            }            
        });
    };

    const addToInventory = () => {
        console.log("Adding Card to inventory");
        
        setAdding(true);

        base('Inventory').select({
            fields: ["scryfall_id", "quantity"],
            filterByFormula: `{scryfall_id} = '${cardObj.id}'`
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
                        "quantity" : cards[0].fields.quantity + amount
                      }
                    }
                  ], function(err, records) {
                    setAdding(false);
                    setShow(true);
                    setAmount(1);

                    if (err) {
                      console.error("Update Card Error.", err);
                      return;
                    }
                    console.log("Card Updated Successfully!");
                    
                  });
            }else{
                console.log("Add this card to inventory:", cardObj, cardObj.color_identity.join(','));

                // Add card to inventory
                base('Inventory').create([
                    {
                      "fields": {
                        "scryfall_id" : cardObj.id,
                        "quantity": amount,
                        "name" : cardObj.name,
                        "manaCost" : cardObj.mana_cost,
                        "colorIdentity" : cardObj.color_identity.join(','),
                        "setName" : cardObj.set_name,
                        "colors" : cardObj.colors.join(','),
                        "typeLine" : cardObj.type_line,
                        "set" : cardObj.set,
                        "cardFace" : cardFace,
                        "cardBack" : cardBack,
                        "cmc" : cardObj.cmc,
                        "quantity" : amount,
                        "oracleText" : cardObj.oracle_text,
                        "releasedAt" : cardObj.released_at,
                        "rarity" : cardObj.rarity,
                        "price" : parseFloat(cardObj.prices['usd']),
                        "priceFoil" : parseFloat(cardObj.prices['usd_foil']),
                        "power" : cardObj.power,
                        "toughness" : cardObj.toughness,
                        "loyalty" : cardObj.loyalty,
                        "planeswalker" : planeswalker,
                        "keywords" : cardObj.keywords.join(','),
                        "oracleTextBack" : cardObj.cardTextBack,
                        "artist": cardObj.artist
                      }
                    }
                  ], function(err, records) {
                    setAdding(false);
                    setShow(true);
                    setAmount(1);
                    
                    if (err) {
                      console.error("Create Card Error", err);
                      return;
                    }
                    console.log("New card added to inventory.");
                  });
                  setAmount(1);
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


    // When Component mounts
    useEffect(() => {
        console.log("URL Params", params);
        getCardData();
        
    }, []);

    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <img className="img-fluid" src={cardFace} />
                    </div>
                    <div className="col-5">
                    
                        <h1 className="card-title h4">
                            {cardObj.name}
                            <span className="float-end card-mana_cost" dangerouslySetInnerHTML={manaCost}></span>
                        </h1>
                        
                        <hr />
                        
                        <p className="card-type">
                            {cardObj.type_line}
                        </p>

                        <hr />

                        <p className="card-type">
                            Set: {cardObj.set_name}
                        </p>

                        <hr />

                        
                        <div className="card-desc">
                            <p style={{whiteSpace: "break-spaces"}} dangerouslySetInnerHTML={cardText}></p>
                            <p><em>{cardObj.flavor_text || ""}</em></p>
                        </div>

                        <hr />

                        <div className="card-pt">{combatText}</div>

                        <hr />

                        <p className="card-artist">
                            Illustrated by {cardObj.artist}
                        </p>

                        <hr />

                        <div className="row">
                            <div className="col">
                                Price: ${(cardObj.prices) && cardObj.prices.usd || ""}
                            </div>
                            <div className="col">
                                Foil: ${(cardObj.prices) && cardObj.prices.usd_foil || ""}
                            </div>
                        </div>

                        <hr />

                        <p>Released At: {cardObj.released_at}</p>
                    </div>
                    <div className="col-3">
                        <div className="px-5 d-flex justify-content-between align-items-center">
                            <div>
                                <button onClick={()=>{decreaseAmount()}} className="input-group-text"><i className="bi bi-dash-lg"></i></button>
                            </div>

                            <div className="" style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 'bold', fontSize: '40px'}}>
                                {amount}
                            </div>

                            <div>
                                <button onClick={()=>{increaseAmount()}} className="input-group-text float-end"><i className="bi bi-plus-lg"></i></button>
                            </div>
                        </div>

                        <div className="px-5 d-grid mt-3">
                            <button className={`btn btn-block btn-primary ${(amount)? "": "disabled"}`} onClick={event => addToInventory()}>Add to inventory</button>
                        </div>

                        <div className={`mt-5 alert alert-success alert-dismissible fade ${((show) && "show")}`} role="alert">
                            <strong>Card(s) added.</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={()=>{setShow(false)}}></button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CardDetail;
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import CardStats from '../Components/CardStats';

var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_APIKEY }).base( process.env.REACT_APP_AIRTABLE_BASE );

const TwoSidedCard = (props) => {

    // Card OBJECT
    const [card, setCard] = useState({});

    const [cardFace, setCardFace] = useState({});
    const [cardBack, setCardBack] = useState({});
    const [cardFaceURL, setCardFaceURL] = useState("");
    const [cardBackURL, setCardBackURL] = useState("");
    const [colors, setColors] = useState("");
    const [colorsBack, setColorsBack] = useState("");


    const [faceManaCost, setFaceManaCost] = useState({__html: ""});
    const [backManaCost, setBackManaCost] = useState({__html: ""});
    const [oracleTextFace, setOracleTextFace] = useState({__html: ""});
    const [oracleTextBack, setOracleTextBack] = useState({__html: ""});

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

    const createFields = () => {
        let fields                  = {};
        fields.artist           = card.artist;
        fields.cmc              = card.cmc;
        fields.colorIdentity    = card.color_identity.join(',');
        fields.keywords         = card.keywords.join(',');
        fields.name             = card.name;
        fields.quantity         = quantity;
        fields.rarity           = card.rarity;
        fields.releasedAt       = card.released_at;
        fields.scryfall_id      = card.id;
        fields.set              = card.set;
        fields.setName          = card.set_name;
        fields.price            = parseFloat(card.prices['usd']);
        fields.priceFoil        = parseFloat(card.prices['usd_foil']);
        
        fields.cardFace         = cardFaceURL;
        fields.cardBack         = cardBackURL;
        

        // FRONT
        fields.manaCost         = cardFace.mana_cost;
        fields.typeLine         = cardFace.type_line;
        fields.oracleText       = cardFace.oracle_text;
        fields.colors           = colors;

        if(cardFace.type_line.includes('Creature')){
            fields.power            = cardFace.power;
            fields.toughness        = cardFace.toughness;
        }

        if(cardFace.type_line.includes("Planeswalker")){
            fields.planeswalker     = true;
            fields.loyalty          = cardFace.loyalty;
        }

        // BACK
        fields.manaCostBack     = cardBack.mana_cost;
        fields.typeLineBack     = cardBack.type_line;
        fields.oracleTextBack   = cardBack.oracle_text;
        
        fields.colorsBack       = colorsBack;

        if(cardBack.type_line.includes('Creature')){
            fields.powerBack            = cardBack.power;
            fields.toughnessBack        = cardBack.toughness;
        }

        if(cardBack.type_line.includes("Planeswalker")){
            fields.planeswalkerBack     = true;
            fields.loyaltyBack          = cardBack.loyalty;
        }

        return fields;
    }

    const addToInventory = () => {
        console.log(`Adding Card to inventory: ${card.id}`);
        
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
                console.log("Card does not exist in inventory...");

                let fields = createFields();

                // Add card to inventory
                base('Inventory').create([
                    {
                      "fields": fields
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
        setCardFace(props.card.card_faces[0]);
        setCardBack(props.card.card_faces[1]);

        switch(props.card.layout){
            case "transform":
            case "modal_dfc":
                setCardFaceURL(props.card.card_faces[0].image_uris.normal);
                setCardBackURL(props.card.card_faces[1].image_uris.normal);

                setColors(props.card.card_faces[0].colors.join(','));
                setColorsBack(props.card.card_faces[1].colors.join(','));
                break;
            case "adventure":
                setCardFaceURL(props.card.image_uris.normal);
                setColors(props.card.colors.join(','));
                break;
            default:
                break;
        }

        setFaceManaCost(renderText(props.card.card_faces[0].mana_cost));
        setBackManaCost(renderText(props.card.card_faces[1].mana_cost));
        setOracleTextFace(renderText(props.card.card_faces[0].oracle_text));
        setOracleTextBack(renderText(props.card.card_faces[1].oracle_text));
        setPlaneswalker(props.card.card_faces[0].type_line.includes('Planeswalker'));
        setCreature(props.card.card_faces[0].type_line.includes('Creature'));
    }, []);

console.log("<TwoSidedCard /> Properties", props.card.card_faces[0]);

    return(
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <img className="img-fluid" src={cardFaceURL} />
                    </div>
                    <div className="col-5">
                        <hr style={{border: "3px solid black", opacity: 0.8}} />
                    
                        <h1 className="card-title h4">
                            {props.card.card_faces[0].name}
                            <span className="float-end card-mana_cost" dangerouslySetInnerHTML={faceManaCost}></span>
                        </h1>
                        
                        <hr />
                        
                        <p className="card-type">{props.card.card_faces[0].type_line}</p>
    
                        <hr />
    
                        <p className="card-type">Set: {props.card.set_name}</p>
    
                        <hr />
                        
                        <div className="card-desc">
                            <p style={{whiteSpace: "break-spaces"}} dangerouslySetInnerHTML={oracleTextFace}></p>
                            <p><em>{props.card.card_faces[0].flavor_text || ""}</em></p>
                        </div>
    
                        <hr />
    
                        <CardStats card={props.card.card_faces[0]} />
    
                        <hr style={{border: "3px solid black", opacity: 0.8}} />
    
                        <h1 className="card-title h4">
                            {props.card.card_faces[1].name}
                            <span className="float-end card-mana_cost" dangerouslySetInnerHTML={backManaCost}></span>
                        </h1>
                        
                        <hr />
                        
                        <p className="card-type">{props.card.card_faces[1].type_line}</p>
    
                        <hr />
                        
                        <div className="card-desc">
                            <p style={{whiteSpace: "break-spaces"}} dangerouslySetInnerHTML={oracleTextBack}></p>
                            <p><em>{props.card.card_faces[1].flavor_text || ""}</em></p>
                        </div>
    
                        <hr />
    
                        <CardStats card={props.card.card_faces[1]} />
    
                        <hr style={{border: "3px solid green", opacity: 0.8}} />
    
                        <p className="card-artist">Illustrated by {props.card.card_faces[1].artist}</p>
    
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

export default TwoSidedCard;
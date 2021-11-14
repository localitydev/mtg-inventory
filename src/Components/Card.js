import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const mtg = require('mtgsdk');      // MTG SDK

var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_APIKEY }).base( process.env.REACT_APP_AIRTABLE_BASE );

const Card = (props) => {

    // Card Properties (Variables)
        const [cardInfo, setCardInfo] = useState({});

        // Reformatted content
        const [cardSet, setCardSet] = useState("");       // Variable houses Set's full name versus Abbreviation
        const [cardText, setCardText] = useState({__html: props.card.text});
        const [cardManaCost, setCardManaCost] = useState({__html: props.card.manaCost});
        
        // BOOLEAN Statues
        const [adding, setAdding] = useState(false);     // State Variable for Adding to Inventory
        const [formatted, setFormatted] = useState(false);     // State Variable for Adding to Inventory

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

    // Render Card Function
    const formatCard = () => {

      if(!formatted){
        // Find Full name for Set ABBR.
        mtg.set.find(props.card.set)
        .then(result => {
          console.log(`Full Set Name: `, result);

          // Set the state of the card's `Set` to returned value
          props.card.setName = result.set.name;

          // When card is mounted. Take card info and set it.
          setCardInfo(props.card);
        });

        // Convert symbol ABBR. to images of that symbol
        setCardText(renderText(props.card.text));

        if(props.card.hasOwnProperty("manaCost")){
          setCardManaCost(renderText(props.card.manaCost));
        }

        setFormatted(true);
      }
    }

    // Card Utilities
    const renderText = (input) => {
      console.log(`Render text with images: ${input}`);

      // This function will replace the {T} with proper images of that icon
      // example text: {T}: Add {C}. If you control an Urza's Power-Plant and an Urza's Tower, add {C}{C} instead.

      let newText = input.replaceAll(/{(.*?)}/g, (match) => {
        console.log(`Replacing match: ${match}`);

        switch (match) {
          case "{T}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=tap&type=symbol' />";
          case "{C}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=c&type=symbol' />";
          case "{B}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=b&type=symbol' />";
          case "{U}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=u&type=symbol' />";
          case "{G}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=g&type=symbol' />";
          case "{R}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=r&type=symbol' />";
          case "{W}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=w&type=symbol' />";
          case "{0}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=0&type=symbol' />";
          case "{1}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=1&type=symbol' />";
          case "{2}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=2&type=symbol' />";
          case "{3}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=3&type=symbol' />";
          case "{4}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=4&type=symbol' />";
          case "{5}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=5&type=symbol' />";
          case "{6}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=6&type=symbol' />";
          case "{7}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=7&type=symbol' />";
          case "{8}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=8&type=symbol' />";
          case "{9}":
            return "<img src='https://gatherer.wizards.com/Handlers/Image.ashx?size=small&name=9&type=symbol' />";
          default:
            return match;
        }

      });

      return {__html: newText};
    }

    // Card Event Listeners
    


    // USES
    useEffect(() => {
        
      // When component is mounted, set the components data.
      setCardInfo(props.card);
    })


    return (
        <React.Fragment>
            <div className="card text-center" onMouseEnter={formatCard}>
                <img className="img-fluid" src={cardInfo.imageUrl} alt="" />
                <div className="card-body">
                    <h6 className="card-title text-left">{cardInfo.name} <span className="pr-1 float-right" dangerouslySetInnerHTML={cardManaCost}></span></h6>
                    <p className="text-right pr-2">{cardInfo.setName}</p>

                    <div>
                      <img src={cardInfo.imageUrl} alt="" width="100" />
                    </div>

                    <hr />

                    <p dangerouslySetInnerHTML={cardText}></p>

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
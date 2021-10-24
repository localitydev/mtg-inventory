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
                    <p>{cardSet}</p>

                    <div className="mb-3">
                        <label for="exampleFormControlInput1" className="form-label">Quantity</label>
                        <input type="number" step="1" min="1" value="1" onChange={()=>{}}/>
                    </div>

                    <div className="form-check">
                        <input type="checkbox" for=""/>
                        <label className="form-check-label" for="flexCheckDefault">
                        Foil
                        </label>
                    </div>

                    <div>
                        <button className="btn btn-primary" disabled={adding} onClick={addToInventory}>Add Card</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Card;
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import { useParams } from "react-router-dom";

const CardDetail = (props) => {

    // URL Params
    const params = useParams();

    const [amount, setAmount] = useState(0);
    const [cardObj, setCardObj] = useState({});

    // Card Mana Cost
    
    // Card Image(s)
    const [cardFace, setCardFace] = useState("");
    const [cardBack, setCardBack] = useState("");
    
    // Card Text (ReRendered)

    // Card P/T or Loyalty (ReRendered)


// FUNCTIONS
    const increaseAmount = () => {
        setAmount(amount + 1);
    }

    const decreaseAmount = () => {
        if(amount){
            setAmount(amount - 1);
        }
    }

    const getCardData = async () => {
        const response = await fetch(
            `https://api.scryfall.com/cards/multiverse/${params.multiverseid}`
        ).then(response => response.json())
        .then((card) => {
            console.log("getCardData response", card);

            if(card.card_back_id){
                // Normal MTG Cards
                setCardFace(card.image_uris.normal);
                // setManaCost();
            }else{
                // Two-Sided MTG Cards
                setCardFace(card.card_faces[0].image_uris.normal);
                // setManaCost();
            }
            
            // update the state
            setCardObj(card);
        });
    };

// UTILITY FUNCTIONS


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
                        <h1 className="card-title h6">
                            {cardObj.name}
                            <span className="float-end card-mana_cost">{cardObj.mana_cost}</span>
                        </h1>
                        
                        <hr />
                        
                        <p className="card-type">
                            {cardObj.type_line}
                        </p>

                        <hr />
                        
                        <div className="card-desc" style={{whiteSpace: "break-spaces"}}>
                            {cardObj.oracle_text}
                        </div>

                        <hr />

                        <div className="card-pt text-end">
                            Loyalty: 4
                        </div>

                        <hr />

                        <p className="card-artist">
                            {cardObj.artist}
                        </p>
                    </div>
                    <div className="col-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <button onClick={()=>{decreaseAmount()}} className="input-group-text"><i className="bi bi-dash-lg"></i></button>
                            </div>

                            <div className="h5">
                                {amount}
                            </div>

                            <div>
                                <button onClick={()=>{increaseAmount()}} className="input-group-text float-end"><i className="bi bi-plus-lg"></i></button>
                            </div>
                            
                        </div>
                        <div className="d-grid">
                            <button className="btn btn-block btn-primary">Add to inventory</button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CardDetail;
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import { useParams } from "react-router-dom";

const CardDetail = (props) => {

    // URL Params
    const params = useParams();

    const [amount, setAmount] = useState(0);
    const [cardObj, setCardObj] = useState({});


// FUNCTIONS
    const increaseAmount = () => {
        setAmount(amount + 1);
    }

    const decreaseAmount = () => {
        if(amount){
            setAmount(amount - 1);
        }
    }

    // When Component mounts
    useEffect(() => {
        console.log("URL Params", params);
        
    }, []);

    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <img src="https://c1.scryfall.com/file/scryfall-cards/large/front/4/0/408be425-b8a6-4c03-b2a6-7ff7bd6555e0.jpg" alt="" className="img-fluid" />
                    </div>
                    <div className="col-5">
                        <h1 className="card-title h6">
                            Nahiri, Heir of the Ancients
                            <span className="card-mana_cost"></span>
                        </h1>
                        
                        <hr />
                        
                        <p className="card-type">
                            Legendary Planeswalker — Nahiri
                        </p>

                        <hr />
                        
                        <div className="card-desc">
                            <p>+1: Create a 1/1 white Kor Warrior creature token. You may attach an Equipment you control to it.</p>
                            <p>−2: Look at the top six cards of your library. You may reveal a Warrior or Equipment card from among them and put it into your hand. Put the rest on the bottom of your library in a random order.</p>
                            <p>−3: Nahiri, Heir of the Ancients deals damage to target creature or planeswalker equal to twice the number of Equipment you control.</p>
                        </div>

                        <hr />

                        <div className="card-pt text-end">
                            Loyalty: 4
                        </div>

                        <hr />

                        <p className="card-artist">
                            Illustrated by Anna Steinbauer
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
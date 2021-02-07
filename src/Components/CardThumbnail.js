import React from "react";
import { useState } from "react";

const mtg = require('mtgsdk');      // MTG SDK

export default function MTGCard(props) {

    console.log(props.card);

    {/* SET CARD IMAGE TO A GIVEN CARD URL. IF THERE IS NO IMAGE, SET IMAGE TO DEFAULT BACK */}
    if(!props.card.imageUrl){
        props.card.imageUrl = "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=0&type=card";
    }

    return(
        <div className="card">
            <img className="img-fluid card-img-top" src={props.card.imageUrl} alt="" />
            <div className="card-body">
                <h5 className="card-title">{props.card.name}</h5>
                {/* <p className="card-text">{props.card.originalText}</p> */}
                <button className="btn btn-primary">Add Card</button>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">Rarity: {props.card.rarity}</li>
                <li className="list-group-item">Set: {props.card.set}</li>
                <li className="list-group-item">Artist: {props.card.artist}</li>
            </ul>
        </div>
    );
}

import React from "react";
import { useState, useEffect } from "react";

const CardStats = (props) => {

    console.log("Card Stats Properties", props);

    if(props.card.type_line.includes('Creature')){
        return (<div className="card-pt">{`${props.card.power} / ${props.card.toughness}`}</div>);
    }else if(props.card.type_line.includes('Planeswalker')){
        return (<div className="card-pt">{`Loyalty: ${props.card.loyalty}`}</div>);
    }else{
        return "";
    }
}

export default CardStats;
 
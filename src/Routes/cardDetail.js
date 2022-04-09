import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import { useParams } from "react-router-dom";
import OneSidedCard from "../Components/OneSidedCard";
import TwoSidedCard from "../Components/TwoSidedCard";

const CardDetail = (props) => {

    // URL Params
    const params = useParams();

    // VIEW Data
    const [scryfallObj, setScryfallObj] = useState({});
    const [test, setTest] = useState((<h1>Testing</h1>));


// FUNCTIONS
    const getCardData = async () => {
        const response = await fetch(
            `https://api.scryfall.com/cards/${params.scryfallId}`
        ).then(response => response.json())
        .then((card) => {
            console.log("getCardData response", card);
            // Hold card Obj
            setScryfallObj(card);

            if(card.card_faces){
                console.log("TWO-SIDED-CARD");
                setTest((<TwoSidedCard card={card} />));
            }else if(card.card_back_id){
                console.log("ONE-SIDED-CARD");
                setTest((<OneSidedCard card={card} />));
            }else{
                console.log("Erdsfror");
            }
        });
    };

    
    // () => {
    //     switch(display){
    //         case "one":
    //             return 
    //         case "two":
    //             return 
    //         default:
    //             return(<h1>Pending display</h1>)
    //     }
    // }



    // When Component mounts
    useEffect(() => {
        console.log("URL Params", params);
        getCardData();
        
    }, []);

    return(test)

   

    
}

export default CardDetail;
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import { Link } from 'react-router-dom';

const Card = (props) => {
  console.log(`Card Component Created:`);

  const [image, setImage] = useState();
  const [cardLink, setCardLink] = useState("/cardDetail/");

  useEffect(() => {
    console.log("onComponentMount for Card: ...");

    /** CARD IMAGE CONDITIONAL
     * [The type of cards can vary dratically. Some cards have two sides, while others have two cards on one side.]
     * Examples
     * - The Modern Age :: Double-sided card
     * - :: Two+ Cards on one side
     * - :: Story Cards
     * - :: Alt ART cards
     */

    // Setting the detail link to have the Multiverse ID attached
    // ..First number in the ID array is the card face.
    setCardLink(cardLink+props.card.id);

    if(props.card.card_back_id){
      // Normal MTG Cards
      setImage(props.card.image_uris.normal);
    }else{
      // Two-Sided MTG Cards
      setImage(props.card.card_faces[0].image_uris.normal);
    }
  }, []);

  

  return (
      <React.Fragment>
          <div className="card text-center">
              <Link to={cardLink} ><img className="img-fluid" src={image} alt="" /></Link>
          </div>
      </React.Fragment>
  )
}

export default Card;
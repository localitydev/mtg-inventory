import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import { Link } from 'react-router-dom';

const Card = (props) => {
  console.log(`Card Component Created:`, props.card)

  return (
      <React.Fragment>
          <div className="card text-center">
              <img className="img-fluid" src={props.card.image_uris.normal} alt="" />
          </div>
      </React.Fragment>
  )
}

export default Card;
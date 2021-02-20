import React, { Component } from "react";
import { useState } from "react";

const mtg = require('mtgsdk');      // MTG SDK

class CardThumbnail extends Component {
    constructor(props){
        super(props);
        this.state = {
          set: ''
        }
    }

    componentDidMount(){
        /* SET CARD IMAGE TO A GIVEN CARD URL. IF THERE IS NO IMAGE, SET IMAGE TO DEFAULT BACK */
        if(this.props.card.imageUrl === undefined){
            this.props.card.imageUrl = "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=0&type=card";
        }

        mtg.set.find(this.props.card.set)
        .then(result => {
            this.setState({
                set: result.set.name
            });
            console.log(result.set.name);
        });
    };

    render(){
        return(
            <div className="card">
                <img className="img-fluid card-img-top" src={this.props.card.imageUrl} alt="" />
                <div className="card-body">
                    <h5 className="card-title">{this.props.card.name}</h5>
                    {/* <p className="card-text">{this.props.card.originalText}</p> */}
                    <button className="btn btn-primary">Add Card</button>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Rarity: {this.props.card.rarity}</li>
                    <li className="list-group-item">Set: {this.set}</li>
                    <li className="list-group-item">Artist: {this.props.card.artist}</li>
                </ul>
            </div>
        )
    }
        
}

export default CardThumbnail; 


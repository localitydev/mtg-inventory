import React, { Component } from "react";
import { useState } from "react";

const mtg = require('mtgsdk');      // MTG SDK

// IMPORTING Airtable functionality
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_APIKEY }).base( process.env.REACT_APP_AIRTABLE_BASE );

class CardThumbnail extends Component {
    constructor(props){
        super(props);
        this.state = {
          set: ''
        }
    }

    addInventory = () => {
        /** Additional notes - problem solving notes for Notion
         * - concat card identity with `,` and store as one string
         * - concat card colors with `,` and store as one string
         * - concat card types with `,` and store as one string
         */

        // Take Card and Add to inventory.
        // If already in inventory, update quantity + 1
        console.log("Add Card:", this.props.card);

        var listedCard = this.props.card;                 // Making a Variable for ease of calling

        console.log("Multiverse ID Check:", listedCard.multiverseid);

        // Check for existing card
        base('Inventory').select({
            fields: ["multiverseid", "quantity"],
            filterByFormula: "{multiverseid} = " + listedCard.multiverseid
        })
        
        /** After database retrieval there should be either 1 or no results.
         * - IF 1 result -> +1 that Card
         * - ELSE
         * -    Add card to inventory
         */
        .eachPage(function page(cards, fetchNextPage) {
            // This function (`page`) will get called for each page of cards.
            
            console.log("Cards found: ", cards.length);

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
                    if (err) {
                      console.error(err);
                      return;
                    }
                    console.log("Card Updated Successfully!");
                  });
            }else{
                console.log("Add this card to inventory:", listedCard);

                // Add card to inventory
                base('Inventory').create([
                    {
                      "fields": {
                        "name": listedCard.name,
                        "manaCost":listedCard.manaCost,
                        "colorIdentity": listedCard.colorIdentity.join(","),
                        "setName": listedCard.setName,
                        "colors": listedCard.colors.join(","),
                        "type": listedCard.type,
                        "types": listedCard.types.join(","),
                        "artist": listedCard.artist,
                        "setID": listedCard.set,
                        "multiverseid": listedCard.multiverseid,
                        "imageUrl": listedCard.imageUrl,
                        "cmc": listedCard.cmc
                      }
                    }
                  ], function(err, records) {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    console.log("Card Creation Complete.");
                  });
            }
        
        }, function done(err) {
            console.log("Base Check complete");
            if (err) { console.error(err); return; }
        });

    }

    componentDidMount(){

        /** Find Set name from SetID
         * - The setID is returned with the card but not the set name.
         * - This will get us the set name to display
         */
        mtg.set.find(this.props.card.set)
        .then(result => {

            // Set the state of the card's `Set` to returned value
            this.setState({
                set: result.set.name
            });
        });
    };

    render(){
        return(
            <div className="card">
                <img className="img-fluid card-img-top" src={this.props.card.imageUrl} alt="" />
                <div className="card-body">
                    <h5 className="card-title">{this.props.card.name}</h5>
                    {/* <p className="card-text">{this.props.card.originalText}</p> */}
                    <button className="btn btn-primary" onClick={this.addInventory}>Add Card</button>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Rarity: {this.props.card.rarity}</li>
                    <li className="list-group-item">Set: {this.state.set}</li>
                    <li className="list-group-item">Artist: {this.props.card.artist}</li>
                </ul>
            </div>
        )
    }
        
}

export default CardThumbnail; 


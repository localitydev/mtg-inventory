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
          set: '',
          adding: false
        }
    }

    addInventory = () => {
        // Set state of adding to true
        this.setState({adding: true});

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
            
            console.log("Cards found: ", cards);

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
                    this.setState({
                      adding: false
                    });

                    if (err) {
                      console.error("Update Card Error.", err);
                      return;
                    }
                    console.log("Card Updated Successfully!");
                    
                  });
            }else{
                console.log("Add this card to inventory:", listedCard);

                // Value of the card's color.
                var listedCardColors = (listedCard.colors) ? listedCard.colors.join(",") : "" ;
                var listedCardColorIdentity = (listedCard.colorIdentity) ? listedCard.colorIdentity.join(",") : "" ;
                var listedCardTypes = (listedCard.types) ? listedCard.types.join(",") : "" ;

                // Add card to inventory
                base('Inventory').create([
                    {
                      "fields": {
                        "artist": listedCard.artist,
                        "cmc": listedCard.cmc,
                        "colors": listedCardColors,
                        "colorIdentity": listedCardColorIdentity,
                        "imageUrl": listedCard.imageUrl,
                        "multiverseid": listedCard.multiverseid,
                        "manaCost":listedCard.manaCost,
                        "name": listedCard.name,
                        "quantity": 1,
                        "setID": listedCard.set,
                        "setName": listedCard.setName,
                        "type": listedCard.type,
                        "types": listedCardTypes
                      }
                    }
                  ], function(err, records) {
                    this.setState({
                      adding: false
                    });
                    
                    if (err) {
                      console.error("Create Card Error", err);
                      return;
                    }
                    console.log("Card Creation Complete.");
                  });
            }
        
        }, function done(err) {
            console.log("Add card complete", this.state);
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
          <div className="card text-center">
              <img className="img-fluid" src={this.props.card.imageUrl} alt="" />
              <div className="card-body">
                  <h4 className="card-title">{this.props.card.name}</h4>

                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">Quantity</label>
                    <input type="number" step="1" min="1" value="1" onChange={()=>{}}/>
                  </div>

                  <div class="form-check">
                    <input type="checkbox" for=""/>
                    <label class="form-check-label" for="flexCheckDefault">
                      Foil
                    </label>
                  </div>

                  <div>
                    <button className="btn btn-primary" disabled={this.state.adding} onClick={this.addInventory}>Add Card</button>
                  </div>

                  <div className="spinner1">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                  </div>
              </div>
          </div>
        )
    }   
}

export default CardThumbnail; 


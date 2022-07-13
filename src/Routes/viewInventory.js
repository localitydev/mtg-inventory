import React from "react";
import { useState, useEffect } from "react";

const ViewInventory = () => {
    console.log("[ROUTE] View Inventory");

    // COMPONENT FIELDS
    const [filters, setFilters] = useState({});
    const [results, setResults] = useState([]);

    // FILTER FIELDS
    const [cardName, setCardName] = useState();


    return (
        <div className="container">
            {/* Search Filters */}
            <div className="row">
                <div className="col">
                    <h2>Search Filters</h2>

                    <form>
                        <div className="row align-items-center">
                            <div className="col-2">
                                <label for="inputPassword6" className="col-form-label">Card Name</label>
                            </div>
                            <div className="col-auto">
                                <input type="text" id="inputPassword6" className="form-control" aria-describedby="passwordHelpInline" />
                            </div>
                        </div>

                        <hr />

                        <div className="row align-items-center">
                            <div className="col-2">
                                <label for="inputPassword6" className="col-form-label">Text</label>
                            </div>
                            <div className="col-auto">
                                <input type="text" id="inputPassword6" className="form-control" aria-describedby="passwordHelpInline" />
                            </div>
                        </div>
                        <hr />
                        
                        <div className="row align-items-center">
                            <div className="col-2">
                                <label for="inputPassword6" className="col-form-label">Type Line</label>
                            </div>
                            <div className="col-auto">
                                <input type="text" id="inputPassword6" className="form-control" aria-describedby="passwordHelpInline" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
            <hr />

            {/* Search Results */}
            <div className="row">
                <div className="col-4 mb-3">
                    <a href="#"><img src="https://c1.scryfall.com/file/scryfall-cards/large/front/4/0/408be425-b8a6-4c03-b2a6-7ff7bd6555e0.jpg" alt="" className="img-fluid" /></a>
                </div>
            </div>
        </div>
    );
}

export default ViewInventory;
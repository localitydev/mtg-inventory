import './App.css';

// ROUTER
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

// Routes
import AddToInventory from './Routes/addtoinventory';
import ViewInventory from './Routes/viewInventory';
import CardDetail from './Routes/cardDetail';
import NotFound from './Routes/notFound';

function App() {

    return (
        <div className="App">
            <BrowserRouter>
            <header>
                <div className="px-3 py-2 bg-dark text-white">
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-start">
                            <a href="/" className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
                            <img src="https://images.ctfassets.net/s5n2t79q9icq/3dB5uyWzUH95O1ZPBNNUX5/6cff7c65a809285755ea24b164b6ac65/magic-logo.png" alt="" />
                            </a>
                            <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
                                <li className="mr-5">
                                    <NavLink className="text-white nav-link" to="/">Home</NavLink>
                                </li>
                                <li className="mr-5">
                                    <NavLink className="text-white nav-link" to="/deck-builder">Deck Builder</NavLink>
                                </li>
                                <li className="mr-5">
                                    <NavLink className="text-white nav-link" to="/view-inventory">View Inventory</NavLink>
                                </li>
                                <li>
                                    <NavLink className="text-white nav-link" to="/view-decks">View Decks</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

                <Routes>
                    <Route path='/' element={<AddToInventory />} />
                    <Route path='cardDetail/:scryfallId' element={<CardDetail />} />
                    <Route path='view-inventory' element={<ViewInventory />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
            

        </div>
    );
}

export default App;
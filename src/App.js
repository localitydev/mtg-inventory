import './App.css';

// ROUTER
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

// Routes
import AddToInventory from './Routes/addtoinventory';
import CardDetail from './Routes/cardDetail';
import NotFound from './Routes/notFound';

function App() {

    return (
        <div className="App">
            <BrowserRouter>
            <header>
                <div className="px-3 py-2 bg-dark text-white">
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                            <a href="/" className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
                            <img src="https://images.ctfassets.net/s5n2t79q9icq/3dB5uyWzUH95O1ZPBNNUX5/6cff7c65a809285755ea24b164b6ac65/magic-logo.png" alt="" />
                            </a>
                            <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
                                <li>
                                    <Link className="text-white nav-link" to="/add-to-inventory">Add To Inventory</Link>
                                </li>
                                <li>
                                    <Link className="text-white nav-link" to="/create-a-deck">Create A Deck</Link>
                                </li>
                                <li>
                                    <Link className="text-white nav-link" to="/view-inventory">View Inventory</Link>
                                </li>
                                <li>
                                    <Link className="text-white nav-link" to="/view-decks">View Decks</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

                <Routes>
                    <Route path='/' element={<h1>Homepage</h1>} />
                    <Route path='add-to-inventory' element={<AddToInventory />} />
                    <Route path='cardDetail/:scryfallId' element={<CardDetail />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
            

        </div>
    );
}

export default App;
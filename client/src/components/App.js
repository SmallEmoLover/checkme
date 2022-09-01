import { Outlet } from 'react-router-dom';
import '../styles/App.css';

function App() {
    return (
        <div className="App">
            <div class='header'>
                <h1> Checkme </h1>
            </div>
            <Outlet/>
        </div>
    );
}

export default App;

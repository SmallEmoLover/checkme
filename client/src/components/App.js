import { Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import useAuthorization from '../hooks/useAuthorization';
import '../styles/App.css';
import Authorization from './Authorization';

function App() {
    let authorization = useAuthorization();
    let content;

    if (!authorization.username) {
        content = <Authorization/>
    } else {
        content = <Outlet/>
    }

    return (
        <AuthContext.Provider value={authorization}>
            <div className="App">
                <div className='header'>
                    <h1> Checkme </h1>
                    {authorization.username}
                    <button onClick={() => authorization.signOut()}> Выйти </button>
                </div>
                {content}
            </div>
        </AuthContext.Provider>
    );
}

export default App;

import { useMemo } from 'react';
import { IconContext } from 'react-icons/lib';
import { Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import useAuthorization from '../hooks/useAuthorization';
import '../styles/App.css';
import Authorization from './Authorization';
import Footer from './Footer';
import Header from './Header';

function App() {
    const icons = useMemo(() => ({ className: 'react-icons' }), []);

    const authorization = useAuthorization();
    let content;

    if (!authorization.token) {
        content = <Authorization />;
    } else {
        content = (
            <>
                <div className="app-content">
                    <Header />
                </div>
                <hr />
                <div className="app-content main-page">
                    <Outlet />
                </div>
                <hr />
                <div className="app-content footer">
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <AuthContext.Provider value={authorization}>
            <IconContext.Provider value={icons}>
                <div className="App">
                    {content}
                </div>
            </IconContext.Provider>
        </AuthContext.Provider>
    );
}

export default App;

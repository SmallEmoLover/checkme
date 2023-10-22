import { useMemo, useState } from 'react';
import { IconContext } from 'react-icons/lib';
import { Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import PopupContext from '../context/PopupContext';
import useAuthorization from '../hooks/useAuthorization';
import '../styles/App.css';
import Authorization from './Authorization';
import Popup from './common/Popup';
import Footer from './Footer';
import Header from './Header';

function App() {
    const icons = useMemo(() => ({ className: 'react-icons' }), []);
    const [popups, setPopups] = useState([]);

    const openPopup = (id, props) => {
        setPopups((state) => {
            const newState = [...state];
            newState.push({ id, props });

            return newState;
        });
    };

    const closePopup = (id) => {
        setPopups((state) => state.filter((popup) => popup.id !== id));
    };

    const popupContext = useMemo(() => ({ openPopup, closePopup }), []);

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
        <PopupContext.Provider value={popupContext}>
            <AuthContext.Provider value={authorization}>
                <IconContext.Provider value={icons}>
                    <div className="App">
                        {content}
                        {popups.map((popup) => (
                            <Popup onClose={() => closePopup(popup.id)} {...popup.props} />
                        ))}
                    </div>
                </IconContext.Provider>
            </AuthContext.Provider>
        </PopupContext.Provider>
    );
}

export default App;

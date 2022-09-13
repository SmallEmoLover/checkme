import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../styles/Header.css';

function Header() {
    let authorization = useContext(AuthContext);

    return(
        <div className="Header">
            <div className="navigation">
                <div className="app-title"> Checkme </div>
                <a className='navigation-link' href='/'>
                    Список задач
                </a>
                <a className='navigation-link' href='/'>
                    Мои решения
                </a>
            </div>
            <div className="user">
                {authorization.username}
                <a className='signout' href='/' onClick={() => authorization.signOut()}>Выйти</a>
            </div>
        </div>
    )
}

export default Header;

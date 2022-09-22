import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Header.css';
import AdminRequired from './AdminRequired';

/**
 * Header component with logo and navigation
 */
function Header() {
    let authorization = useContext(AuthContext);

    return(
        <div className="Header">
            <div className="navigation">
                <div className="app-title"> Checkme </div>
                <Link className='navigation-link' to='/'>
                    Список задач
                </Link>
                <Link className='navigation-link' to='/results/me'>
                    Мои решения
                </Link>
                <AdminRequired>
                    <Link className='navigation-link' to='/task/new'>
                        Создать задачу
                    </Link>
                </AdminRequired>
            </div>
            <div className="user">
                {authorization.username}
                <a className='signout' href='/' onClick={() => authorization.signOut()}>Выйти</a>
            </div>
        </div>
    )
}

export default Header;

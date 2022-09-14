import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../styles/Header.css';
import AdminRequired from './AdminRequired';

function Header() {
    let authorization = useContext(AuthContext);

    return(
        <div className="Header">
            <div className="navigation">
                <div className="app-title"> Checkme </div>
                <a className='navigation-link' href='/'>
                    Список задач
                </a>
                <a className='navigation-link' href='/results/me'>
                    Мои решения
                </a>
                <AdminRequired>
                    <a className='navigation-link' href='/task/new'>
                        Создать задачу
                    </a>
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

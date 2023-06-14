import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * A component to hide children elements if username !== 'admin'
 * @param {*} props - expects children elements
 */
function AdminRequired({ children }) {
    const authorization = useContext(AuthContext);
    if (authorization.username === 'admin') {
        return children;
    }
    return null;
}

export default AdminRequired;

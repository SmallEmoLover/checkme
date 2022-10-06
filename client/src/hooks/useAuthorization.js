import useLocalStorage from './useLocalStorage';

/**
 * Hook to manage localStorage authorization fields
 * @returns username, name, surname, token - corresponding strings
 *
 * signOut(): signs out current authorization session
 *
 * authorize(username, token, name, surname): signs in
 */
function useAuthorization() {
    const [username, setUsername] = useLocalStorage('username');
    const [token, setToken] = useLocalStorage('token');
    const [name, setName] = useLocalStorage('name');
    const [surname, setSurname] = useLocalStorage('surname');

    const signOut = () => {
        setToken(null);
        setUsername(null);
        setName(null);
        setSurname(null);
    };

    // eslint-disable-next-line no-shadow
    const authorize = (username, token, name, surname) => {
        setUsername(username);
        setToken(token);
        setName(name);
        setSurname(surname);
    };

    return {
        username,
        name,
        surname,
        token,
        signOut,
        authorize,
    };
}

export default useAuthorization;

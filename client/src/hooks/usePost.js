import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Hook to managing post requests
 * @param {*} url - request url
 * @param {*} onSuccess - callback with actions to perform after succesfull data retrieving
 * @returns {error, loading, doPost}
 */
function usePost(url, onSuccess) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const authorization = useContext(AuthContext);
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const doPost = (body, options = {}) => {
        if (loading) {
            return;
        }
        setLoading(true);

        let fetchOptions = { ...options };
        if (authorization.token) {
            fetchOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    Authentication: `Bearer ${authorization.token}`,
                },
            };
        }
        fetch(serverUrl + url, { body, method: 'POST', ...fetchOptions })
            .then((response) => (
                response.json()
                    .then((json) => (
                        {
                            json,
                            ok: response.ok,
                        }
                    ))
            ))
            .then((parsedResponse) => {
                if (!parsedResponse.ok) {
                    throw parsedResponse.json;
                } else {
                    setError(null);
                    onSuccess(parsedResponse.json);
                }
            })
            .catch((errorJson) => {
                setError(errorJson.error || 'Ошибка соединения с сервером');
            })
            .finally(() => setLoading(false));
    };

    return { error, loading, fetch: doPost };
}

export default usePost;

import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Hook to fetch data from specified url. Fetches data when initializing.
 * @param {string} url - url to fetch from
 * @param {*} options - options to the `fetch` function call
 * @returns {} {data, error, fetch}, where data is server response in json format,
 * error - possible errors,
 * fetch() - function to manually fetch data.
 */
function useFetch(url, options = {}) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const authorization = useContext(AuthContext);
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const doFetch = () => {
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
        fetch(serverUrl + url, fetchOptions)
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
                    setData(parsedResponse.json);
                }
            })
            .catch((errorJson) => {
                setError(errorJson.error || 'Ошибка соединения с сервером');
            });
    };

    useEffect(doFetch, []);

    return { data, error, fetch: doFetch };
}

export default useFetch;

import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Hook to fetch data from specified url. Fetches data when initializing.
 * @param {string} url - url to fetch from
 * @param {*} options - options to the `fetch` function call
 * @returns {} {data, error, fetch}, where data is server response in json format, error - possible errors, 
 * fetch() - function to manually fetch data.
 */
function useFetch(url, options={}) {
    let [data, setData] = useState(null);
    let [error, setError] = useState(null);
    let authorization = useContext(AuthContext);
    const server_url = process.env.REACT_APP_SERVER_URL;

    const doFetch = () => {
        if (authorization.token) {
            options = {
                ...options,
                headers: {
                    ...options.headers,
                    Authentication: `Bearer ${authorization.token}`
                }
            }
        }
        fetch(server_url + url, options)
            .then((response) => {
                return response.json()
                    .then((json) => {
                        return {
                            json: json, 
                            ok: response.ok
                        }
                    }) 
            })
            .then((parsedResponse) => { 
                if (!parsedResponse.ok) {
                    throw parsedResponse.json;
                } else {
                    setData(parsedResponse.json) 
                }
            })
            .catch((errorJson) => {
                setError(errorJson.error || 'Ошибка соединения с сервером');
            });
    };

    useEffect(doFetch, []);

    return {data: data, error: error, fetch: doFetch}
}

export default useFetch;

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
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => setError(error));
    };

    useEffect(doFetch, []);

    return {data: data, error: error, fetch: doFetch}
}

export default useFetch;

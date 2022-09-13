import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Hook to fetch data from specified url once 
 * @param {string} url - url to fetch from
 * @param {*} options - options to the `fetch` function call
 * @returns [data, error], where data is server response in json format, error - possible errors
 */
function useFetch(url, options={}) {
    let [data, setData] = useState(null);
    let [error, setError] = useState(null);
    let authorization = useContext(AuthContext);

    useEffect(() => {
        if (authorization.token) {
            options = {
                ...options,
                headers: {
                    ...options.headers,
                    Authentication: `Bearer ${authorization.token}`
                }
            }
        }
        fetch(url, options)
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => setError(error));
    }, []);

    return [data, error]
}

export default useFetch;

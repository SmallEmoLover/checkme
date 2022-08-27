import { useState } from "react";

// TODO: Handle requests race conditions
function useFetch(init = null) {
    let [data, setData] = useState(init);
    let [isLoading, setLoading] = useState(false);
    let [error, setError] = useState(null);

    const doFetch = (url, options={}) => {
        setLoading(true);
        fetch(url, options)
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }

    return [doFetch, data, isLoading, error]
}

export default useFetch;

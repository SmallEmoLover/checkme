import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Hook to managing post requests
 * @param {*} url - request url
 * @param {*} onSuccess - callback with actions to perform after succesfull data retrieving
 * @returns {error, loading, doPost}
 */
function usePost(url, onSuccess) {
    let [error, setError] = useState(null);
    let [loading, setLoading] = useState(false);
    let authorization = useContext(AuthContext);
    const server_url = process.env.REACT_APP_SERVER_URL;

    const doPost = (body, options = {}) => {
        if (loading) {
            return;
        }
        setLoading(true);
        if (authorization.token) {
            options = {
                ...options,
                headers: {
                    ...options.headers,
                    Authentication: `Bearer ${authorization.token}`
                }
            }
        }
        fetch(server_url + url, { body: body, method: 'POST', ...options })
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
                    setError(null);
                    onSuccess(parsedResponse.json) 
                }
            })
            .catch((errorJson) => {
                setError(errorJson.error || 'Ошибка соединения с сервером');
            })
            .finally(() => setLoading(false));
    }

    return {error: error, loading: loading, fetch: doPost}
}

export default usePost;

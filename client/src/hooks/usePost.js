import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

function usePost(url, onSuccess) {
    let [error, setError] = useState(null);
    let [loading, setLoading] = useState(false);
    let authorization = useContext(AuthContext);

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
        fetch(url, { body: body, method: 'POST', ...options })
            .then((response) => response.json())
            .then((json) =>  onSuccess(json))
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }

    return {error: error, loading: loading, fetch: doPost}
}

export default usePost;

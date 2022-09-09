import { useState } from "react";

function usePost(url, onSuccess) {
    let [error, setError] = useState(null);
    let [loading, setLoading] = useState(false);

    const doPost = (body, headers = {}) => {
        if (loading) {
            return;
        }
        setLoading(true);
        fetch(url, {body: body, headers: headers, method: 'POST' })
            .then((response) => response.json())
            .then((json) =>  onSuccess(json))
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }

    return {error: error, loading: loading, fetch: doPost}
}

export default usePost;

import { useEffect, useState } from "react";

/**
 * Hook to storing localStorage values
 * @param {*} item - name of the localStorage item
 * @returns [localStorageItem, setLocalStorageItem]
 */
function useLocalStorage(item) {
    let [localStorageItem, setLocalStorageItem] = useState(localStorage.getItem(item));

    useEffect(() => {
        if (localStorageItem === '' || localStorageItem === null || localStorageItem === undefined) {
            localStorage.removeItem(item);
        } else {
            localStorage.setItem(item, localStorageItem);
        }
    }, [localStorageItem])

    return [localStorageItem, setLocalStorageItem];
}

export default useLocalStorage;

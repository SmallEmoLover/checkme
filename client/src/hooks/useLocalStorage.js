import { useEffect, useState } from "react";

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

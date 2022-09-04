import { useState } from "react";

function useInput(initial='') {
    let [value, setValue] = useState(initial);
    const onChange = (event) => {
        setValue(event.target.value);
    };

    return [value, onChange];
}

export default useInput;

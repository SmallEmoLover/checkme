import { useState } from "react";

function useMultipleInputs(inputNames, initial='') {
    let [inputValues, setInputValues] = useState({});

    function onChange(input) {
        return (event) => {
            let value = inputValues[input];
            if (event.target.type === 'file') {
                value = event.target.files[0];
            } else {
                value = event.target.value;
            }
            setInputValues({
                ...inputValues,
                [input]: value
            })
        }
    }

    let result = {};

    inputNames.forEach((input) => {
        result[input] = {
            name: input,
            value: inputValues[input] || initial,
            onChange: onChange(input)
        }
    });

    return result;
}

export default useMultipleInputs;

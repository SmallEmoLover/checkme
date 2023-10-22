import { useState } from 'react';

function useInput() {
    const [inputValue, setInputValue] = useState('');

    const onChange = (event) => setInputValue(event.target.value);

    return [inputValue, setInputValue, onChange];
}

export default useInput;

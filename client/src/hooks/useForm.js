import { useRef, useState } from 'react';

/**
 * Hook to managing form at the page
 * @returns [inputValues, addInput]
 * inputValues - object with all inputs values accessible by it name
 *
 * addInput(name, type='text', initial='') - add new input to the hook.
 */
function useForm() {
    const inputs = useRef({});
    const [inputsValues, setInputsValues] = useState({});

    const addInput = (name, type = 'text', initial = '') => {
        if (name in inputs.current) {
            const input = inputs.current[name];
            return {
                type: input.type,
                onChange: input.onChange,
            };
        }

        if (type === 'file') {
            initial = null;
        }
        const onChange = (event) => {
            let value;
            if (type === 'file') {
                [value] = event.target.files;
            } else {
                value = event.target.value;
            }
            setInputsValues((state) => (
                {
                    ...state,
                    [name]: value || initial,
                }
            ));
        };
        setInputsValues((state) => (
            {
                ...state,
                [name]: initial,
            }
        ));
        inputs.current = {
            [name]: {
                type,
                onChange,
            },
            ...inputs.current,
        };
        return { type, onChange };
    };

    return [inputsValues, addInput];
}

export default useForm;

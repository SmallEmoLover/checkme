import '../../styles/AutocompleteInput.css';
import { useState, useEffect } from 'react';
import useInput from '../../hooks/useInput';

function AutocompleteInput({ items, onValueChanged }) {
    const [inputValue, setInputValue, onChange] = useInput();
    const [suggestions, setSuggestions] = useState(items);
    const [showSuggestion, setShowSuggestion] = useState(false);

    useEffect(() => {
        onValueChanged(inputValue);
        setSuggestions(items.filter((item) => item.startsWith(inputValue) && item !== inputValue));
    }, [inputValue]);

    return (
        <div>
            <input
                value={inputValue}
                onChange={
                    (event) => {
                        onChange(event);
                        setShowSuggestion(!!event.target.value);
                    }
                }
            />
            {
                showSuggestion && suggestions?.length ? (
                    <div className="absolute autocomplete-suggestion">
                        { suggestions.map((item) => (
                            <div
                                onClick={
                                    () => {
                                        setInputValue(item);
                                        setShowSuggestion(false);
                                    }
                                }
                                role="button"
                                tabIndex={0}
                            >
                                { item }
                            </div>
                        ))}
                    </div>
                ) : null
            }
        </div>
    );
}

export default AutocompleteInput;

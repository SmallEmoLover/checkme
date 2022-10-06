import { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import '../styles/Accordion.css';

/**
 * Accordion component, containing header and expandable body
 * @param {*} props - set expanded to true to expand body by default
 */
function Accordion({ expanded, header, body }) {
    const [isExpanded, setExpanded] = useState(expanded || false);

    if (!isExpanded) {
        return (
            <div
                className="accordion-header"
                onClick={() => setExpanded(true)}
                role="link"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        setExpanded(true);
                    }
                }}
            >
                {header}
                <BsChevronDown />
            </div>
        );
    }

    return (
        <>
            <div
                className="accordion-header"
                onClick={() => setExpanded(false)}
                role="link"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        setExpanded(true);
                    }
                }}
            >
                {header}
                <BsChevronUp />
            </div>
            {body}
        </>
    );
}

export default Accordion;

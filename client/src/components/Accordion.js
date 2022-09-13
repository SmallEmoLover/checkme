import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import '../styles/Accordion.css'

function Accordion(props) {
    const [isExpanded, setExpanded] = useState(props.expanded || false);

    if (!isExpanded) {
        return (
            <div className="accordion-header" onClick={() => setExpanded(true)}>
                {props.header}
                <BsChevronDown/>
            </div>
        )
    }
    else {
        return (
            <>
                <div className="accordion-header" onClick={() => setExpanded(false)}>
                    {props.header}
                    <BsChevronUp/>
                </div>
                {props.body}
            </>
        )
    }

}

export default Accordion;

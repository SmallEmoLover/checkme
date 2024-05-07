/**
 * Basic button component
 */
function Button({ onClick, label, icon }) {
    return (
        <div role="button" tabIndex={0} onClick={onClick}>
            { icon }
            { label }
        </div>
    );
}

export default Button;

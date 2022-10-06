import '../styles/Loading.css';

/**
 * Component to set loading container with spinning circle
 * @param {*} props - set props.isLoading to false to disable component,
 * set props.description to show description under the spinning circle
 */
function Loading({ isLoading, description }) {
    if (isLoading === false) {
        return null;
    }
    return (
        <div className="Loading">
            <div className="loading-circle" />
            <div> {description} </div>
        </div>
    );
}

export default Loading;

import '../styles/Loading.css'

/**
 * Component to set loading container with blur and spinning circle 
 * @param {*} props - set props.isLoading to false to disable component,
 * set props.description to show description under the spinning circle
 */
function Loading(props) {
    if (props.isLoading === false) {
        return null;
    } else {
        return (
            <div className='Loading'>
                <div className='loadingCircle'/>
                <div> {props.description} </div>
            </div>
        )
    }
}

export default Loading;

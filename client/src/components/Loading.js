import '../styles/Loading.css'

/**
 * Component to set loading container with blur and spinning circle 
 * @param {*} props - set props.isLoading to false to disable component
 */
function Loading(props) {
    if (props.isLoading === false) {
        return null;
    } else {
        return (
            <div className='Loading'>
                <div className='loadingCircle'/>
            </div>
        )
    }
}

export default Loading;

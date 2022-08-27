import '../styles/Loading.css'

function Loading(props) {
    if (!props.isLoading) {
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

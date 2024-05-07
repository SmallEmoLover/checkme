import useFetch from '../../hooks/useFetch';
import ErrorMessage from '../ErrorMessage';
import Loading from '../Loading';

/**
 * Basic HOC what handles fetching data from the server
 * Handles displaying loading circle / errors
 */
function withFetch(Component, endpoint) {
    return function WrappedComponent(props) {
        const fetch = useFetch(endpoint);

        if (fetch.error) {
            return <ErrorMessage message={fetch.error} />;
        }

        if (fetch.isLoading) {
            return <Loading description="Получаем ваши данные!" />;
        }

        return <Component fetchData={fetch.data} {...props} />;
    };
}

export default withFetch;

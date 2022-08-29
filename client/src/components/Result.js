import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "./Loading";

/**
 * Component to show single check results
 * @param - requires url param checkId
 */
function Result() {
    let params = useParams();
    let [result, error] = useFetch(`http://localhost:9999/results/${params.checkId}`);

    if (!result) {
        return <Loading/>
    }

    return (
        <div>
            {result.result}
        </div>
    )
}

export default Result;

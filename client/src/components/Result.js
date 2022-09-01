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
        return <Loading description='Получаем ваши результаты'/>
    }

    let content = null;

    if (result.status === 'В процессе') {
        content = (
            <div>
                Ваша задача ещё проверяется
            </div>
        )
    } else {
        content = (
            <div>
                <h3> {result.status} </h3>
                {Object.keys(result.result).map((key) => {
                    let criteria = result.result[key];
                    return (
                        <div> {key}: {criteria.score}, {criteria.message} </div>
                    )
                })}
            </div>
        )
    }
    return (
        <div>
            <h2> Результаты задачи </h2>
            {content}
        </div>
    )
}

export default Result;

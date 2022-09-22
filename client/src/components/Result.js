import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "./Loading";
import '../styles/Result.css'
import { useEffect } from "react";

/**
 * Component to show single check results
 * @param - requires url param checkId
 */
function Result() {
    let params = useParams();
    let fetchCheck = useFetch(`/results/${params.checkId}`);

    useEffect(() => {
        if (fetchCheck.data && fetchCheck.data.status !== 'Проверено') {
            setTimeout(() => fetchCheck.fetch(), 5000)
        }
    }, [fetchCheck.data])

    if (!fetchCheck.data) {
        return <Loading description='Получаем ваши результаты'/>
    }

    const countTotalScore = () => {
        return Object.values(fetchCheck.data.result).reduce((acc, criteria) => {
            return acc + criteria.score;
        }, 0)
    }

    if (fetchCheck.data.status !== 'Проверено') {
        return (
            <div>
                {fetchCheck.data.status}
            </div>
        )
    } else {
        return (
            <div>
                <h2> Результат: {countTotalScore()} </h2>
                <div className="criteria-list">
                    <div className="criteria-message">
                        <b> Критерий </b>
                    </div>
                    <div className="criteria-score">
                        <b> Баллы </b>
                    </div>
                </div> 
                {Object.keys(fetchCheck.data.result).map((key) => {
                    let criteria = fetchCheck.data.result[key];
                    return (
                        <div key={key} className='criteria-list'> 
                            <div className={criteria.score > 0 ? 'criteria-message criteria-passed' : 'criteria-failed criteria-message'}>
                                {criteria.message}
                            </div>
                            <div className="criteria-score">
                                {criteria.score}
                            </div> 
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Result;

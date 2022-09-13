import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "./Loading";
import '../styles/Result.css'

/**
 * Component to show single check results
 * @param - requires url param checkId
 */
function Result() {
    let params = useParams();
    let [checkResult, error] = useFetch(`/results/${params.checkId}`);

    if (!checkResult) {
        return <Loading description='Получаем ваши результаты'/>
    }

    const countTotalScore = () => {
        return Object.values(checkResult.result).reduce((acc, criteria) => {
            return acc + criteria.score;
        }, 0)
    }

    if (checkResult.status !== 'Проверено') {
        return (
            <div>
                {checkResult.status}
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
                {Object.keys(checkResult.result).map((key) => {
                    let criteria = checkResult.result[key];
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

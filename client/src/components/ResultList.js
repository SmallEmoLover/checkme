import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "./Loading";

/**
 * Component with all check results made by currently logged user
 */
function ResultList() {
    const fetchResults = useFetch('/results');
    const navigate = useNavigate();

    if (fetchResults.error) {
        return <ErrorMessage message={fetchResults.error}/>
    }

    if (!fetchResults.data) {
        return <Loading description='Получаем ваши решения'/>
    }

    return(
        <div>
            <h2> Решения </h2> 
            {fetchResults.data.map((result) => {
                return (
                    <div onClick={() => navigate(`/results/${result._id}`)} className="block">
                        <div className=""> {result.task.name} </div>
                        {result.status} - {(new Date(result.date)).toLocaleTimeString()}
                    </div>
                )
            })}
        </div>
    )
}

export default ResultList;

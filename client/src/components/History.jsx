import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import formatDate from '../utils/utils';
import AdminRequired from './AdminRequired';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';

function History() {
    const params = useParams();
    const fetchResults = useFetch(`/history/${params.page}`);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [params.page]);

    if (fetchResults.error) {
        return <ErrorMessage message={fetchResults.error} />;
    }

    if (fetchResults.isLoading) {
        return <Loading description="Получаем решения студентов" />;
    }

    const countTotalScore = (check) => {
        if (!check.result) {
            return 0;
        }
        return Object.values(check.result)
            .reduce((acc, criteria) => acc + criteria.score, 0);
    };

    return (
        <AdminRequired>
            <div>
                <h2> История попыток </h2>
                {fetchResults.data.map((result) => (
                    <div
                        key={result._id}
                        role="link"
                        tabIndex={0}
                        onClick={() => navigate(`/results/${result._id}`)}
                        className="block"
                    >
                        <div className="">
                            <b> {result.task.name} </b>
                            - {result.user.name} {result.user.surname}
                        </div>
                        <div>
                            {result.status} - {formatDate(result.date)}
                        </div>
                        {countTotalScore(result)} баллов
                    </div>
                ))}
                <button
                    className="navigation-buttons"
                    disabled={params.page <= 1}
                    onClick={() => navigate(`/history/${Number(params.page) - 1}`)}
                >
                    {'<'}-
                </button>
                <button
                    className="navigation-buttons"
                    disabled={fetchResults.data.length < 10}
                    onClick={() => navigate(`/history/${Number(params.page) + 1}`)}
                >
                    -{'>'}
                </button>
            </div>
        </AdminRequired>
    );
}

export default History;

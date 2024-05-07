import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import Loading from '../Loading';
import './Task.css';
import useForm from '../../hooks/useForm';
import usePost from '../../hooks/usePost';
import Accordion from '../Accordion';
import Markdown from '../Markdown';
import AdminRequired from '../AdminRequired';
import ErrorMessage from '../ErrorMessage';

/**
 * Component to show single task with form to send solution
 * @param - requires url param taskId
 */
function Task() {
    const params = useParams();
    const navigate = useNavigate();
    const [inputsValues, addInput] = useForm();
    const fetchTask = useFetch(`/task/${params.taskId}`);
    const postAnswer = usePost(
        `/check/${params.taskId}`,
        (data) => navigate(`/results/${data.checkId}`),
    );
    const deleteTask = usePost(
        `/task/${params.taskId}`,
        () => navigate('/'),
    );

    if (fetchTask.error) {
        return <ErrorMessage message={fetchTask.error} />;
    }

    if (!fetchTask.data) {
        return <Loading description="Получаем вашу задачу" />;
    }

    const onSubmit = () => {
        const formData = new FormData();
        fetchTask.data.answerFormat.forEach((answer, index) => {
            if (answer.type === 'file') {
                formData.append(index, inputsValues[answer.name][0], index);
            } else {
                formData.append(index, inputsValues[answer.name]);
            }
        });
        postAnswer.fetch(formData);
    };

    const isInputsFilled = () => Object.values(inputsValues).every((value) => value);

    return (
        <div>
            <h2>
                {' '}
                {fetchTask.data.name}
                {' '}
            </h2>
            <Accordion
                expanded
                header={<h3> Описание </h3>}
                body={<Markdown text={fetchTask.data.description} />}
            />
            <h3> Ваш ответ </h3>
            <div className="answers-list">
                {fetchTask.data.answerFormat.map((argument) => (
                    <div key={argument.name} className="block answers-box">
                        <div className="answers-name"> {argument.name} </div>
                        <div className="answers-input">
                            <input
                                key={argument.name}
                                {...addInput(argument.name, argument.type)}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <button disabled={!isInputsFilled()} onClick={onSubmit}> Отправить </button>
            <AdminRequired>
                <button className="warning-button" onClick={() => deleteTask.fetch({}, { method: 'DELETE' })}>
                    Удалить задачу
                </button>
            </AdminRequired>
            <ErrorMessage message={deleteTask.error || postAnswer.error} />
        </div>
    );
}

export default Task;

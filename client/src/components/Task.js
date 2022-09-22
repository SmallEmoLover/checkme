import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "./Loading";
import '../styles/Task.css'
import useForm from "../hooks/useForm";
import usePost from "../hooks/usePost";
import Accordion from "./Accordion";

/**
 * Component to show single task with form to send solution
 * @param - requires url param taskId
 */
function Task() {
    let params = useParams();
    let navigate = useNavigate();
    let [inputsValues, addInput] = useForm();
    let fetchTask = useFetch(`/task/${params.taskId}`);
    let postAnswer = usePost(
        `/check/${params.taskId}`,
        (data) => navigate(`/results/${data.checkId}`)
    );

    if (!fetchTask.data) {
        return <Loading description='Получаем вашу задачу'/>;
    }

    const onSubmit = () => {
        let formData = new FormData();
        fetchTask.data.answerFormat.forEach((answer, index) => {
            if (answer.type === 'file') {
                formData.append(index, inputsValues[answer.name], index)
            } else {
                formData.append(index, inputsValues[answer.name]);
            }
        })
        postAnswer.fetch(formData);
    }

    const isInputsFilled = () => {
        return Object.values(inputsValues).every((value) => value);
    }

    return (
        <div>
            <h2> {fetchTask.data.name} </h2>
            <Accordion 
                expanded={true}
                header={<h3> Описание </h3>}
                body={<div className="task-description"> {fetchTask.data.description} </div>}
            />
            <h3> Ваш ответ </h3>
            <div className="answers-list">
                {fetchTask.data.answerFormat.map((argument) => {
                    return (
                        <div key={argument.name} className='block answers-box'>
                            <div className='answers-name'> {argument.name} </div>
                            <div className='answers-input'>
                                <input key={argument.name} {...addInput(argument.name, argument.type)} />
                            </div>
                        </div>
                    )
                })}
            </div> 
            <button disabled={!isInputsFilled()} onClick={onSubmit}> Отправить </button>
        </div>
    )
}

export default Task;

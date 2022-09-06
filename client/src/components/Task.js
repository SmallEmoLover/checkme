import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "./Loading";
import '../styles/Task.css'
import useForm from "../hooks/useForm";

/**
 * Component to show single task with form to send solution
 * @param - requires url param taskId
 */
function Task() {
    let params = useParams();
    let navigate = useNavigate();
    let [inputsValues, addInput] = useForm();
    let [task, error] = useFetch(`http://localhost:9999/task/${params.taskId}`);

    if (!task) {
        return <Loading description='Получаем вашу задачу'/>;
    }

    const sendAnswer = () => {
        let formData = new FormData();
        task.answerFormat.forEach((answer, index) => {
            if (answer.type === 'file') {
                formData.append(index, inputsValues[answer.name], index)
            } else {
                formData.append(index, inputsValues[answer.name]);
            }
        })
        fetch(`http://localhost:9999/check/${params.taskId}`, {
                method: 'POST',
                body: formData
            }).then((response) => response.json())
            .then((data) => navigate(`/results/${data.checkId}`));
    }

    const isInputsFilled = () => {
        return Object.values(inputsValues).every((value) => value);
    }

    return (
        <div>
            <h2> {task.name} </h2>
            <div> {task.description} </div>
            {task.answerFormat.map((argument) => {
                return (
                    <div key={argument.name} className='argumentBox'>
                        <div className='argumentName'> {argument.name} </div>
                        <div className='argumentInput'>
                            <input key={argument.name} {...addInput(argument.name, argument.type)} />
                        </div>
                    </div>
                )
            })}
            <button disabled={!isInputsFilled()} onClick={sendAnswer}> Отправить </button>
        </div>
    )
}

export default Task;

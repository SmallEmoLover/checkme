import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "./Loading";
import '../styles/Task.css'

/**
 * Component to show single task with form to send solution
 * @param - requires url param taskId
 */
function Task() {
    let params = useParams();
    let navigate = useNavigate();
    let [inputValues, setInputValues] = useState({});
    let [task, error] = useFetch(`http://localhost:9999/task/${params.taskId}`);

    if (!task) {
        return <Loading description='Получаем вашу задачу'/>;
    }

    const onInputChange = (event) => {
        let input = event.target;
        setInputValues({
            ...inputValues,
            [input.name]: input.value
        });
    }

    // TODO: Check for empty-string inputs when sending answer
    const sendAnswer = (event) => {
        fetch(`http://localhost:9999/check/${params.taskId}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({arguments: Object.values(inputValues)})
            })
            .then((response) => response.json())
            .then((data) => navigate(`/results/${data.checkId}`));
        event.preventDefault();
    }

    return (
        <div>
            <h2> {task.name} </h2>
            <div> {task.description} </div>
            {task.answer_format.map((argument) => {
                return (
                    <div key={argument.name} className='argumentBox'>
                        <div className='argumentName'> {argument.name} </div>
                        <div className='argumentInput'>
                            <input key={argument.name} 
                                name={argument.name} 
                                value={inputValues[argument.name]}
                                type={argument.type} 
                                onChange={onInputChange}/>
                        </div>
                    </div>
                )
            })}
            <button onClick={sendAnswer}> Отправить </button>
        </div>
    )
}

export default Task;

import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "./Loading";
import '../styles/Task.css'
import useMultipleInputs from "../hooks/useMultipleInputs";

/**
 * Component to show single task with form to send solution
 * @param - requires url param taskId
 */
function Task() {
    let params = useParams();
    let navigate = useNavigate();
    let [task, error] = useFetch(`http://localhost:9999/task/${params.taskId}`);
    let answerInputs = useMultipleInputs(
        task?.answerFormat.map((answer) => answer.name) 
        || []
    );

    if (!task) {
        return <Loading description='Получаем вашу задачу'/>;
    }

    const isAllInputsFilled = () => {
        let values = Object.values(answerInputs);
        if (values.length === 0) {
            return false;
        }
        for (let input of values) {
            if (!input.value) {
                return false;
            }
        }
        return true;
    }

    const sendAnswer = () => {
        let formData = new FormData();
        task.answerFormat.forEach((answer, index) => {
            if (answer.type === 'file') {
                formData.append(index, answerInputs[answer.name].value, index)
            } else {
                formData.append(index, answerInputs[answer.name].value);
            }
        })
        fetch(`http://localhost:9999/check/${params.taskId}`,
            {
                method: 'POST',
                body: formData
            })
            .then((response) => response.json())
            .then((data) => navigate(`/results/${data.checkId}`));
    }

    return (
        <div>
            <h2> {task.name} </h2>
            <div> {task.description} </div>
            {task.answerFormat.map((argument) => {
                let input = answerInputs[argument.name];
                let htmlInput = null;
                if (argument.type === 'file') {
                    htmlInput = <input key={argument.name} 
                                    name={argument.name} 
                                    type={argument.type} 
                                    onChange={input.onChange}/>
                } else {
                    htmlInput = <input key={argument.name} 
                                    name={argument.name} 
                                    type={argument.type} 
                                    onChange={input.onChange}/>
                }
                return (
                    <div key={argument.name} className='argumentBox'>
                        <div className='argumentName'> {argument.name} </div>
                        <div className='argumentInput'>
                            { htmlInput }
                        </div>
                    </div>
                )
            })}
            <button disabled={!isAllInputsFilled()} onClick={sendAnswer}> Отправить </button>
        </div>
    )
}

export default Task;

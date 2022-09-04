import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import useMultipleInputs from '../hooks/useMultipleInputs';
import '../styles/TaskForm.css'

function TaskForm() {
    let navigate = useNavigate();

    let [criterionsJson, onJsonChange] = useInput('{\n  \n}');
    let [criterions, setCriterions] = useState([]);
    let criterionsInputs = useMultipleInputs(criterions);

    let [name, onNameChange] = useInput();

    let [description, onDescriptionChange] = useInput();

    let [answersFormat, setAnswersFormat] = useState(['answer1']);
    let answersInputs = useMultipleInputs(answersFormat);
    let answersTypeInputs = useMultipleInputs(answersFormat, 'text');

    useEffect(() => {
        try {
            setCriterions(parseCriterionsJson(criterionsJson));
        } catch(e) {
            setCriterions([]);
        }
    }, [criterionsJson])

    const sendTask = () => {
        let formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('criterions', criterionsJson);
        formData.append('answer_format', JSON.stringify(
            answersFormat.map((answer) => {
                return { name: answersInputs[answer].value, type: answersTypeInputs[answer].value }
            })
        ));
        criterions.forEach((criterion) => {
            let file = document.getElementsByName(criterion)[0].files[0];
            formData.append(criterion, file, criterion);
        });
        fetch('http://localhost:9999/task/new', {
            method: 'POST',
            body: formData,
        }).then((response) => response.json()).then((data) => navigate(`/task/${data.taskId}`));
    };

    const isFormDataReady = () => {
        return name && 
            description && 
            isAllInputsFilled(criterionsInputs) && 
            isAllInputsFilled(answersInputs);
    };

    return (
        <div>
            <h2> Создание задачи </h2>
            <h3> Название </h3>
            <input value={name} onChange={onNameChange}/>
            <h3> Описание </h3>
            <input value={description} onChange={onDescriptionChange}/>
            <h3> Формат ответа </h3>
            {answersFormat.map((answer) => {
                let input = answersInputs[answer];
                let typeChooser = answersTypeInputs[answer];
                return (
                    <div>
                        <input value={input.value} onChange={input.onChange}/>
                        <select value={typeChooser.value} onChange={typeChooser.onChange}>
                            <option value='text'> Текст </option>
                            <option value='file'> Файл </option>
                        </select>
                    </div>
                )
            })}
            <button onClick={() => {setAnswersFormat((state) => [...state, `answer${state.length + 1}`])}}> 
                Добавить вопрос 
            </button>
            <h3> JSON с критериями задачи </h3>
            <textarea value={criterionsJson} onChange={onJsonChange}/>
            <h3> Файлы тестов: </h3>
            {criterions.map((criterion) => {
                let input = criterionsInputs[criterion];
                return (
                    <div className='criterionInputBox'> 
                        <div className='criterionName'>
                            {criterion}
                        </div>
                        <div className='criterionFileInput'>
                            <input name={criterion} onChange={input.onChange} type='file'/>
                        </div>
                    </div>
                )
            })}
            <button disabled={!isFormDataReady()} onClick={sendTask}> Отправить </button>
        </div>
    )
}

function parseCriterionsJson(criterions) {
    let json = JSON.parse(criterions);
    let result = [];
    for (let data of Object.values(json)) {
        if (data.test) {
            result.push(data.test);
        }
    }
    return result;
}

function isAllInputsFilled(inputs) {
    let values = Object.values(inputs);
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

export default TaskForm;

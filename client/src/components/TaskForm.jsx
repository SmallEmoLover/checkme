import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import usePost from '../hooks/usePost';
import '../styles/TaskForm.css';
import AdminRequired from './AdminRequired';
import ErrorMessage from './ErrorMessage';

function parseCriterionsJson(criterions) {
    const json = JSON.parse(criterions);
    const result = [];
    for (const data of Object.keys(json)) {
        if (json[data].test) {
            result.push(data);
        }
    }
    return result;
}

/**
 * Component-form to send new task to server.
 * Available only for admin user
 */
function TaskForm() {
    const navigate = useNavigate();
    const [inputsValues, addInput] = useForm();
    const [criterions, setCriterions] = useState([]);
    const [answersFormat, setAnswersFormat] = useState(['answer1']);
    const taskPost = usePost(
        '/task/new',
        (data) => navigate(`/task/${data.taskId}`),
    );

    useEffect(() => {
        try {
            setCriterions(parseCriterionsJson(inputsValues.criterionsJson));
        } catch (e) {
            setCriterions([]);
        }
    }, [inputsValues.criterionsJson]);

    const onSubmit = () => {
        const formData = new FormData();
        formData.append('name', inputsValues.name);
        formData.append('description', inputsValues.description);

        const correctedCriterions = JSON.parse(inputsValues.criterionsJson);
        for (const criterion of Object.keys(correctedCriterions)) {
            if (correctedCriterions[criterion].test) {
                correctedCriterions[criterion].test = inputsValues[`${criterion}_file`];
            }
        }
        formData.append('criterions', JSON.stringify(correctedCriterions));
        formData.append('answerFormat', JSON.stringify(
            answersFormat.map((answer) => (
                { name: inputsValues[answer], type: inputsValues[`${answer}Type`] }
            )),
        ));
        inputsValues.files.forEach((file) => {
            formData.append(file.name, file, file.name);
        });
        if (inputsValues.additional_files) {
            formData.append('additional', inputsValues.additional_files);
        }
        taskPost.fetch(formData);
    };

    const isFormDataReady = () => {
        const inputNames = criterions.map((criterion) => `${criterion}_file`)
            .concat(answersFormat, ['name', 'description', 'criterionsJson']);
        return criterions.length !== 0 && inputNames.every((input) => inputsValues[input]);
    };

    return (
        <AdminRequired>
            <h2> ???????????????? ???????????? </h2>
            <h3> ???????????????? </h3>
            <input {...addInput('name')} />
            <h3> ???????????????? </h3>
            <textarea {...addInput('description', null)} />
            <h3> ???????????? ???????????? </h3>
            {answersFormat.map((answer) => (
                <div key={answer}>
                    <input {...addInput(answer)} />
                    <select {...addInput(`${answer}Type`, null, 'text')}>
                        <option value="text"> ?????????? </option>
                        <option value="file"> ???????? </option>
                    </select>
                </div>
            ))}
            <button onClick={() => { setAnswersFormat((state) => [...state, `answer${state.length + 1}`]); }}>
                ???????????????? ????????????
            </button>
            <h3> JSON ?? ???????????????????? ???????????? </h3>
            <textarea {...addInput('criterionsJson', null, '{\n  \n}')} />
            <h3> ?????????? ???????????? </h3>
            <div>
                <input multiple="multiple" {...addInput('files', 'file')} />
            </div>
            <h3> ???????????????????? ???????? ?? ?????????????????????? ???????????? </h3>
            {criterions.sort().map((criterion) => (
                <div key={criterion} className="criterion-select">
                    <div className="criterion-select-label"> {criterion} </div>
                    <select
                        {...addInput(`${criterion}_file`, null, '')}
                        className="criterion-select-input"
                    >
                        <option value=""> ???? ?????????????? </option>
                        {inputsValues.files?.sort()?.map((file) => (
                            <option key={file.name} value={file.name}> {file.name} </option>
                        ))}
                    </select>
                </div>
            ))}
            <h3> ?????????? ?? ?????????????????????????????? ?????????????? </h3>
            <div className="criterion-select">
                <div className="criterion-select-label"> ?????????? (.zip) </div>
                <select
                    {...addInput('additional_files', null, '')}
                    className="criterion-select-input"
                >
                    <option value=""> ?????? ???????????? </option>
                    {inputsValues.files
                        ?.sort()
                        ?.filter((file) => (
                            file.name.endsWith('.zip')
                        ))?.map?.((file) => (
                            <option key={file.name} value={file.name}> {file.name} </option>
                        ))}
                </select>
            </div>
            <button disabled={!isFormDataReady()} onClick={onSubmit}> ?????????????????? </button>
            <ErrorMessage message={taskPost.error} />
        </AdminRequired>
    );
}

export default TaskForm;

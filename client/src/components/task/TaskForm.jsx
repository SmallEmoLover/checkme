import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import usePost from '../../hooks/usePost';
import './TaskForm.css';
import AdminRequired from '../AdminRequired';
import ErrorMessage from '../ErrorMessage';

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
    const [isDBTask, setIsDBTask] = useState(false);
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
        formData.append('isDBTask', isDBTask);

        if (isDBTask) {
            formData.append('dbType', inputsValues.dbType);
        }

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
        ['dbPrepare', 'additional_files', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll'].forEach((inputName) => {
            if (inputsValues[inputName]) {
                formData.append(inputName, inputsValues[inputName]);
            }
        });
        taskPost.fetch(formData);
    };

    const isFormDataReady = () => {
        const inputNames = criterions.map((criterion) => `${criterion}_file`)
            .concat(answersFormat, ['name', 'description', 'criterionsJson']);
        return criterions.length !== 0 && inputNames.every((input) => inputsValues[input]);
    };

    return (
        <AdminRequired>
            <h2> Создание задачи { isDBTask ? 'проверки БД' : '' } </h2>
            <button onClick={() => { setIsDBTask((state) => !state); }}>
                { isDBTask ? 'Переключиться на создание обычной проверки' : 'Переключиться на создание проверки БД' }
            </button>
            <h3> Название </h3>
            <input {...addInput('name')} />
            <h3> Описание </h3>
            <textarea {...addInput('description', null)} />
            { isDBTask && (
                <>
                    <h3> База данных </h3>
                    <select {...addInput('dbType', null, 'postgres')}>
                        <option value="text"> postgres </option>
                        <option value="file"> mysql </option>
                    </select>
                </>
            ) }
            <h3> Формат ответа </h3>
            {answersFormat.map((answer) => (
                <div key={answer}>
                    <input {...addInput(answer)} />
                    <select {...addInput(`${answer}Type`, null, 'file')}>
                        <option value="file"> Файл </option>
                        { !isDBTask && <option value="text"> Текст </option> }
                    </select>
                </div>
            ))}
            <button onClick={() => { setAnswersFormat((state) => [...state, `answer${state.length + 1}`]); }}>
                Добавить вопрос
            </button>
            <h3> JSON с критериями задачи </h3>
            <textarea {...addInput('criterionsJson', null, '{\n  \n}')} />
            <h3> Файлы тестов </h3>
            <div>
                <input multiple="multiple" {...addInput('files', 'file')} />
                {
                    isDBTask ? (
                        <div className="criterion-select">
                            <div className="criterion-select-label"> Файл подготовки БД: </div>
                            <select
                                {...addInput('dbPrepare', null, '')}
                                className="criterion-select-input"
                            >
                                <option value=""> Не выбрано </option>
                                {inputsValues.files?.sort()?.map((file) => (
                                    <option key={file.name} value={file.name}>
                                        {file.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <>
                            <div className="criterion-select">
                                <div className="criterion-select-label"> Выполнять перед каждым тестом: </div>
                                <select
                                    {...addInput('beforeEach', null, '')}
                                    className="criterion-select-input"
                                >
                                    <option value=""> Не выбрано </option>
                                    {inputsValues.files?.sort()?.map((file) => (
                                        <option key={file.name} value={file.name}>
                                            {file.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="criterion-select">
                                <div className="criterion-select-label"> Выполнять после каждого теста: </div>
                                <select
                                    {...addInput('afterEach', null, '')}
                                    className="criterion-select-input"
                                >
                                    <option value=""> Не выбрано </option>
                                    {inputsValues.files?.sort()?.map((file) => (
                                        <option key={file.name} value={file.name}>
                                            {file.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="criterion-select">
                                <div className="criterion-select-label"> Выполнить перед тестами: </div>
                                <select
                                    {...addInput('beforeAll', null, '')}
                                    className="criterion-select-input"
                                >
                                    <option value=""> Не выбрано </option>
                                    {inputsValues.files?.sort()?.map((file) => (
                                        <option key={file.name} value={file.name}>
                                            {file.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="criterion-select">
                                <div className="criterion-select-label"> Выполнять после тестов: </div>
                                <select
                                    {...addInput('afterAll', null, '')}
                                    className="criterion-select-input"
                                >
                                    <option value=""> Не выбрано </option>
                                    {inputsValues.files?.sort()?.map((file) => (
                                        <option key={file.name} value={file.name}>
                                            {file.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )
                }

            </div>
            <h3> Соотнесите тест с запускаемым файлом </h3>
            {criterions.sort().map((criterion) => (
                <div key={criterion} className="criterion-select">
                    <div className="criterion-select-label"> {criterion} </div>
                    <select
                        {...addInput(`${criterion}_file`, null, '')}
                        className="criterion-select-input"
                    >
                        <option value=""> Не выбрано </option>
                        {inputsValues.files?.sort()?.map((file) => (
                            <option key={file.name} value={file.name}> {file.name} </option>
                        ))}
                    </select>
                </div>
            ))}
            { !isDBTask && (
                <>
                    <h3> Архив с дополнительными файлами </h3>
                    <div className="criterion-select">
                        <div className="criterion-select-label"> Архив (.zip) </div>
                        <select
                            {...addInput('additional_files', null, '')}
                            className="criterion-select-input"
                        >
                            <option value=""> Без архива </option>
                            {inputsValues.files
                                ?.sort()
                                ?.filter((file) => (
                                    file.name.endsWith('.zip')
                                ))?.map?.((file) => (
                                    <option key={file.name} value={file.name}> {file.name} </option>
                                ))}
                        </select>
                    </div>
                </>
            )}
            <button disabled={!isFormDataReady()} onClick={onSubmit}> Отправить </button>
            <ErrorMessage message={taskPost.error} />
        </AdminRequired>
    );
}

export default TaskForm;

import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import useForm from "../hooks/useForm";
import usePost from "../hooks/usePost";

function SignUp() {
    const [inputValues, addInput] = useForm();
    const authorization = useContext(AuthContext);
    const postCredentials = usePost(
        'http://localhost:9999/sign_up',
        (authData) => {
            authorization.authorize(
                authData.username,
                authData.token,
                authData.name,
                authData.surname
            )
        }
    )

    const onSingUpClick = () => {
        postCredentials.fetch(
            JSON.stringify({
                username: inputValues.username,
                name: inputValues.name,
                surname: inputValues.surname,
                password: inputValues.password
            }),
            { 'Content-Type': 'application/json' }
    )}

    return(
        <div>
            <h2> Регистрация </h2>
            <h3> Логин </h3>
            <input {...addInput('username')}/>
            <h3> Имя </h3>
            <input {...addInput('name')}/>
            <h3> Фамилия </h3>
            <input {...addInput('surname')}/>
            <h3> Пароль </h3>
            <input {...addInput('password', 'password')}/>
            <h3> Подтвердите пароль </h3>
            <input {...addInput('confirmation', 'password')}/>
            <button disabled={postCredentials.isLoading} onClick={onSingUpClick}> Зарегистрироваться </button>
        </div>
    )
}

export default SignUp;

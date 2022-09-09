import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import useForm from "../hooks/useForm";
import usePost from "../hooks/usePost";

function SingIn() {
    const [inputValues, addInput] = useForm();
    const authorization = useContext(AuthContext);
    const postCredentials = usePost(
        'http://localhost:9999/sign_in',
        (authData) => {
            authorization.authorize(
                authData.username,
                authData.token,
                authData.name,
                authData.surname
            )
        }
    )

    const onSingInClick = () => {
        postCredentials.fetch(
            JSON.stringify({
                username: inputValues.username,
                password: inputValues.password,
            }),
            { 'Content-Type': 'application/json' }
    )}

    return(
        <div>
            <h2> Вход </h2>
            <h3> Логин </h3>
            <input {...addInput('username')}/>
            <h3> Пароль </h3>
            <input {...addInput('password', 'password')}/>
            <button disabled={postCredentials.isLoading} onClick={onSingInClick}> Войти </button>
        </div>
    )
}

export default SingIn;

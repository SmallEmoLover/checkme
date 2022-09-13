import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import useForm from "../hooks/useForm";
import usePost from "../hooks/usePost";

function SingIn(props) {
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
            { headers: {'Content-Type': 'application/json'} }
    )}

    return(
        <div>
            <h2> Вход </h2>
            <p> Логин </p>
            <input {...addInput('username')}/>
            <p> Пароль </p>
            <input {...addInput('password', 'password')}/>
            <div className="authorization-buttons-panel">
                <button disabled={postCredentials.isLoading} onClick={onSingInClick}>
                    Войти 
                </button>
                {props.modeToggle}
            </div>
        </div>
    )
}

export default SingIn;

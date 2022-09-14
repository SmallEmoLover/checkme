import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import useForm from "../hooks/useForm";
import usePost from "../hooks/usePost";

/**
 * Component with sing up form
 * @param {*} props - expects modeToggle component with button to 
 * toggle between sing form up and sing in form
 */
function SignUp(props) {
    const [inputValues, addInput] = useForm();
    const authorization = useContext(AuthContext);
    const postCredentials = usePost(
        '/sign_up',
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
            { headers: {'Content-Type': 'application/json' } }
    )}

    return(
        <div>
            <h2> Регистрация </h2>
            <p> Логин </p>
            <input {...addInput('username')}/>
            <p> Имя </p>
            <input {...addInput('name')}/>
            <p> Фамилия </p>
            <input {...addInput('surname')}/>
            <p> Пароль </p>
            <input {...addInput('password', 'password')}/>
            <p> Подтвердите пароль </p>
            <input {...addInput('confirmation', 'password')}/>
            <div className="authorization-buttons-panel">
                <button disabled={postCredentials.isLoading} onClick={onSingUpClick}> 
                    Зарегистрироваться 
                </button>
                {props.modeToggle}
            </div>
        </div>
    )
}

export default SignUp;

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import useForm from '../hooks/useForm';
import usePost from '../hooks/usePost';
import ErrorMessage from './ErrorMessage';

/**
 * Component with sing in form
 * @param {*} props - expects modeToggle component with button to
 * toggle between sing form up and sing in form
 */
function SingIn({ modeToggle }) {
    const [inputValues, addInput] = useForm();
    const authorization = useContext(AuthContext);
    const postCredentials = usePost(
        '/sign_in',
        (authData) => {
            authorization.authorize(
                authData.username,
                authData.token,
                authData.name,
                authData.surname,
            );
        },
    );

    const onSingInClick = () => {
        postCredentials.fetch(
            JSON.stringify({
                username: inputValues.username,
                password: inputValues.password,
            }),
            { headers: { 'Content-Type': 'application/json' } },
        );
    };

    return (
        <div>
            <h2> Вход </h2>
            <ErrorMessage message={postCredentials.error} />
            <p> Логин </p>
            <input {...addInput('username')} />
            <p> Пароль </p>
            <input {...addInput('password', 'password')} />
            <div className="authorization-buttons-panel">
                <button disabled={postCredentials.isLoading} onClick={onSingInClick}>
                    Войти
                </button>
                {modeToggle}
            </div>
        </div>
    );
}

export default SingIn;

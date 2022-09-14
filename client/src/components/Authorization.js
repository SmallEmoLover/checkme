import { useState } from "react";
import SignUp from "./SignUp";
import SingIn from "./SingIn";
import '../styles/Authorization.css'

/**
 * Authorization component with sign in and sing up forms rendering
 */
function Authorization() {
    const [isUserSigningIn, setUserSigningIn] = useState(false);

    const toggleButton = (
        <a onClick={() => {setUserSigningIn((value) => !value)}}> 
            {isUserSigningIn ? 'Войти' : 'Зарегистрироваться'} 
        </a>
    )

    return (
        <div className="Authorization">
            <div className="authorization-card">
                {isUserSigningIn ? <SignUp modeToggle={toggleButton}/> : <SingIn modeToggle={toggleButton}/>}

            </div>
        </div>
    )
}

export default Authorization;

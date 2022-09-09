import { useState } from "react";
import SignUp from "./SignUp";
import SingIn from "./SingIn";

function Authorization() {
    const [isUserSigningIn, setUserSigningIn] = useState(true);

    return (
        <div>
            <button onClick={() => {setUserSigningIn((value) => !value)}}> 
                {isUserSigningIn ? 'К входу' : 'К регистрации'} 
            </button>
            {isUserSigningIn ? <SignUp/> : <SingIn/>}
        </div>
    )
}

export default Authorization;

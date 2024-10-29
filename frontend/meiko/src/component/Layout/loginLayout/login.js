import { useState } from 'react';
import LoginForm from './loginForm.js';
import SignUpForm from './signUpForm.js';
function LoginLayout() {
    const [isSignIn, setIsSignIn] = useState(false);

    const toggleForm = () => {
        setIsSignIn(!isSignIn);
    };

    return (
        <div>
            <div>
                {isSignIn ? (
                    <LoginForm toggleForm={toggleForm} />
                ) : (
                    <SignUpForm toggleForm={toggleForm} />
                )}
            </div>
        </div>
    );
};

export default LoginLayout;
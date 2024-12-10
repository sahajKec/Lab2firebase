//Make students do this
import React, { useState, ChangeEvent, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

interface RegisterProps { }

const Register: React.FC<RegisterProps> = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate()

    useEffect(() => {
    const checkToken = () => {
       const userToken = localStorage.getItem("token");
       if (userToken){
        navigate("/dashboard")
       }
       else if (!userToken) {
        
           navigate("/register");
       }
    }
    checkToken()
   }, [])

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleLogin = async () => {
        // console.log('Logging in with:', { email, password });
        try {
            await createUserWithEmailAndPassword(auth, email, password)
                .then((userData) => {
                    if (userData.user.uid) {
                        sendEmailVerification((userData.user))
                        alert("Registration Success")
                        signOut(auth);
                        navigate("/")
                    }
                })
        } catch (error:any) {
            console.log("Error msg: ", error.message)
            alert(error.message)
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4">
                <h3 className="card-title text-center mb-4">Register</h3>
                <form>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="text-center">
                        <button type="button" className="btn btn-primary" onClick={handleLogin}>
                            Register
                        </button>
                    </div>
                </form>
                <h3 className='d-flex justify-content-center align-items-center'><a href="/">Login</a></h3>
            </div>
        </div>
    );
};

export default Register;

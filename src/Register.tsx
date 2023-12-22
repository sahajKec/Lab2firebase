//Make students do this
import React, { useState, ChangeEvent } from 'react';
import { auth } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';

import { useNavigate } from 'react-router-dom';


const Register: React.FC<RegisterProps> = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();



    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleRegister = async () => {
        try {
          await createUserWithEmailAndPassword(auth, username, password);
          console.log('Registration successful!');
          alert('Registration successful!')
          navigate('/')
        } catch (error) {
          console.error('Error registering:', error.message);
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
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={handleUsernameChange}
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
                        <button type="button" className="btn btn-primary" onClick={handleRegister}>
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

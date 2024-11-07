// /app/login/page.tsx
"use client";
import React from 'react';
import './login.css';

const Login: React.FC = () => {
    return (
        <div className="wrapper">
            <nav className="nav">
                <div className="nav-logo">
                    <p>NGO MANAGEMENT SYSTEMS</p>
                </div>
            </nav>
            <div className="form-box">
                <div className="login-container">
                    <header>Login</header>
                    <form>
                        <div className="input-box">
                            <i className="fas fa-user"></i>
                            <input type="text" placeholder="Username" className="input-field" required />
                        </div>
                        <div className="input-box">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Password" className="input-field" required />
                        </div>
                        <button type="submit" className="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

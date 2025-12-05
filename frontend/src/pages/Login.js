import React from 'react';
import LoginForm from '../components/LoginForm';
import LoginSidePanel from '../components/LoginSidePanel';
import './styles/Login.css';

function Login() {
  return (
    <div className="login-page">
      <LoginSidePanel />
      <LoginForm />
    </div>
  );
}

export default Login;
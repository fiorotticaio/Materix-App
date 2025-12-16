import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import LoginForm from '../components/LoginForm';
import LoginSidePanel from '../components/LoginSidePanel';
import './styles/Login.css';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        if (decoded.exp * 1000 > Date.now()) {
          navigate('/home');
        } else {
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <LoginSidePanel />
      <LoginForm />
    </div>
  );
}

export default Login;
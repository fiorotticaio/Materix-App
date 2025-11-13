import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="login-panel">

        <h2 className="login-title">Acesso ao Sistema</h2>
        <p className="login-subtitle">
          Entre para acessar o gerador de plantas e listas de materiais.
        </p>

        <label>Email</label>
        <input 
          type="email" 
          className="login-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label style={{ marginTop: '1rem' }}>Senha</label>
        <input 
          type="password"
          className="login-input"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button 
          className="login-button"
          onClick={handleLogin}
        >
          Entrar
        </button>

      </div>
    </div>
  );
}

export default Login;

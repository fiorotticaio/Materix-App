import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import InputField from './InputField';
import Button from './Button';
import './styles/LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // if (!validateForm()) {
    //   return;
    // }

    setLoading(true);
    
    // Simula uma requisição de login
    setTimeout(() => {
      setLoading(false);
      navigate('/plant-viewer');
    }, 1000);
  };

  return (
    <div className="login-form-container">
      <div className="login-form-header">
        <Logo size="large" />
        <h2 className="login-form-title">Acesso ao Sistema</h2>
        <p className="login-form-subtitle">
          Entre com suas credenciais para acessar o gerador de plantas e listas de materiais.
        </p>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          placeholder="seu@email.com"
          icon={<span>📧</span>}
          error={errors.email}
        />

        <InputField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: '' });
          }}
          placeholder="••••••••"
          icon={<span>🔐</span>}
          error={errors.password}
        />

        <div className="login-form-options">
          <label className="login-form-remember">
            <input type="checkbox" />
            <span>Lembrar-me</span>
          </label>
          <a href="#" className="login-form-forgot">
            Esqueceu a senha?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
        >
          Entrar
        </Button>
      </form>

      <div className="login-form-footer">
        <p>
          Não tem uma conta?{' '}
          <a href="#" className="login-form-link">
            Fale com o administrador
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;


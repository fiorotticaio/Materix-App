import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import InputField from '../components/InputField';
import Button from '../components/Button';
import './styles/ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage('Token inválido ou expirado');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      setMessage('Preencha todos os campos');
      return;
    }

    if (password !== confirm) {
      setMessage('As senhas não coincidem');
      return;
    }

    try {
      await axios.post(`http://localhost:8081/auth/password/reset/${token}`, {
        newPassword: password
      });

      setSuccess(true);
      setTimeout(() => navigate('/'), 2500);

    } catch (err) {
      setMessage('Token inválido ou expirado');
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <Logo size="large" />

        <h2>Redefinir senha</h2>

        {!success ? (
          <>
            <form onSubmit={handleSubmit}>
              <InputField
                label="Nova senha"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage('');
                }}
                icon={<span>🔐</span>}
              />

              <InputField
                label="Confirmar senha"
                type="password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setMessage('');
                }}
                icon={<span>🔐</span>}
              />

              {message && <p className="reset-error">{message}</p>}

              <Button variant="primary" fullWidth size="large" type="submit">
                Atualizar senha
              </Button>
            </form>
          </>
        ) : (
          <p className="reset-success">Senha atualizada com sucesso! Redirecionando...</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
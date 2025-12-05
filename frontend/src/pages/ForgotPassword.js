import React, { useState } from 'react';
import axios from 'axios';
import Logo from '../components/Logo';
import InputField from '../components/InputField';
import Button from '../components/Button';
import './styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Informe um email válido');
      return;
    }

    try {
      await axios.post('http://localhost:8081/auth/password/request', { email });
      setSent(true);
    } catch (err) {
      setError('Email não encontrado');
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <Logo size="large" />

        {!sent ? (
          <>
            <h2>Recuperar senha</h2>
            <p>Digite seu email para enviarmos um link de recuperação.</p>

            <form onSubmit={handleSubmit}>
              <InputField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="seu@email.com"
                icon={<span>📧</span>}
                error={error}
              />

              <Button type="submit" fullWidth variant="primary" size="large">
                Enviar link
              </Button>
            </form>
          </>
        ) : (
          <div className="forgot-success">
            <h2>Email enviado!</h2>
            <p>Se o email existir no sistema, você receberá um link de redefinição nos próximos minutos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
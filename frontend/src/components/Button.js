import React from 'react';
import './styles/Button.css';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  ...props
}) => {
  return (
    <button
      className={`button button-${variant} button-${size} ${fullWidth ? 'button-full-width' : ''} ${disabled || loading ? 'button-disabled' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="button-spinner"></span>
          <span>Carregando...</span>
        </>
      ) : (
        <>
          {icon && <span className="button-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;


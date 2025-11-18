import React from 'react';
import './styles/InputField.css';

const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  error,
  ...props
}) => {
  return (
    <div className="input-field-container">
      {label && (
        <label className="input-field-label">
          {label}
        </label>
      )}
      <div className="input-field-wrapper">
        {icon && <span className="input-field-icon">{icon}</span>}
        <input
          type={type}
          className={`input-field ${icon ? 'input-field-with-icon' : ''} ${error ? 'input-field-error' : ''}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      </div>
      {error && <span className="input-field-error-message">{error}</span>}
    </div>
  );
};

export default InputField;


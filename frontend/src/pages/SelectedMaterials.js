import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/SelectedMaterials.css';

const SelectedMaterials = () => {
  const location = useLocation();
  const { extractedText } = location.state || { extractedText: '' };

  return (
    <div>
      <h1>Resultados da Leitura</h1>
      <pre>{extractedText}</pre>
    </div>
  );
};

export default SelectedMaterials;


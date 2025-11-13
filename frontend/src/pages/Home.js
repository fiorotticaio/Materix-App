import React, { useEffect } from 'react';
import axios from 'axios';
import '../styles/home.css';

function Home() {

  useEffect(() => {
    axios.get('http://localhost:8081/')
      .then(response => console.log("Dados:", response.data))
      .catch(error => console.error("Erro:", error));
  }, []);

  return (
    <div className="home-container">
      <div className="home-panel">
        <h1 className="home-title">Dashboard Inicial</h1>
        <p className="home-subtitle">
          Bem-vindo ao sistema! Em breve você poderá carregar plantas, gerar listas e exportar relatórios.
        </p>
      </div>
    </div>
  );
}

export default Home;

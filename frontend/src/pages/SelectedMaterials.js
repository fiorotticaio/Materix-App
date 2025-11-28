import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/SelectedMaterials.css";

const SelectedMaterials = () => {
  const location = useLocation();
  const { extractedText } = location.state || { extractedText: "" };

  const [materials, setMaterials] = useState([]);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    if (!extractedText) return;

    const detectedMaterials = extractedText
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const fakeResponse = detectedMaterials.map((mat) => ({
      name: mat,
      items: [
        { item: "Parafuso M8", qty: Math.floor(Math.random() * 5) + 1 },
        { item: "Porca Aço", qty: Math.floor(Math.random() * 3) + 1 },
        { item: "Arruela 12mm", qty: Math.floor(Math.random() * 4) + 1 },
      ],
    }));

    setMaterials(fakeResponse);

    const summaryMap = {};
    fakeResponse.forEach((mat) => {
      mat.items.forEach(({ item, qty }) => {
        summaryMap[item] = (summaryMap[item] || 0) + qty;
      });
    });

    const summaryArr = Object.entries(summaryMap).map(([item, qty]) => ({
      item,
      qty,
    }));

    setSummary(summaryArr);
  }, [extractedText]);

  return (
    <div className="materials-container">
      {/* HEADER */}
      <header className="materials-header">
        <h1 className="materials-title">Materiais Identificados</h1>
      </header>

      <div className="materials-content">
        {/* LISTA DE CARDS */}
        <div className="materials-grid">
          {materials.map((mat) => (
            <div key={mat.name} className="material-card">
              <h2 className="material-card-title">{mat.name}</h2>
              <div className="material-items">
                {mat.items.map((i, idx) => (
                  <div key={idx} className="material-item-row">
                    <span>{i.item}</span>
                    <span className="material-item-qty">{i.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RESUMO FINAL */}
        <div className="summary-section">
          <h2 className="summary-title">Resumo Geral dos Itens</h2>

          <table className="summary-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantidade Total</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((s, index) => (
                <tr key={index}>
                  <td>{s.item}</td>
                  <td>{s.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="export-button">Exportar PDF</button>
        </div>
      </div>
    </div>
  );
};

export default SelectedMaterials;
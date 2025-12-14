import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MaterialsModal from "../components/MaterialsModal";
import "./styles/SelectedMaterials.css";
import axios from "axios";

const SelectedMaterials = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { extractedText } = location.state || { extractedText: "" };
  const [materials, setMaterials] = useState([]);
  const [summary, setSummary] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!extractedText) return;

    const detectedMaterials = extractedText
      .split("\n")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const fetchMaterials = async () => {
      try {
        const response = await axios.post("http://localhost:8081/materials/resolve", {
          detected: detectedMaterials
        });

        setMaterials(response.data);
        updateSummary(response.data);

      } catch (err) {
        console.error("Erro ao buscar materiais:", err);
        alert("Erro ao consultar os materiais no servidor.");
      }
    };

    fetchMaterials();
  }, [extractedText]);

  const updateSummary = (materialsList) => {
    const summaryMap = {};

    materialsList.forEach((mat) => {
      mat.items.forEach(({ item, qty }) => {
        const quantity = Number(qty) || 0;   // <--- CORREÇÃO
        summaryMap[item] = (summaryMap[item] || 0) + quantity;
      });
    });

    const summaryArr = Object.entries(summaryMap).map(([item, qty]) => ({
      item,
      qty,
    }));

    setSummary(summaryArr);
  };

  const handleOpenModal = async () => {
    setLoading(true);
    setShowModal(true);

    const response = await axios.get("http://localhost:8081/materials/items");

    setAvailableMaterials(response.data);
    setLoading(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMaterials([]);
  };

  const handleMaterialSelect = (material) => {
    setSelectedMaterials(prev => {
      const isAlreadySelected = prev.find(m => m.id === material.id);
      if (isAlreadySelected) {
        return prev.filter(m => m.id !== material.id);
      } else {
        return [...prev, material];
      }
    });
  };

  const handleAddSelectedMaterials = () => {
    if (selectedMaterials.length === 0) return;

    const fetchMaterials = async () => {
      const detectedMaterials = selectedMaterials.map(mat => mat.name);

      try {
        const response = await axios.post("http://localhost:8081/materials/resolve", {
          detected: detectedMaterials
        });

        const newMaterials = response.data;

        const updatedMaterials = [...materials, ...newMaterials];
        setMaterials(updatedMaterials);
        updateSummary(updatedMaterials);

      } catch (err) {
        console.error("Erro ao buscar materiais:", err);
        alert("Erro ao consultar os materiais no servidor.");
      }
    };

    fetchMaterials();
    handleCloseModal();
  };

  const handleRemoveMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
    updateSummary(updatedMaterials);
  };

  const addImageWithAspect = (doc, imgData, x, y, targetWidth) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.height / img.width;
        const width = targetWidth;
        const height = width * ratio;
        doc.addImage(imgData, "PNG", x, y, width, height);
        resolve(height);
      };
      img.src = imgData;
    });
  };

  const handleExportPDF = async () => {    
    try {
      // importa dinamicamente (webpack-friendly)
      const { default: jsPDF } = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");
      const autoTable = autoTableModule.default || autoTableModule; // compatibilidade entre exports

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.setFont("helvetica", "normal");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const date = new Date().toLocaleString("pt-BR");
      const marginTop = 120;

      // Helper: carrega imagem e converte para dataURL
      const imageToDataUrl = async (url) => {
        try {
          const resp = await fetch(url);
          if (!resp.ok) throw new Error("Não foi possível carregar a imagem");
          const blob = await resp.blob();
          return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.warn("Falha ao carregar imagem para PDF:", err);
          return null;
        }
      };

      // Tenta carregar logo (coloque seu logo em public/logo.png)
      const logoDataUrl = await imageToDataUrl("/logo-para-fundo-claro.png");

      // ----------------------
      // CABEÇALHO
      // ----------------------
      let logoHeight = 0;

      if (logoDataUrl) {
        // desenha logo no canto superior direito
        logoHeight = await addImageWithAspect(
          doc,
          logoDataUrl,
          pageWidth - 160, // posição X
          30,              // posição Y
          120              // largura desejada, proporcional
        );
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("Relatório de Materiais", pageWidth / 2, 60, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`Gerado em: ${date}`, pageWidth / 2, 80, { align: "center" });

      // ----------------------
      // TABELA (resumo)
      // ----------------------
      // monta dados a partir do state `summary`
      // summary é array: [{ item, qty }, ...]
      const tableData = (summary || []).map((row) => [row.item, String(row.qty)]);

      autoTable(doc, {
        startY: marginTop,
        head: [["Item", "Quantidade"]],
        body: tableData,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 10,
          cellPadding: 6,
        },
        headStyles: {
          fillColor: [26, 43, 74], // tom escuro (combina com o app)
          textColor: 255,
          fontSize: 11,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        tableLineColor: [210, 210, 210],
        tableLineWidth: 0.3,
        columnStyles: {
          0: { cellWidth: "auto" },
          1: { halign: "right", cellWidth: 80 },
        },
        didDrawPage: (data) => {
          // opcional: desenhar uma linha separadora abaixo do cabeçalho do PDF
          doc.setDrawColor(230);
          doc.setLineWidth(0.5);
          doc.line(40, 100, pageWidth - 40, 100);
        },
      });

      // ----------------------
      // RODAPÉ: numeração de páginas
      // ----------------------
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(
          `Página ${i} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 20,
          { align: "center" }
        );
      }

      // ----------------------
      // SALVAR
      // ----------------------
      const filename = `Relatorio_Materiais_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.pdf`;

      doc.save(filename);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Falha ao exportar PDF. Veja o console para mais detalhes.");
    }
  };


  return (
    <div className="materials-container">
      {/* HEADER */}
      <header className="materials-header">
        <div className="header-content">
          <button
            onClick={() => navigate('/home')}
            className="back-button"
          >
            <span className="back-button-icon">←</span>
            Voltar
          </button>
          <h1 className="materials-title">Materiais Identificados</h1>
          <button 
            className="add-materials-button"
            onClick={handleOpenModal}
          >
            <span className="button-icon">+</span>
            Adicionar Materiais
          </button>
        </div>
      </header>

      <div className="materials-content">
        {/* LISTA DE CARDS */}
        {materials.length > 0 ? (
          <div className="materials-grid">
            {materials.map((mat, index) => (
              <div key={index} className="material-card">
                <div className="material-card-header">
                  <h2 className="material-card-title">{mat.name}</h2>
                  <button 
                    className="remove-material-button"
                    onClick={() => handleRemoveMaterial(index)}
                    title="Remover material"
                  >
                    ×
                  </button>
                </div>
                <div className="material-items">
                  {mat.items.map((i, idx) => (
                    <div key={idx} className="material-item-row">
                      <span>{i.item}</span>
                      <span className="material-item-qty">{Number(i.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h2>Nenhum material encontrado</h2>
            <p>Adicione materiais manualmente ou faça upload de um arquivo</p>
            <button 
              className="add-materials-button-large"
              onClick={handleOpenModal}
            >
              <span className="button-icon">+</span>
              Adicionar Primeiro Material
            </button>
          </div>
        )}

        {/* RESUMO FINAL */}
        {summary.length > 0 && (
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
                    <td>{Number(s.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="export-button" onClick={handleExportPDF}>
              <span className="export-icon">📄</span>
              Exportar PDF
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      <MaterialsModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleAddSelectedMaterials}
        availableMaterials={availableMaterials}
        selectedMaterials={selectedMaterials}
        onMaterialSelect={handleMaterialSelect}
        loading={loading}
      />
    </div>
  );
};

export default SelectedMaterials;
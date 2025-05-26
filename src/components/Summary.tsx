import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, FileUp } from 'lucide-react';

export const Summary: React.FC = () => {
  const { state } = useAppContext();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const totalArea = state.pieces.reduce((sum, piece) => sum + piece.area, 0);
  const totalValue = state.pieces.reduce((sum, piece) => sum + piece.totalValue, 0);
  
  const generateClientPDF = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      let y = 20;

      // Title
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text('Orçamento de Metragem', 15, y);
      y += 15;

      // Date
      doc.setFontSize(10);
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 15, y);
      y += 10;

      // Group by spaces
      const groupedPieces = {};
      state.pieces.forEach(piece => {
        if (!groupedPieces[piece.group]) {
          groupedPieces[piece.group] = [];
        }
        groupedPieces[piece.group].push(piece);
      });

      // For each space
      Object.entries(groupedPieces).forEach(([group, pieces]) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(0, 102, 204);
        doc.text(`Espaço: ${group}`, 15, y);
        y += 10;

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);

        // For each piece in the space
        pieces.forEach(piece => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }

          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.5);
          doc.rect(15, y, 180, 50);

          doc.text(`Quantidade: ${piece.quantity}`, 20, y + 10);
          doc.text(`Medida: ${(piece.width * 100).toFixed(0)} × ${(piece.height * 100).toFixed(0)} cm`, 20, y + 20);
          doc.text(`Área: ${piece.area.toFixed(2)} m²`, 20, y + 30);
          doc.text(`Valor: ${formatCurrency(piece.totalValue)}`, 20, y + 40);

          if (piece.drawing) {
            doc.addImage(piece.drawing, 'PNG', 140, y + 5, 40, 40);
          }

          y += 60;
        });

        // Space summary
        const spaceArea = pieces.reduce((sum, p) => sum + p.area, 0);
        const spaceValue = pieces.reduce((sum, p) => sum + p.totalValue, 0);
        
        doc.setFontSize(12);
        doc.text(`Total ${group}: ${spaceArea.toFixed(2)} m² | ${formatCurrency(spaceValue)}`, 15, y);
        y += 15;
      });

      // Final summary
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1);
      doc.line(15, y, 195, y);
      y += 10;

      doc.setTextColor(0, 0, 0);
      doc.text(`Total Geral: ${totalArea.toFixed(2)} m²`, 15, y);
      y += 10;
      doc.text(`Valor Total: ${formatCurrency(totalValue)}`, 15, y);

      doc.save('orcamento-cliente.pdf');
    });
  };

  const generateTechnicalPDF = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      let y = 20;

      // Title
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text('Rascunho Técnico de Medidas', 15, y);
      y += 15;

      // Date
      doc.setFontSize(10);
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 15, y);
      y += 10;

      // Group by spaces
      const groupedPieces = {};
      state.pieces.forEach(piece => {
        if (!groupedPieces[piece.group]) {
          groupedPieces[piece.group] = [];
        }
        groupedPieces[piece.group].push(piece);
      });

      // For each space
      Object.entries(groupedPieces).forEach(([group, pieces]) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(0, 102, 204);
        doc.text(`Espaço: ${group}`, 15, y);
        y += 10;

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);

        // For each piece in the space
        pieces.forEach(piece => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }

          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.5);
          doc.rect(15, y, 180, 70);

          doc.text(`Quantidade: ${piece.quantity}`, 20, y + 10);
          doc.text(`Medida: ${(piece.width * 100).toFixed(0)} × ${(piece.height * 100).toFixed(0)} cm`, 20, y + 20);
          doc.text(`Área: ${piece.area.toFixed(2)} m²`, 20, y + 30);
          
          if (piece.details) {
            doc.text(`Detalhes: ${piece.details}`, 20, y + 40);
          }

          if (piece.drawing) {
            doc.addImage(piece.drawing, 'PNG', 120, y + 5, 60, 60);
          }

          y += 80;
        });

        // Space summary
        const spaceArea = pieces.reduce((sum, p) => sum + p.area, 0);
        
        doc.setFontSize(12);
        doc.text(`Total ${group}: ${spaceArea.toFixed(2)} m²`, 15, y);
        y += 15;
      });

      // Final summary
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1);
      doc.line(15, y, 195, y);
      y += 10;

      doc.setTextColor(0, 0, 0);
      doc.text(`Total Geral: ${totalArea.toFixed(2)} m²`, 15, y);

      doc.save('rascunho-tecnico.pdf');
    });
  };

  return (
    <div>
      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Área Total</h3>
            <p className="text-2xl font-bold text-cyan-400">{totalArea.toFixed(2)} m²</p>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Valor Total</h3>
            <p className="text-2xl font-bold text-cyan-400">{formatCurrency(totalValue)}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={generateClientPDF}
          disabled={state.pieces.length === 0}
          className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors ${
            state.pieces.length === 0
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <FileText size={18} className="mr-2" />
          Exportar Orçamento (Cliente)
        </button>
        
        <button
          onClick={generateTechnicalPDF}
          disabled={state.pieces.length === 0}
          className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors ${
            state.pieces.length === 0
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700 text-white'
          }`}
        >
          <FileUp size={18} className="mr-2" />
          Exportar Rascunho Técnico
        </button>
      </div>
    </div>
  );
};
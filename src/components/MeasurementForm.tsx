import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { DrawingCanvas } from './DrawingCanvas';

export const MeasurementForm: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [quantity, setQuantity] = useState<number>(1);
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (state.editingIndex >= 0) {
      const piece = state.pieces[state.editingIndex];
      setQuantity(piece.quantity);
      setWidth((piece.width * 100).toString());
      setHeight((piece.height * 100).toString());
      setUnitPrice(piece.unitPrice.toString());
      setDetails(piece.details);
    }
  }, [state.editingIndex, state.pieces]);

  const parseDimension = (value: string): number => {
    if (!value) return NaN;
    const sanitized = value.replace(',', '.').trim();
    return sanitized.includes('.')
      ? parseFloat(sanitized)
      : parseFloat(sanitized) / 100;
  };

  const resetForm = () => {
    setQuantity(1);
    setWidth('');
    setHeight('');
    setUnitPrice('');
    setDetails('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.activeGroup) {
      setError('Por favor, selecione um espaço');
      return;
    }

    const widthValue = parseDimension(width);
    const heightValue = parseDimension(height);
    const unitPriceValue = parseFloat(unitPrice) || 0;

    if (isNaN(widthValue) || isNaN(heightValue)) {
      setError('Dimensões inválidas. Use números ou números com ponto decimal.');
      return;
    }

    const area = widthValue * heightValue * quantity;
    const totalValue = unitPriceValue * quantity;

    const piece = {
      id: state.editingIndex >= 0 ? state.pieces[state.editingIndex].id : Date.now().toString(),
      group: state.activeGroup,
      quantity,
      width: widthValue,
      height: heightValue,
      unitPrice: unitPriceValue,
      details,
      area,
      totalValue,
      drawing: state.currentDrawing || '',
      createdAt: Date.now(),
    };

    if (state.editingIndex >= 0) {
      dispatch({ 
        type: 'UPDATE_PIECE', 
        payload: { index: state.editingIndex, piece } 
      });
    } else {
      dispatch({ type: 'ADD_PIECE', payload: piece });
    }

    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-cyan-400">
        {state.editingIndex >= 0 ? 'Editar Peça' : 'Adicionar Peça'}
      </h2>
      
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-white">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Quantidade
        </label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Largura (cm)
          </label>
          <input
            type="text"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Ex: 125 ou 1.25"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Altura (cm)
          </label>
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Ex: 15 ou 0.15"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Preço Unitário (R$)
        </label>
        <input
          type="text"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          placeholder="Ex: 150.00"
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Detalhes
        </label>
        <input
          type="text"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Ex: furo de pia; polido"
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <DrawingCanvas />

      <button
        type="submit"
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg py-3 transition-colors duration-200"
      >
        {state.editingIndex >= 0 ? 'Salvar Alterações' : 'Adicionar Peça'}
      </button>
    </form>
  );
};
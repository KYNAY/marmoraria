import React, { useState } from 'react';
import { Edit, Trash2, ArrowDown, ArrowUp, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Piece } from '../types';

export const PiecesTable: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [sortField, setSortField] = useState<keyof Piece>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterGroup, setFilterGroup] = useState<string>('');

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleSort = (field: keyof Piece) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Piece) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} className="inline ml-1" />
    ) : (
      <ArrowDown size={14} className="inline ml-1" />
    );
  };

  const sortedPieces = [...state.pieces]
    .filter(piece => !filterGroup || piece.group === filterGroup)
    .sort((a, b) => {
      let comparison = 0;
      
      if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
        comparison = (a[sortField] as string).localeCompare(b[sortField] as string);
      } else {
        comparison = (a[sortField] as number) - (b[sortField] as number);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  if (state.pieces.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>Nenhuma peça adicionada ainda.</p>
        <p className="text-sm mt-2">Utilize o formulário para adicionar peças.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-cyan-400">Peças Adicionadas</h2>
        
        <div className="flex items-center w-full sm:w-auto">
          <Filter size={16} className="mr-2 text-slate-400" />
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="w-full sm:w-auto bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Todos os espaços</option>
            {state.groups.map((group) => (
              <option key={group.id} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-[800px] md:w-full p-4 md:p-0">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-left text-sm">
                <th 
                  className="py-2 px-3 font-medium text-slate-300 cursor-pointer"
                  onClick={() => handleSort('group')}
                >
                  Espaço {getSortIcon('group')}
                </th>
                <th 
                  className="py-2 px-3 font-medium text-slate-300 cursor-pointer"
                  onClick={() => handleSort('quantity')}
                >
                  Qtde {getSortIcon('quantity')}
                </th>
                <th className="py-2 px-3 font-medium text-slate-300">
                  Medida
                </th>
                <th 
                  className="py-2 px-3 font-medium text-slate-300 cursor-pointer"
                  onClick={() => handleSort('area')}
                >
                  Área {getSortIcon('area')}
                </th>
                <th 
                  className="py-2 px-3 font-medium text-slate-300 cursor-pointer"
                  onClick={() => handleSort('totalValue')}
                >
                  Valor {getSortIcon('totalValue')}
                </th>
                <th className="py-2 px-3 font-medium text-slate-300">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPieces.map((piece, index) => (
                <tr 
                  key={piece.id}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-3">{piece.group}</td>
                  <td className="py-3 px-3">{piece.quantity}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {(piece.width * 100).toFixed(0)} × {(piece.height * 100).toFixed(0)} cm
                  </td>
                  <td className="py-3 px-3">{piece.area.toFixed(2)} m²</td>
                  <td className="py-3 px-3">{formatCurrency(piece.totalValue)}</td>
                  <td className="py-3 px-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => dispatch({ type: 'SET_EDITING', payload: index })}
                        className="p-1 bg-cyan-600 hover:bg-cyan-700 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta peça?')) {
                            dispatch({ type: 'DELETE_PIECE', payload: index });
                          }
                        }}
                        className="p-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
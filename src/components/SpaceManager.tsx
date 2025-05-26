import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const SpaceManager: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [newGroup, setNewGroup] = useState('');

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroup.trim()) {
      dispatch({ type: 'ADD_GROUP', payload: newGroup.trim() });
      setNewGroup('');
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-cyan-400">Espaços</h2>
      
      <form onSubmit={handleAddGroup} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder="Ex: Cozinha, Banheiro..."
          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button 
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg px-3 py-2 transition-colors duration-200 flex items-center"
        >
          <PlusCircle size={18} className="mr-1" />
          <span>Adicionar</span>
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {state.groups.map((group) => (
          <button
            key={group.id}
            onClick={() => dispatch({ type: 'SET_ACTIVE_GROUP', payload: group.name })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              state.activeGroup === group.name
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {group.name}
          </button>
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import { SpaceManager } from './SpaceManager';
import { MeasurementForm } from './MeasurementForm';
import { PiecesTable } from './PiecesTable';
import { Summary } from './Summary';
import { Logo } from './Logo';

export const Calculator: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="flex flex-col items-center justify-center mb-8 text-center">
        <Logo />
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Calculadora de Metragem
        </h1>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Painel esquerdo */}
        <div className="w-full lg:w-1/3 bg-slate-800 rounded-xl p-4 shadow-xl">
          <SpaceManager />
          <MeasurementForm />
        </div>

        {/* Painel direito */}
        <div className="w-full lg:w-2/3 bg-slate-800 rounded-xl p-4 shadow-xl overflow-x-auto">
          <PiecesTable />
          <Summary />
        </div>
      </div>
    </div>
  );
};

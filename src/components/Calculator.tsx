import React from 'react';
import { SpaceManager } from './SpaceManager';
import { MeasurementForm } from './MeasurementForm';
import { PiecesTable } from './PiecesTable';
import { Summary } from './Summary';
import { Logo } from './Logo';

export const Calculator: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="flex items-center justify-center mb-8">
        <Logo />
        <h1 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Calculadora de Metragem
        </h1>
      </header>
      
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="bg-slate-800 rounded-xl p-4 md:p-6 shadow-xl">
          <SpaceManager />
          <MeasurementForm />
        </div>
        
        <div className="bg-slate-800 rounded-xl p-4 md:p-6 shadow-xl">
          <PiecesTable />
          <Summary />
        </div>
      </div>
    </div>
  );
};
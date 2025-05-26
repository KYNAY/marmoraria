import React from 'react';
import { Calculator } from './components/Calculator';
import { AppProvider } from './context/AppContext';
import './index.css';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-900 text-white">
        <Calculator />
      </div>
    </AppProvider>
  );
}

export default App;
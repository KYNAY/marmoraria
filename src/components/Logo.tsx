import React from 'react';
import { Ruler } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center mr-4">
      <Ruler size={28} className="text-cyan-400" />
    </div>
  );
};
import React, { useRef, useEffect, useState } from 'react';
import { Pencil, Eraser, RotateCcw, RotateCw, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DrawingHistoryState } from '../types';

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, dispatch } = useAppContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState<DrawingHistoryState>({
    history: [],
    currentIndex: -1,
  });
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 200;
      
      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Restore drawing if context was reset
      if (state.currentDrawing) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = state.currentDrawing;
      }
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [state.currentDrawing]);

  // Handle drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    
    const startDrawing = (e: MouseEvent | TouchEvent) => {
      setIsDrawing(true);
      ctx.beginPath();
      
      let x, y;
      if ('touches' in e) {
        const rect = canvas.getBoundingClientRect();
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.offsetX;
        y = e.offsetY;
      }
      
      ctx.moveTo(x, y);
    };
    
    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      
      let x, y;
      if ('touches' in e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.offsetX;
        y = e.offsetY;
      }
      
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = lineWidth * 2;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
      }
      
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    
    const stopDrawing = () => {
      if (isDrawing) {
        ctx.closePath();
        setIsDrawing(false);
        saveDrawingState();
      }
    };
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing, color, lineWidth, tool]);

  // Save drawing state for undo/redo
  const saveDrawingState = () => {
    if (!canvasRef.current) return;
    
    const currentDrawing = canvasRef.current.toDataURL();
    dispatch({ type: 'SET_DRAWING', payload: currentDrawing });
    
    // Update history
    setDrawingHistory(prev => {
      const newHistory = prev.history.slice(0, prev.currentIndex + 1);
      newHistory.push(currentDrawing);
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1
      };
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setDrawingHistory({
      history: [],
      currentIndex: -1
    });
    
    dispatch({ type: 'SET_DRAWING', payload: null });
  };

  const handleUndo = () => {
    if (drawingHistory.currentIndex <= 0) {
      clearCanvas();
      return;
    }
    
    const newIndex = drawingHistory.currentIndex - 1;
    const imageData = drawingHistory.history[newIndex];
    
    setDrawingHistory(prev => ({
      ...prev,
      currentIndex: newIndex
    }));
    
    if (imageData) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = imageData;
      
      dispatch({ type: 'SET_DRAWING', payload: imageData });
    }
  };

  const handleRedo = () => {
    if (drawingHistory.currentIndex >= drawingHistory.history.length - 1) return;
    
    const newIndex = drawingHistory.currentIndex + 1;
    const imageData = drawingHistory.history[newIndex];
    
    setDrawingHistory(prev => ({
      ...prev,
      currentIndex: newIndex
    }));
    
    if (imageData) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = imageData;
      
      dispatch({ type: 'SET_DRAWING', payload: imageData });
    }
  };

  useEffect(() => {
    // Initialize canvas with existing drawing when editing
    if (state.currentDrawing && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = state.currentDrawing;
      
      setDrawingHistory({
        history: [state.currentDrawing],
        currentIndex: 0
      });
    }
  }, [state.editingIndex]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300 mb-1">
        Desenho
      </label>
      
      <div className="border border-slate-600 rounded-lg overflow-hidden bg-white">
        <canvas 
          ref={canvasRef} 
          className="w-full touch-none" 
          height="200"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button 
          type="button"
          onClick={() => setTool('pencil')}
          className={`p-2 rounded-md transition-colors ${
            tool === 'pencil' ? 'bg-cyan-600' : 'bg-slate-700 hover:bg-slate-600'
          }`}
          title="Lápis"
        >
          <Pencil size={16} />
        </button>
        
        <button 
          type="button"
          onClick={() => setTool('eraser')}
          className={`p-2 rounded-md transition-colors ${
            tool === 'eraser' ? 'bg-cyan-600' : 'bg-slate-700 hover:bg-slate-600'
          }`}
          title="Borracha"
        >
          <Eraser size={16} />
        </button>
        
        <input 
          type="color" 
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 p-1 bg-slate-700 border border-slate-600 rounded-md cursor-pointer"
          title="Cor"
        />
        
        <select 
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          className="p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
          title="Espessura"
        >
          <option value="1">Fino</option>
          <option value="2">Médio</option>
          <option value="4">Grosso</option>
        </select>
        
        <button 
          type="button"
          onClick={handleUndo}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors ml-auto"
          title="Desfazer"
        >
          <RotateCcw size={16} />
        </button>
        
        <button 
          type="button"
          onClick={handleRedo}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
          title="Refazer"
        >
          <RotateCw size={16} />
        </button>
        
        <button 
          type="button"
          onClick={clearCanvas}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
          title="Limpar"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
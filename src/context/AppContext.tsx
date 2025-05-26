import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Piece, Group } from '../types';

interface AppState {
  pieces: Piece[];
  groups: Group[];
  activeGroup: string;
  editingIndex: number;
  currentDrawing: string | null;
}

type Action = 
  | { type: 'ADD_GROUP'; payload: string }
  | { type: 'SET_ACTIVE_GROUP'; payload: string }
  | { type: 'ADD_PIECE'; payload: Piece }
  | { type: 'UPDATE_PIECE'; payload: { index: number; piece: Piece } }
  | { type: 'DELETE_PIECE'; payload: number }
  | { type: 'SET_EDITING'; payload: number }
  | { type: 'SET_DRAWING'; payload: string | null };

const initialState: AppState = {
  pieces: [],
  groups: [],
  activeGroup: '',
  editingIndex: -1,
  currentDrawing: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_GROUP':
      if (state.groups.some(g => g.name === action.payload)) {
        return state;
      }
      return {
        ...state,
        groups: [...state.groups, { id: Date.now().toString(), name: action.payload }],
        activeGroup: action.payload,
      };
    case 'SET_ACTIVE_GROUP':
      return {
        ...state,
        activeGroup: action.payload,
      };
    case 'ADD_PIECE':
      return {
        ...state,
        pieces: [...state.pieces, action.payload],
        editingIndex: -1,
        currentDrawing: null,
      };
    case 'UPDATE_PIECE':
      return {
        ...state,
        pieces: state.pieces.map((p, i) => 
          i === action.payload.index ? action.payload.piece : p
        ),
        editingIndex: -1,
        currentDrawing: null,
      };
    case 'DELETE_PIECE':
      return {
        ...state,
        pieces: state.pieces.filter((_, i) => i !== action.payload),
      };
    case 'SET_EDITING':
      return {
        ...state,
        editingIndex: action.payload,
        currentDrawing: action.payload >= 0 ? state.pieces[action.payload].drawing : null,
      };
    case 'SET_DRAWING':
      return {
        ...state,
        currentDrawing: action.payload,
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, () => {
    const savedState = localStorage.getItem('measurementCalculator');
    return savedState ? JSON.parse(savedState) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('measurementCalculator', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
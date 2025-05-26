export interface Group {
  id: string;
  name: string;
}

export interface Piece {
  id: string;
  group: string;
  quantity: number;
  width: number;
  height: number;
  unitPrice: number;
  details: string;
  area: number;
  totalValue: number;
  drawing: string;
  createdAt: number;
}

export interface DrawingHistoryState {
  history: string[];
  currentIndex: number;
}
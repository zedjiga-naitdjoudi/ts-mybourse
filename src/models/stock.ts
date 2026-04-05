export interface StockHistory {
  date: string;
  price: number;
  volume: number;
}
export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  currency: string;
    history: StockHistory[];
}
export type Period = "1W" | "1M" | "1Y" ;
export type ChartType = "line" | "bar" ;
export interface AppState {
  stocks: Stock[];
  selectedStock1: String ;
  selectedStock2: String;
  period: Period;
  chartType: ChartType;
}
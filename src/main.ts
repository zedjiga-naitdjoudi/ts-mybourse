import { fetchStocks } from "./api/stockApi";
import { ChartManager } from "./charts/chartManager";
import {
  populateStockSelects,
  showError,
  updateStats,
  eventListeners,
} from "./ui/domManager";
import type { AppState, Period, ChartType } from "./models/stock";

// ─── État applicatif ──────────────────────────────────────────────────────────

const state: AppState = {
  stocks: [],
  selectedStock1: "",
  selectedStock2: "",
  period: "1M",
  chartType: "line",
};

let chartManager: ChartManager | null = null;

// ─── Mise à jour du graphique et des stats ────────────────────────────────────

function updateChart(): void {
  const stock1 = state.stocks.find((s) => s.symbol === state.selectedStock1);
  const stock2 = state.stocks.find((s) => s.symbol === state.selectedStock2);

  if (!stock1 || !stock2) return;

  chartManager!.render(stock1, stock2, state.period, state.chartType);
  updateStats(stock1, stock2);
}

// ─── Callbacks passés à domManager ───────────────────────────────────────────

function onStockChange(symbol1: string, symbol2: string): void {
  state.selectedStock1 = symbol1;
  state.selectedStock2 = symbol2;
  updateChart();
}

function onPeriodChange(period: Period): void {
  state.period = period;
  updateChart();
}

function onChartTypeChange(chartType: ChartType): void {
  state.chartType = chartType;
  updateChart();
}

// ─── Initialisation ───────────────────────────────────────────────────────────

async function main(): Promise<void> {
  try {
    const stocks = await fetchStocks();

    if (stocks.length < 2) {
      showError(
        "Au moins deux actions sont nécessaires pour afficher le graphique.",
      );
      return;
    }

    state.stocks = stocks;
    state.selectedStock1 = stocks[0].symbol;
    state.selectedStock2 = stocks[1].symbol;
    console.log(stocks);
    populateStockSelects(stocks);

    chartManager = new ChartManager("main-chart");

    eventListeners(onStockChange, onPeriodChange, onChartTypeChange);

    updateChart();
  } catch (error) {
    showError(
      error instanceof Error
        ? `Erreur lors du chargement : ${error.message}`
        : "Erreur inconnue.",
    );
    console.error(error);
  }
}

main();

import {
  Chart,
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
  type ChartConfiguration,
  type ChartType as ChartJsType,
} from "chart.js";
import "chartjs-adapter-date-fns";
import type { Stock, StockHistory, Period, ChartType } from "../models/stock";

Chart.register(
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
);

// ─── Palette ──────────────────────────────────────────────────────────────────

const COLORS = {
  stock1: { line: "#7F77DD", fill: "rgba(127,119,221,0.12)" },
  stock2: { line: "#1D9E75", fill: "rgba(29,158,117,0.12)" },
} as const;

// ─── Filtrage par période ─────────────────────────────────────────────────────

function filterHistory(
  history: StockHistory[],
  period: Period,
): StockHistory[] {
  if (history.length === 0) {
    return [];
  }

  // Trouver la date la plus récente dans l'historique des données
  const latestDate = new Date(
    Math.max(...history.map((entry) => new Date(entry.date).getTime())),
  );
  const cutoff = new Date(latestDate);

  switch (period) {
    case "1W":
      cutoff.setDate(cutoff.getDate() - 7);
      break;
    case "1M":
      cutoff.setMonth(cutoff.getMonth() - 1);
      break;
    case "1Y":
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      break;
  }

  return history.filter((entry) => new Date(entry.date) >= cutoff);
}

// ─── Dataset Chart.js ─────────────────────────────────────────────────────────

import type {
  // ... tes imports existants ...
  ChartDataset,
} from "chart.js";

function toDataset(
  stock: Stock,
  period: Period,
  colorKey: "stock1" | "stock2",
  chartType: ChartType,
): ChartDataset<"line" | "bar"> {
  // ← typage explicite du retour
  const { line, fill } = COLORS[colorKey];
  const filtered = filterHistory(stock.history, period);

  return {
    label: `${stock.symbol} – ${stock.name}`,
    data: filtered.map((entry) => ({
      x: entry.date as unknown as number,
      y: entry.price,
    })),
    borderColor: line,
    backgroundColor: chartType === "line" ? fill : line,
    borderWidth: chartType === "line" ? 2 : 1,
    pointRadius: chartType === "line" ? 2 : 0,
    pointHoverRadius: 5,
    fill: chartType === "line",
    tension: 0.3,
  };
}

// ─── Config complète ──────────────────────────────────────────────────────────

function buildConfig(
  stock1: Stock,
  stock2: Stock,
  period: Period,
  chartType: ChartType,
): ChartConfiguration {
  const xUnit = period === "1W" ? "day" : period === "1M" ? "week" : "month";

  return {
    type: chartType as ChartJsType,
    data: {
      datasets: [
        toDataset(stock1, period, "stock1", chartType),
        toDataset(stock2, period, "stock2", chartType),
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          labels: { usePointStyle: true, padding: 16 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const stock = ctx.datasetIndex === 0 ? stock1 : stock2;
              return ` ${stock.symbol}  ${(ctx.parsed.y as number).toFixed(2)} ${stock.currency}`;
            },
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: xUnit,
            tooltipFormat: "dd MMM yyyy",
            displayFormats: {
              day: "dd MMM",
              week: "dd MMM",
              month: "MMM yyyy",
            },
          },
          grid: { display: false },
          ticks: { maxTicksLimit: 8 },
        },
        y: {
          position: "left",
          grid: { color: "rgba(128,128,128,0.1)" },
          ticks: { callback: (v) => `${Number(v).toFixed(2)}` },
        },
      },
    },
  };
}

// ─── Classe publique ──────────────────────────────────────────────────────────

export class ChartManager {
  private chart: Chart | null = null;
  private canvas: HTMLCanvasElement;

  constructor(canvasId: string) {
    const el = document.getElementById(canvasId);
    if (!(el instanceof HTMLCanvasElement)) {
      throw new Error(`Canvas introuvable : #${canvasId}`);
    }
    this.canvas = el;
  }

  /**
   * Crée ou recrée le graphique.
   * La destruction systématique est nécessaire car Chart.js
   * ne permet pas de changer le type (line ↔ bar) à chaud.
   */
  render(
    stock1: Stock,
    stock2: Stock,
    period: Period,
    chartType: ChartType,
  ): void {
    this.chart?.destroy();
    this.chart = new Chart(
      this.canvas,
      buildConfig(stock1, stock2, period, chartType),
    );
  }

  destroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }
}

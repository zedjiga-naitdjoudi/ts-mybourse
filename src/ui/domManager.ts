import type { Stock, Period, ChartType } from "../models/stock";


const stock1Select = document.getElementById("stock1-select") as HTMLSelectElement;
const stock2Select = document.getElementById("stock2-select") as HTMLSelectElement;
const periodButtons = document.querySelectorAll(".period-btn");
const chartTypeButtons = document.getElementById("chart-type-select") as HTMLSelectElement;
const errorZone = document.getElementById("error-zone") as HTMLDivElement;
const errorMessage = document.getElementById("error-message") as HTMLParagraphElement;
const statsZone = document.getElementById("stats-zone") as HTMLDivElement;

export function populateStockSelects(stocks: Stock[]): void {
  stock1Select.innerHTML = "";
  stock2Select.innerHTML = "";

  stocks.forEach((stock, index) => {
    const option1 = document.createElement("option");
    option1.value = stock.symbol;
    option1.textContent = stock.name;
    stock1Select.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = stock.symbol;
    option2.textContent = stock.name;
    stock2Select.appendChild(option2);

    if (index === 0) {
      stock1Select.value = stock.symbol;
    } else if (index === 1) {
      stock2Select.value = stock.symbol;
    }
  });
}

export function showError(message: string): void {
  errorMessage.textContent = message;
  errorZone.style.display = "block";
}

export function hideErrors(): void {
  errorZone.style.display = "none";
}

export function updateStats(stock1: Stock, stock2: Stock): void {
    const var1 = calculateVariation(stock1);
    const var2 = calculateVariation(stock2);

    statsZone.innerHTML = `
    <div class="stat">
        <h3>${stock1.name} (${stock1.symbol})</h3>
        <p>Prix actuel : ${stock1.currentPrice} ${stock1.currency}</p>
        <p>Variation : <strong class="${var1 >= 0 ? 'positive' : 'negative'}">${var1 >= 0 ? "+" : ""}${var1.toFixed(2)}%</strong></p>
    </div>
    <div class="stat">
        <h3>${stock2.name} (${stock2.symbol})</h3>
        <p>Prix actuel : ${stock2.currentPrice} ${stock2.currency}</p>
        <p>Variation : <strong class="${var2 >= 0 ? 'positive' : 'negative'}">${var2 >= 0 ? "+" : ""}${var2.toFixed(2)}%</strong></p>
    </div>
 `;
}
 function calculateVariation(stock: Stock): number {
    const history = stock.history;
    if (history.length < 2) {
        return 0;
    }
    const firstPrice = history[0].price;
    const lastPrice = history[history.length - 1].price;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
}

export function eventListeners(onStockChange: (symbol1: string, symbol2: string) => void, onPeriodChange: (period: Period) => void, onChartTypeChange: (chartType: ChartType) => void): void {

    stock1Select.addEventListener("change", () => {
    if (stock1Select.value === stock2Select.value) {
        showError("Veuillez sélectionner deux actions différentes.");
        return;
    }
    hideErrors();
    onStockChange(stock1Select.value, stock2Select.value);
    });

    stock2Select.addEventListener("change", () => {
    if (stock1Select.value === stock2Select.value) {
        showError("Veuillez sélectionner deux actions différentes.");
        return;
    }
    hideErrors();
    onStockChange(stock1Select.value, stock2Select.value);
    });

    periodButtons.forEach(button => {
        button.addEventListener("click", () => {
            periodButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const period = button.getAttribute("data-period") as Period;
            onPeriodChange(period);
        });
    });

    chartTypeButtons.addEventListener("change", () => {
        const chartType = chartTypeButtons.value as ChartType;
        onChartTypeChange(chartType);
    });
}
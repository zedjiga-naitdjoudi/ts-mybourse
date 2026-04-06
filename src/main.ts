import { fetchStocks } from "./api/stockApi";  
import { populateStockSelects, eventListeners, updateStats, showError } from "./ui/domManager";
import type { Stock, Period, ChartType } from "./models/stock";
let allStocks: Stock[] = [];
let currentStock1Symbol = "";
let currentStock2Symbol = "";
let currentPeriod: Period = "1W";
let currentChartType: ChartType = "line";

async function main(): Promise<void> {
    try {
        allStocks = await fetchStocks();
        populateStockSelects(allStocks);
        currentStock1Symbol = allStocks[0]?.symbol || "";
        currentStock2Symbol = allStocks[1]?.symbol || "";
        const stock1 = allStocks[0];
        const stock2 = allStocks[1];
        updateStats(stock1, stock2);
        eventListeners((symbol1: string, symbol2: string) => {
            currentStock1Symbol = symbol1;
            currentStock2Symbol = symbol2;
            const stock1 = allStocks.find(s => s.symbol === symbol1)!;
            const stock2 = allStocks.find(s => s.symbol === symbol2)!;
            updateStats(stock1, stock2);
        }, 
        (period: Period) => {
            currentPeriod = period; 
            console.log(`Période changée : ${period}`);
        }, 
        (chartType: ChartType) => {
            currentChartType = chartType; 
            console.log(`Type de graphique changé : ${chartType}`);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        showError("Impossible de charger les données des actions. Veuillez réessayer plus tard.");
    }
}


main();
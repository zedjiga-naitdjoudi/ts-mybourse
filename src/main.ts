import { fetchStocks } from "./api/stockApi";   

async function main(): Promise<void> {
    try { 
        const stocks = await fetchStocks();
        console.log(stocks);
    } catch (error) {
        console.error("Error fetching stocks:", error);
    }
}

main();
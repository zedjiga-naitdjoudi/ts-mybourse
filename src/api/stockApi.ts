import type { Stock } from "../models/stock";    
const API_URL = "https://keligmartin.github.io/api/stocks.json";

export async function fetchStocks(): Promise<Stock[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`Erreur : ${response.status} ${response.statusText}`);
    }
    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
        throw new Error("Données invalides : attendu un tableau de stocks");
    }

    return data as Stock[];

}
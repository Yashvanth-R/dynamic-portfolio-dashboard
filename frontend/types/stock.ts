export interface Stock {
  id: string;
  particulars: string;
  purchasePrice: number;
  quantity: number;
  sector: string;
  exchange: 'NSE' | 'BSE';
  symbol: string;
}

export interface MarketData {
  symbol: string;
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: string | null;
  timestamp: string;
  cached?: boolean;
}

export interface StockWithMarketData extends Stock {
  investment: number;
  portfolioPercentage: number;
  cmp: number;
  presentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  peRatio: number | null;
  latestEarnings: string | null;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  stocks: StockWithMarketData[];
}

export interface PortfolioOverviewData {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}

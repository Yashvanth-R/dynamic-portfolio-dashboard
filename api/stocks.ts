import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

// Simple in-memory cache for Vercel serverless
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface StockData {
  symbol: string;
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: string | null;
  timestamp: string;
  cached?: boolean;
}

async function fetchStockData(symbol: string, exchange: string): Promise<StockData> {
  const cacheKey = `${exchange}:${symbol}`;
  const now = Date.now();
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return { ...cached.data, cached: true };
  }

  try {
    const googleSymbol = exchange === 'NSE' ? `NSE:${symbol}` : `BOM:${symbol}`;
    const url = `https://www.google.com/finance/quote/${googleSymbol}`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    // Parse the response (simplified version)
    const html = response.data;
    
    // Extract current price
    const priceMatch = html.match(/data-last-price="([^"]+)"/);
    const cmp = priceMatch ? parseFloat(priceMatch[1]) : null;
    
    // Extract P/E ratio
    const peMatch = html.match(/P\/E ratio<\/div><div[^>]*>([^<]+)</);
    const peRatio = peMatch ? parseFloat(peMatch[1]) : null;

    const stockData: StockData = {
      symbol,
      cmp,
      peRatio,
      latestEarnings: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      timestamp: new Date().toISOString(),
      cached: false,
    };

    // Cache the result
    cache.set(cacheKey, { data: stockData, timestamp: now });

    return stockData;
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return {
      symbol,
      cmp: null,
      peRatio: null,
      latestEarnings: null,
      timestamp: new Date().toISOString(),
      cached: false,
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/stocks/batch') {
    try {
      const { symbols } = req.body as { symbols: string[] };

      if (!symbols || !Array.isArray(symbols)) {
        return res.status(400).json({ error: 'Invalid request body' });
      }

      // Import portfolio data to get exchange info
      const portfolioData = require('../frontend/data/portfolio.json');
      
      const results = await Promise.all(
        symbols.map(async (symbol) => {
          const stock = portfolioData.find((s: any) => s.symbol === symbol);
          const exchange = stock?.exchange || 'NSE';
          return fetchStockData(symbol, exchange);
        })
      );

      return res.status(200).json(results);
    } catch (error) {
      console.error('Error in batch endpoint:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}

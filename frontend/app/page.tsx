'use client';

import PortfolioTable from '@/components/PortfolioTable';
import SectorSummary from '@/components/SectorSummary';
import { usePortfolio } from '@/hooks/usePortfolio';

export default function Home() {
  const { stocks, sectors, loading, error, lastUpdate, refresh } = usePortfolio();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  const totalInvestment = stocks.reduce((sum, s) => sum + s.investment, 0);
  const totalPresentValue = stocks.reduce((sum, s) => sum + s.presentValue, 0);
  const totalGainLoss = totalPresentValue - totalInvestment;
  const totalGainLossPercentage = (totalGainLoss / totalInvestment) * 100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Portfolio Dashboard</h1>
            <p className="text-gray-600">
              Real-time portfolio tracking with live market data
              {lastUpdate && (
                <span className="ml-2 text-sm">
                  • Last updated: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Error loading data</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Investment</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvestment)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Present Value</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPresentValue)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Gain/Loss</p>
            <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
              {formatCurrency(totalGainLoss)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Return %</p>
            <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Holdings</h2>
          <PortfolioTable stocks={stocks} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sector Analysis</h2>
          <SectorSummary sectors={sectors} />
        </div>
      </div>
    </main>
  );
}

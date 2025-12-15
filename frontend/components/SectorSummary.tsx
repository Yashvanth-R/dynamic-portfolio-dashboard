import { SectorSummary as SectorSummaryType } from '@/types/stock';
import GainLoss from './GainLoss';

interface SectorSummaryProps {
  sectors: SectorSummaryType[];
}

export default function SectorSummary({ sectors }: SectorSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sectors.map((sector) => (
        <div key={sector.sector} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{sector.sector}</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Total Investment</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(sector.totalInvestment)}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Present Value</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(sector.totalPresentValue)}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Gain/Loss</p>
              <GainLoss 
                value={sector.gainLoss} 
                percentage={sector.gainLossPercentage}
                size="large"
              />
            </div>
            
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Holdings ({sector.stocks.length})</p>
              <ul className="space-y-1">
                {sector.stocks.map((stock) => (
                  <li key={stock.id} className="text-sm text-gray-700 flex justify-between">
                    <span>{stock.particulars}</span>
                    <span className="text-xs text-gray-500">{stock.quantity} units</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

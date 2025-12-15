interface GainLossProps {
  value: number;
  percentage: number;
  size?: 'small' | 'medium' | 'large';
}

export default function GainLoss({ value, percentage, size = 'medium' }: GainLossProps) {
  const isProfit = value >= 0;
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const formatPercentage = (val: number) => {
    return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
  };

  const sizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-lg'
  };

  const textSize = sizeClasses[size];

  return (
    <div className={`font-bold ${isProfit ? 'text-profit' : 'text-loss'}`}>
      <div className={textSize}>
        {formatCurrency(value)}
      </div>
      <div className={`${size === 'large' ? 'text-sm' : 'text-xs'} font-normal`}>
        {formatPercentage(percentage)}
      </div>
    </div>
  );
}

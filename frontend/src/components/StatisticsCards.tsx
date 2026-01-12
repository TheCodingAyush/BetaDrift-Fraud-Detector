import { DollarSign, AlertTriangle, Percent, BarChart3 } from 'lucide-react';

interface Statistics {
  totalTransactions: number;
  suspiciousCount: number;
  fraudRate: number;
  totalAtRisk: number;
}

interface StatisticsCardsProps {
  statistics: Statistics;
}

const StatisticsCards = ({ statistics }: StatisticsCardsProps) => {
  const cards = [
    {
      title: 'Total Transactions',
      value: statistics.totalTransactions.toLocaleString(),
      icon: BarChart3,
      gradient: 'gradient-primary',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Suspicious Count',
      value: statistics.suspiciousCount.toLocaleString(),
      icon: AlertTriangle,
      gradient: 'gradient-warning',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
    },
    {
      title: 'Fraud Rate',
      value: `${statistics.fraudRate.toFixed(1)}%`,
      icon: Percent,
      gradient: 'gradient-danger',
      iconBg: 'bg-critical/10',
      iconColor: 'text-critical',
    },
    {
      title: 'Total Amount at Risk',
      value: `$${statistics.totalAtRisk.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'gradient-accent',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.iconBg}`}>
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
            <div className={`h-2 w-12 rounded-full ${card.gradient} opacity-60`} />
          </div>

          <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;

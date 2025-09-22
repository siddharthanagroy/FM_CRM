import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'red' | 'green' | 'blue' | 'purple' | 'yellow';
  subtitle?: string;
  trend?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle, 
  trend 
}) => {
  const colorClasses = {
    red: 'text-red-600 bg-red-50',
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    yellow: 'text-yellow-600 bg-yellow-50',
  };

  const trendColor = trend?.startsWith('+') ? 'text-green-600' : trend?.startsWith('-') ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`ml-2 text-sm font-medium ${trendColor}`}>
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
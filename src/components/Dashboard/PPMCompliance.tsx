import React from 'react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

interface PPMComplianceProps {
  complianceRate: number;
}

const PPMCompliance: React.FC<PPMComplianceProps> = ({ complianceRate }) => {
  const isGood = complianceRate >= 80;
  const isAverage = complianceRate >= 60;

  const getComplianceLevel = () => {
    if (complianceRate >= 90) return { level: 'Excellent', color: 'text-green-600 bg-green-50' };
    if (complianceRate >= 80) return { level: 'Good', color: 'text-green-600 bg-green-50' };
    if (complianceRate >= 60) return { level: 'Average', color: 'text-yellow-600 bg-yellow-50' };
    return { level: 'Poor', color: 'text-red-600 bg-red-50' };
  };

  const compliance = getComplianceLevel();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">PPM Compliance</h3>
        {isGood ? (
          <TrendingUp className="h-5 w-5 text-green-500" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-500" />
        )}
      </div>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#f3f4f6"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={isGood ? "#10b981" : isAverage ? "#f59e0b" : "#ef4444"}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${complianceRate * 2.51} 251`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl font-bold text-gray-900">{complianceRate}%</span>
              <p className="text-xs text-gray-500">Complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Level */}
      <div className="text-center mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${compliance.color}`}>
          <Target className="h-4 w-4 mr-1" />
          {compliance.level}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">This Month</span>
          <span className="text-sm font-medium text-gray-900">{complianceRate}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Last Month</span>
          <span className="text-sm font-medium text-gray-900">85%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Target</span>
          <span className="text-sm font-medium text-green-600">90%</span>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors">
        View PPM Schedule
      </button>
    </div>
  );
};

export default PPMCompliance;
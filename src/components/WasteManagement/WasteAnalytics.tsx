import React, { useState } from 'react';
import { TrendingUp, Download, Calendar, BarChart3, PieChart, Target } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const WasteAnalytics = () => {
  const { getWasteMetrics, wasteEntries, wasteTargets } = useData();
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
    end: new Date().toISOString().split('T')[0], // Today
  });

  const metrics = getWasteMetrics(dateRange.start, dateRange.end);
  const currentYear = new Date().getFullYear();
  const currentTarget = wasteTargets.find(t => t.year === currentYear);

  // Calculate monthly trends
  const getMonthlyTrends = () => {
    const months = [];
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
      const monthMetrics = getWasteMetrics(monthStart, monthEnd);
      
      months.push({
        month: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        totalWaste: monthMetrics.totalWaste,
        diversionRate: monthMetrics.diversionRate,
        netValue: monthMetrics.netValue,
      });
    }
    
    return months;
  };

  const monthlyTrends = getMonthlyTrends();

  // Calculate waste by category
  const getWasteByCategory = () => {
    const categoryData: { [key: string]: number } = {};
    
    wasteEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= new Date(dateRange.start) && entryDate <= new Date(dateRange.end);
      })
      .forEach(entry => {
        let weightInKg = entry.quantity;
        if (entry.unit === 'tonnes') weightInKg *= 1000;
        
        categoryData[entry.wasteCategory] = (categoryData[entry.wasteCategory] || 0) + weightInKg;
      });
    
    return Object.entries(categoryData)
      .map(([category, weight]) => ({ category, weight }))
      .sort((a, b) => b.weight - a.weight);
  };

  const wasteByCategory = getWasteByCategory();

  // Calculate disposal method breakdown
  const getDisposalBreakdown = () => {
    const methodData: { [key: string]: number } = {};
    
    wasteEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= new Date(dateRange.start) && entryDate <= new Date(dateRange.end);
      })
      .forEach(entry => {
        let weightInKg = entry.quantity;
        if (entry.unit === 'tonnes') weightInKg *= 1000;
        
        methodData[entry.disposalMethod] = (methodData[entry.disposalMethod] || 0) + weightInKg;
      });
    
    return Object.entries(methodData)
      .map(([method, weight]) => ({ method, weight, percentage: (weight / metrics.totalWaste) * 100 }))
      .sort((a, b) => b.weight - a.weight);
  };

  const disposalBreakdown = getDisposalBreakdown();

  const handleExportReport = () => {
    const reportData = {
      period: `${dateRange.start} to ${dateRange.end}`,
      summary: metrics,
      monthlyTrends,
      wasteByCategory,
      disposalBreakdown,
      targets: currentTarget,
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `waste-analytics-${dateRange.start}-to-${dateRange.end}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">From:</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">To:</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <button
            onClick={handleExportReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">3R Diversion Rate</p>
              <p className="text-3xl font-bold text-green-600">{metrics.diversionRate}%</p>
              {currentTarget && (
                <p className="text-sm text-gray-500">Target: {currentTarget.diversionRate}%</p>
              )}
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recycling Rate</p>
              <p className="text-3xl font-bold text-blue-600">{metrics.recyclingRate}%</p>
              {currentTarget && (
                <p className="text-sm text-gray-500">Target: {currentTarget.recyclingRate}%</p>
              )}
            </div>
            <BarChart3 className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Waste-to-Energy</p>
              <p className="text-3xl font-bold text-orange-600">{metrics.wasteToEnergyRate}%</p>
              <p className="text-sm text-gray-500">{(metrics.totalWaste * metrics.wasteToEnergyRate / 100).toFixed(1)} kg</p>
            </div>
            <PieChart className="h-8 w-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avoided Landfill</p>
              <p className="text-3xl font-bold text-purple-600">{metrics.avoidedLandfill} kg</p>
              <p className="text-sm text-gray-500">{(100 - metrics.landfillRate).toFixed(1)}% diverted</p>
            </div>
            <Target className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${metrics.totalRevenue}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">${metrics.totalExpense}</div>
            <div className="text-sm text-gray-600">Total Expense</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${metrics.netValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(metrics.netValue)}
            </div>
            <div className="text-sm text-gray-600">Net {metrics.netValue >= 0 ? 'Profit' : 'Loss'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{metrics.carbonFootprint} kg</div>
            <div className="text-sm text-gray-600">CO₂ Footprint</div>
          </div>
        </div>
      </div>

      {/* Charts and Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste by Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Waste by Category</h3>
          <div className="space-y-3">
            {wasteByCategory.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: `hsl(${index * 45}, 70%, 60%)` }}
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {item.category.replace('-', ' ')}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {item.weight.toFixed(1)} kg ({((item.weight / metrics.totalWaste) * 100).toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disposal Method Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Disposal Methods</h3>
          <div className="space-y-3">
            {disposalBreakdown.map((item, index) => (
              <div key={item.method} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {item.method.replace('-', ' ')}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {item.weight.toFixed(1)} kg ({item.percentage.toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Waste (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diversion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyTrends.map((trend, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {trend.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trend.totalWaste.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trend.diversionRate.toFixed(1)}%
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    trend.netValue >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(trend.netValue).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ESG Compliance Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ESG Compliance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Environmental Impact</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {metrics.avoidedLandfill} kg waste diverted from landfill</li>
              <li>• {metrics.carbonFootprint} kg CO₂ equivalent footprint</li>
              <li>• {metrics.recyclingRate}% recycling rate achieved</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Social Responsibility</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Proper hazardous waste disposal</li>
              <li>• Community recycling partnerships</li>
              <li>• Employee waste awareness programs</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Governance</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Transparent waste tracking</li>
              <li>• Regulatory compliance monitoring</li>
              <li>• Third-party vendor certifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteAnalytics;
import React from 'react';
import { BarChart3, PieChart, TrendingUp, Users, Home, Layers, MapPin } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';

const PortfolioDashboard = () => {
  const { organizations, portfolios, campuses, buildings, floors, seatZones } = usePortfolio();

  // Compute dynamic stats
  const totalValue = portfolios.reduce((sum, p) => sum + (p.portfolioValue || 0), 0);
  const totalUnits = seatZones.length;
  const occupancyRate =
    seatZones.length === 0
      ? 0
      : Math.round((seatZones.filter((s) => s.occupancyStatus === 'assigned').length / seatZones.length) * 100);
  const avgRent =
    seatZones.length === 0
      ? 0
      : Math.round(seatZones.reduce((sum, s) => sum + (s.rent || 0), 0) / seatZones.length);

  // Properties by type
  const propertyTypes = ['Residential', 'Commercial', 'Industrial'];
  const propertiesByType = propertyTypes.map((type) => {
    const value = portfolios
      .filter((p) => p.type === type)
      .reduce((sum, p) => sum + (p.portfolioValue || 0), 0);
    const totalPortfolioValue = portfolios.reduce((sum, p) => sum + (p.portfolioValue || 0), 0) || 1;
    const percentage = Math.round((value / totalPortfolioValue) * 100);
    return { type, value, percentage };
  });

  // Properties by location
  const locationMap: Record<string, { count: number }> = {};
  campuses.forEach((c) => {
    locationMap[c.city] = locationMap[c.city] || { count: 0 };
    locationMap[c.city].count += c.buildings.reduce((sum, b) => sum + b.floors.reduce((s, f) => s + f.totalSeats, 0), 0);
  });
  const propertiesByLocation = Object.entries(locationMap).map(([location, { count }]) => {
    const totalSeats = seatZones.length || 1;
    return { location, count, percentage: Math.round((count / totalSeats) * 100) };
  });

  const recentTrends = [
    { metric: 'Portfolio Value', change: '+5.2%', positive: true },
    { metric: 'Occupancy Rate', change: '-1.8%', positive: false },
    { metric: 'Average Rent', change: '+3.1%', positive: true },
  ];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Portfolio Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Total Portfolio Value</h3>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{formatCurrency(totalValue)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Total Units</h3>
            <Home className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{totalUnits}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Occupancy Rate</h3>
            <Users className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{occupancyRate}%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Avg. Rent / Unit</h3>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{formatCurrency(avgRent)}</p>
        </div>
      </div>

      {/* Properties by Type */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Layers className="h-5 w-5 mr-2 text-blue-500" /> Properties by Type
        </h2>
        <div className="space-y-4">
          {propertiesByType.map((item, idx) => (
            <div key={idx} className="flex items-center">
              <div className="w-1/4 text-sm text-gray-600">{item.type}</div>
              <div className="w-3/4">
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatCurrency(item.value)}</span>
                  <span>{item.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Properties by Location */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-red-500" /> Properties by Location
        </h2>
        <div className="space-y-4">
          {propertiesByLocation.map((item, idx) => (
            <div key={idx} className="flex items-center">
              <div className="w-1/3 text-sm text-gray-600">{item.location}</div>
              <div className="w-2/3">
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{item.count} Units</span>
                  <span>{item.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Trends */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-purple-500" /> Recent Trends
        </h2>
        <div className="space-y-3">
          {recentTrends.map((trend, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0"
            >
              <span>{trend.metric}</span>
              <span className={`font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;

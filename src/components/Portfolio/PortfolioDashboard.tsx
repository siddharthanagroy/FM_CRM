import React from 'react';
import { BarChart3, PieChart, TrendingUp, Users, Home, Layers, MapPin } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';

const PortfolioDashboard = () => {
  const { organizations, portfolios, campuses, buildings, floors, seatZones } = usePortfolio();

  const totalOrganizations = organizations.length;
  const totalPortfolios = portfolios.length;
  const totalCampuses = campuses.length;
  const totalBuildings = buildings.length;
  const totalFloors = floors.length;

  const totalSeats = floors.reduce((sum, floor) => sum + Number(floor.totalseats || 0), 0);
  const totalUnits = seatZones.length;

  const occupancyRate =
    seatZones.length === 0
      ? 0
      : Math.round((seatZones.filter((s) => s.occupancyStatus === 'assigned').length / seatZones.length) * 100);

  const totalArea = buildings.reduce((sum, building) => sum + Number(building.totalareacarpet || 0), 0);

  const campusTypes = ['traditional_office', 'sales_office', 'warehouse', 'data_center', 'rd_lab', 'manufacturing', 'retail', 'coworking', 'training_center'];
  const campusesByType = campusTypes.map((type) => {
    const matchingCampuses = campuses.filter(c => c.type === type);
    const count = matchingCampuses.length;
    const percentage = campuses.length > 0 ? Math.round((count / campuses.length) * 100) : 0;
    return {
      type: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage
    };
  }).filter(item => item.count > 0);

  const locationMap: Record<string, { count: number; buildings: number }> = {};
  campuses.forEach((campus) => {
    const city = campus.city || 'Unknown';
    if (!locationMap[city]) {
      locationMap[city] = { count: 0, buildings: 0 };
    }
    const campusBuildings = buildings.filter(b => b.campusId === campus.id);
    locationMap[city].buildings += campusBuildings.length;

    campusBuildings.forEach(building => {
      const buildingFloors = floors.filter(f => f.buildingId === building.id);
      locationMap[city].count += buildingFloors.reduce((sum, f) => sum + f.totalSeats, 0);
    });
  });

  const propertiesByLocation = Object.entries(locationMap)
    .map(([location, { count, buildings: buildingCount }]) => {
      const percentage = totalSeats > 0 ? Math.round((count / totalSeats) * 100) : 0;
      return { location, count, buildings: buildingCount, percentage };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const ownershipStats = {
    leased: buildings.filter(b => b.ownershipType === 'leased').length,
    owned: buildings.filter(b => b.ownershipType === 'owned').length,
  };

  const statusStats = {
    active: campuses.filter(c => c.status === 'active').length,
    inactive: campuses.filter(c => c.status === 'inactive').length,
    retired: campuses.filter(c => c.status === 'retired').length,
  };

  const recentTrends = [
    { metric: 'Total Organizations', value: totalOrganizations.toString(), icon: 'building' },
    { metric: 'Total Portfolios', value: totalPortfolios.toString(), icon: 'briefcase' },
    { metric: 'Active Campuses', value: statusStats.active.toString(), icon: 'map' },
    { metric: 'Total Buildings', value: totalBuildings.toString(), icon: 'home' },
    { metric: 'Total Floors', value: totalFloors.toString(), icon: 'layers' },
    { metric: 'Occupancy Rate', value: `${occupancyRate}%`, icon: 'users' },
  ];

  const formatNumber = (num: number) => num.toLocaleString();
  const formatArea = (area: number) => `${(area / 1000).toFixed(1)}K sq.ft`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Portfolio Analytics Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Total Organizations</h3>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{totalOrganizations}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Total Buildings</h3>
            <Home className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{totalBuildings}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Total Seats</h3>
            <Users className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{formatNumber(totalSeats)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Occupancy Rate</h3>
            <TrendingUp className="h-5 w-5 text-teal-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{occupancyRate}%</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentTrends.map((trend, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm">{trend.metric}</h3>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-lg">{trend.value}</span>
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">{trend.value}</p>
          </div>
        ))}
      </div>

      {/* Campuses by Type */}
      {campusesByType.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Layers className="h-5 w-5 mr-2 text-blue-500" /> Campuses by Type
          </h2>
          <div className="space-y-4">
            {campusesByType.map((item, idx) => (
              <div key={idx} className="flex items-center">
                <div className="w-1/3 text-sm text-gray-600">{item.type}</div>
                <div className="w-2/3">
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{item.count} campus{item.count !== 1 ? 'es' : ''}</span>
                    <span>{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Properties by Location */}
      {propertiesByLocation.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-red-500" /> Seats by Location
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
                    <span>{formatNumber(item.count)} seats · {item.buildings} buildings</span>
                    <span>{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Building Ownership & Campus Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Building Ownership</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Leased Buildings</span>
              <span className="font-bold text-orange-600">{ownershipStats.leased}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Owned Buildings</span>
              <span className="font-bold text-blue-600">{ownershipStats.owned}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Campus Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active</span>
              <span className="font-bold text-green-600">{statusStats.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Inactive</span>
              <span className="font-bold text-yellow-600">{statusStats.inactive}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Retired</span>
              <span className="font-bold text-red-600">{statusStats.retired}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Area */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 rounded-xl shadow-sm text-white">
        <h2 className="text-lg font-semibold mb-2">Total Carpet Area</h2>
        <p className="text-4xl font-bold">{formatArea(totalArea)}</p>
        <p className="text-sm opacity-90 mt-2">Across {totalBuildings} buildings</p>
      </div>
    </div>
  );
};

export default PortfolioDashboard;

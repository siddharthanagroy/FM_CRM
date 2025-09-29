import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Users, Building, MapPin, Home, Layers } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';

const PortfolioDashboard = () => {
  const { portfolios, campuses, buildings, floors, seatZones } = usePortfolio();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('all');

  // Filter data based on selected portfolio
  const filteredCampuses = selectedPortfolio === 'all' 
    ? campuses 
    : campuses.filter(c => c.portfolioId === selectedPortfolio);
  
  const filteredBuildings = buildings.filter(b => 
    filteredCampuses.some(c => c.id === b.campusId)
  );
  
  const filteredFloors = floors.filter(f => 
    filteredBuildings.some(b => b.id === f.buildingId)
  );
  
  const filteredSeatZones = seatZones.filter(s => 
    filteredFloors.some(f => f.id === s.floorId)
  );

  // Calculate metrics
  const metrics = {
    totalCampuses: filteredCampuses.length,
    activeCampuses: filteredCampuses.filter(c => c.status === 'active').length,
    totalBuildings: filteredBuildings.length,
    activeBuildings: filteredBuildings.filter(b => b.status === 'active').length,
    totalFloors: filteredFloors.length,
    totalSeats: filteredFloors.reduce((sum, floor) => sum + floor.totalSeats, 0),
    occupiedSeats: filteredSeatZones.filter(s => s.occupancyStatus === 'assigned').length,
    freeSeats: filteredSeatZones.filter(s => s.occupancyStatus === 'free').length,
    totalArea: filteredBuildings.reduce((sum, building) => sum + (building.totalAreaCarpet || 0), 0),
    leasedBuildings: filteredBuildings.filter(b => b.ownershipType === 'leased').length,
    ownedBuildings: filteredBuildings.filter(b => b.ownershipType === 'owned').length,
    totalParkingSlots: filteredCampuses.reduce((sum, campus) => sum + (campus.totalParkingSlots4W || 0), 0),
    evParkingSlots: filteredCampuses.reduce((sum, campus) => sum + (campus.totalParkingEVSlots || 0), 0),
  };

  // Campus type distribution
  const campusTypeDistribution = filteredCampuses.reduce((acc, campus) => {
    acc[campus.type] = (acc[campus.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Seat type distribution
  const seatTypeDistribution = filteredFloors.reduce((acc, floor) => {
    acc.fixedDesk = (acc.fixedDesk || 0) + floor.seatCounts.fixedDesk;
    acc.hotDesk = (acc.hotDesk || 0) + floor.seatCounts.hotDesk;
    acc.cafeSeat = (acc.cafeSeat || 0) + floor.seatCounts.cafeSeat;
    acc.meetingRoomSeat = (acc.meetingRoomSeat || 0) + floor.seatCounts.meetingRoomSeat;
    return acc;
  }, {} as Record<string, number>);

  // Regional distribution
  const regionalDistribution = portfolios.reduce((acc, portfolio) => {
    const portfolioCampuses = campuses.filter(c => c.portfolioId === portfolio.id);
    if (portfolioCampuses.length > 0) {
      acc[portfolio.region] = (acc[portfolio.region] || 0) + portfolioCampuses.length;
    }
    return acc;
  }, {} as Record<string, number>);

  // Occupancy rate
  const occupancyRate = metrics.totalSeats > 0 
    ? Math.round((metrics.occupiedSeats / filteredSeatZones.length) * 100) 
    : 0;

  // Utilization metrics
  const utilizationMetrics = {
    spaceUtilization: metrics.totalArea > 0 ? Math.round((metrics.occupiedSeats * 100) / (metrics.totalArea / 100)) : 0,
    seatUtilization: occupancyRate,
    buildingUtilization: metrics.totalBuildings > 0 ? Math.round((metrics.activeBuildings / metrics.totalBuildings) * 100) : 0,
    campusUtilization: metrics.totalCampuses > 0 ? Math.round((metrics.activeCampuses / metrics.totalCampuses) * 100) : 0,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate lease costs
  const totalLeaseValue = filteredBuildings
    .filter(b => b.ownershipType === 'leased' && b.leaseDetails)
    .reduce((sum, building) => sum + (building.leaseDetails?.monthlyRent || 0), 0);

  return (
    <div className="space-y-6">
      {/* Portfolio Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Portfolio:</label>
          <select
            value={selectedPortfolio}
            onChange={(e) => setSelectedPortfolio(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Portfolios</option>
            {portfolios.map((portfolio) => (
              <option key={portfolio.id} value={portfolio.id}>
                {portfolio.name} ({portfolio.region})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Campuses</p>
              <p className="text-3xl font-bold text-blue-600">{metrics.totalCampuses}</p>
              <p className="text-sm text-gray-500">{metrics.activeCampuses} active</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Buildings</p>
              <p className="text-3xl font-bold text-green-600">{metrics.totalBuildings}</p>
              <p className="text-sm text-gray-500">{metrics.activeBuildings} active</p>
            </div>
            <Building className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Seats</p>
              <p className="text-3xl font-bold text-purple-600">{metrics.totalSeats.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{occupancyRate}% occupied</p>
            </div>
            <Users className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Area</p>
              <p className="text-3xl font-bold text-orange-600">{Math.round(metrics.totalArea / 1000)}K</p>
              <p className="text-sm text-gray-500">sq.ft carpet area</p>
            </div>
            <Home className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Utilization Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Utilization Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{utilizationMetrics.campusUtilization}%</div>
            <div className="text-sm text-gray-600">Campus Utilization</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${utilizationMetrics.campusUtilization}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{utilizationMetrics.buildingUtilization}%</div>
            <div className="text-sm text-gray-600">Building Utilization</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${utilizationMetrics.buildingUtilization}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{utilizationMetrics.seatUtilization}%</div>
            <div className="text-sm text-gray-600">Seat Utilization</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${utilizationMetrics.seatUtilization}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{utilizationMetrics.spaceUtilization}</div>
            <div className="text-sm text-gray-600">Space Efficiency</div>
            <div className="text-xs text-gray-500 mt-1">seats per 1K sq.ft</div>
          </div>
        </div>
      </div>

      {/* Charts and Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campus Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-green-600" />
            Campus Types
          </h3>
          <div className="space-y-3">
            {Object.entries(campusTypeDistribution).map(([type, count], index) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: `hsl(${index * 45}, 70%, 60%)` }}
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {type.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {count} ({Math.round((count / metrics.totalCampuses) * 100)}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seat Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
            Seat Types
          </h3>
          <div className="space-y-3">
            {Object.entries(seatTypeDistribution).map(([type, count], index) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {count} ({Math.round((count / metrics.totalSeats) * 100)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial and Operational Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ownership Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ownership & Lease</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Owned Buildings</span>
              <span className="text-lg font-semibold text-blue-600">{metrics.ownedBuildings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Leased Buildings</span>
              <span className="text-lg font-semibold text-orange-600">{metrics.leasedBuildings}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="text-sm text-gray-600">Monthly Lease Cost</span>
              <span className="text-lg font-semibold text-green-600">{formatCurrency(totalLeaseValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Annual Lease Cost</span>
              <span className="text-lg font-semibold text-red-600">{formatCurrency(totalLeaseValue * 12)}</span>
            </div>
          </div>
        </div>

        {/* Parking and Amenities */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Parking & Infrastructure</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Parking Slots</span>
              <span className="text-lg font-semibold text-blue-600">{metrics.totalParkingSlots}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">EV Charging Slots</span>
              <span className="text-lg font-semibold text-green-600">{metrics.evParkingSlots}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Green Infrastructure</span>
              <span className="text-lg font-semibold text-teal-600">
                {filteredCampuses.filter(c => c.greenInfrastructure.hasSolar).length} Solar
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">BCP/DR Ready</span>
              <span className="text-lg font-semibold text-purple-600">
                {filteredCampuses.filter(c => c.bcpDrSpaceAvailable).length} Sites
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Distribution */}
      {Object.keys(regionalDistribution).length > 1 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Regional Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(regionalDistribution).map(([region, count], index) => (
              <div key={region} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600">{region}</div>
                <div className="text-xs text-gray-500">
                  {Math.round((count / Object.values(regionalDistribution).reduce((a, b) => a + b, 0)) * 100)}% of total
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioDashboard;
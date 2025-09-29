import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Building2, MapPin, Home, Layers, Users, CreditCard as Edit, Trash2, Plus } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useAuth } from '../../contexts/AuthContext';

const PortfolioHierarchy = () => {
  const { getPortfolioHierarchy, deletePortfolio, deleteCampus, deleteBuilding, deleteFloor } = usePortfolio();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const canManage = user?.role === 'admin' || user?.role === 'fm_manager';
  const hierarchy = getPortfolioHierarchy();

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleDelete = (type: string, id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will also delete all related entities.`)) {
      switch (type) {
        case 'portfolio':
          deletePortfolio(id);
          break;
        case 'campus':
          deleteCampus(id);
          break;
        case 'building':
          deleteBuilding(id);
          break;
        case 'floor':
          deleteFloor(id);
          break;
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'retired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCampusTypeIcon = (type: string) => {
    switch (type) {
      case 'traditional_office':
        return '🏢';
      case 'sales_office':
        return '🏪';
      case 'warehouse':
        return '🏭';
      case 'data_center':
        return '💾';
      case 'rd_lab':
        return '🔬';
      case 'manufacturing':
        return '🏭';
      case 'retail':
        return '🛍️';
      case 'coworking':
        return '🤝';
      case 'training_center':
        return '🎓';
      default:
        return '🏢';
    }
  };

  return (
    <div className="space-y-4">
      {hierarchy.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Portfolio Data</h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first portfolio to organize your facilities.
          </p>
          {canManage && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create Portfolio
            </button>
          )}
        </div>
      ) : (
        hierarchy.map((portfolio) => (
          <div key={portfolio.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Portfolio Level */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleExpanded(`portfolio-${portfolio.id}`)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedItems.has(`portfolio-${portfolio.id}`) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{portfolio.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="font-mono text-blue-600">{portfolio.portfolioId}</span>
                      <span>{portfolio.region}</span>
                      <span>{portfolio.country}</span>
                      <span>{portfolio.campuses.length} campuses</span>
                    </div>
                  </div>
                </div>
                {canManage && (
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('portfolio', portfolio.id, portfolio.name)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Campus Level */}
            {expandedItems.has(`portfolio-${portfolio.id}`) && (
              <div className="pl-8">
                {portfolio.campuses.map((campus) => (
                  <div key={campus.id} className="border-l-2 border-gray-200 ml-4">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleExpanded(`campus-${campus.id}`)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            {expandedItems.has(`campus-${campus.id}`) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                          <MapPin className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">{campus.name}</h4>
                              <span className="text-lg">{getCampusTypeIcon(campus.type)}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(campus.status)}`}>
                                {campus.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="font-mono text-green-600">{campus.campusId}</span>
                              <span>{campus.city}</span>
                              <span>{campus.buildings.length} buildings</span>
                              {campus.totalParkingSlots4W && (
                                <span>🚗 {campus.totalParkingSlots4W} slots</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {canManage && (
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('campus', campus.id, campus.name)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Building Level */}
                    {expandedItems.has(`campus-${campus.id}`) && (
                      <div className="pl-8">
                        {campus.buildings.map((building) => (
                          <div key={building.id} className="border-l-2 border-gray-200 ml-4">
                            <div className="p-4 border-b border-gray-100">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => toggleExpanded(`building-${building.id}`)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    {expandedItems.has(`building-${building.id}`) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </button>
                                  <Home className="h-5 w-5 text-purple-600" />
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <h5 className="font-medium text-gray-900">{building.buildingName}</h5>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(building.status)}`}>
                                        {building.status.toUpperCase()}
                                      </span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        building.ownershipType === 'owned' 
                                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                                          : 'bg-orange-100 text-orange-800 border-orange-200'
                                      }`}>
                                        {building.ownershipType.toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                      <span className="font-mono text-purple-600">{building.buildingId}</span>
                                      <span>{building.numberOfFloors} floors</span>
                                      {building.totalAreaCarpet && (
                                        <span>{(building.totalAreaCarpet / 1000).toFixed(0)}K sq.ft</span>
                                      )}
                                      <span>{building.floors.reduce((sum, floor) => sum + floor.totalSeats, 0)} seats</span>
                                    </div>
                                  </div>
                                </div>
                                {canManage && (
                                  <div className="flex items-center space-x-2">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete('building', building.id, building.buildingName)}
                                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Floor Level */}
                            {expandedItems.has(`building-${building.id}`) && (
                              <div className="pl-8">
                                {building.floors.map((floor) => (
                                  <div key={floor.id} className="border-l-2 border-gray-200 ml-4">
                                    <div className="p-3 border-b border-gray-50">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          <Layers className="h-4 w-4 text-orange-600" />
                                          <div>
                                            <h6 className="font-medium text-gray-900">Floor {floor.floorNumber}</h6>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                              <span className="font-mono text-orange-600">{floor.floorId}</span>
                                              <span>{floor.floorArea.toLocaleString()} sq.ft</span>
                                              <span>{floor.totalSeats} seats</span>
                                              <span>🪑 {floor.seatCounts.fixedDesk}F/{floor.seatCounts.hotDesk}H/{floor.seatCounts.cafeSeat}C</span>
                                            </div>
                                          </div>
                                        </div>
                                        {canManage && (
                                          <div className="flex items-center space-x-2">
                                            <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                                              <Edit className="h-3 w-3" />
                                            </button>
                                            <button
                                              onClick={() => handleDelete('floor', floor.id, `Floor ${floor.floorNumber}`)}
                                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PortfolioHierarchy;
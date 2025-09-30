import React, { useState } from 'react';
import { Building2, Plus, Search, Filter, Download, Upload, Map, BarChart3, Building } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useAuth } from '../../contexts/AuthContext';
import PortfolioHierarchy from './PortfolioHierarchy';
import PortfolioDashboard from './PortfolioDashboard';
import CreateOrganizationModal from './CreateOrganizationModal';
import CreatePortfolioModal from './CreatePortfolioModal';
import CreateCampusModal from './CreateCampusModal';
import CreateBuildingModal from './CreateBuildingModal';
import CreateFloorModal from './CreateFloorModal';
import BulkImportModal from './BulkImportModal';
import Papa from 'papaparse';

const Portfolio = () => {
  const { 
    organizations,
    portfolios, 
    campuses, 
    buildings, 
    floors, 
    seatZones,
    searchEntities 
  } = usePortfolio();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'dashboard'>('hierarchy');
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState<string | null>(null);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  const canManage = user?.role === 'admin' || user?.role === 'fm_manager';

  // Search results
  const searchResults = searchTerm ? searchEntities(searchTerm, entityFilter === 'all' ? undefined : entityFilter) : [];

  // Export functionality
  const handleExport = (entityType: string) => {
    let data: any[] = [];
    let filename = '';

    switch (entityType) {
      case 'organizations':
        data = organizations;
        filename = 'organizations.csv';
        break;
      case 'portfolios':
        data = portfolios;
        filename = 'portfolios.csv';
        break;
      case 'campuses':
        data = campuses;
        filename = 'campuses.csv';
        break;
      case 'buildings':
        data = buildings;
        filename = 'buildings.csv';
        break;
      case 'floors':
        data = floors;
        filename = 'floors.csv';
        break;
      case 'seatzones':
        data = seatZones;
        filename = 'seat_zones.csv';
        break;
      default:
        return;
    }

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate summary statistics
  const stats = {
    totalOrganizations: organizations.length,
    totalPortfolios: portfolios.length,
    totalCampuses: campuses.length,
    totalBuildings: buildings.length,
    totalFloors: floors.length,
    totalSeats: floors.reduce((sum, floor) => sum + floor.totalSeats, 0),
    activeCampuses: campuses.filter(c => c.status === 'active').length,
    activeBuildings: buildings.filter(b => b.status === 'active').length,
    occupiedSeats: seatZones.filter(s => s.occupancyStatus === 'assigned').length,
    totalArea: buildings.reduce((sum, building) => sum + (building.totalAreaCarpet || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Building2 className="h-8 w-8 mr-3 text-blue-600" />
            Portfolio Management
          </h1>
          <p className="text-gray-600">
            Master data layer for organizations, portfolios, campuses, buildings, and floors
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {canManage && (
            <>
              <button
                onClick={() => setShowBulkImportModal(true)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </button>

              <div className="relative">
                <select
                  onChange={(e) => handleExport(e.target.value)}
                  className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>Export Data</option>
                  <option value="organizations">Export Organizations</option>
                  <option value="portfolios">Export Portfolios</option>
                  <option value="campuses">Export Campuses</option>
                  <option value="buildings">Export Buildings</option>
                  <option value="floors">Export Floors</option>
                  <option value="seatzones">Export Seat Zones</option>
                </select>
              </div>

              <div className="relative">
                <select
                  onChange={(e) => setShowCreateModal(e.target.value)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>Create New</option>
                  <option value="organization">Organization</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="campus">Campus</option>
                  <option value="building">Building</option>
                  <option value="floor">Floor</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalOrganizations}</div>
          <div className="text-sm text-gray-600">Organizations</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{stats.totalPortfolios}</div>
          <div className="text-sm text-gray-600">Portfolios</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.activeCampuses}</div>
          <div className="text-sm text-gray-600">Active Campuses</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{stats.activeBuildings}</div>
          <div className="text-sm text-gray-600">Active Buildings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">{stats.totalFloors}</div>
          <div className="text-sm text-gray-600">Total Floors</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalSeats.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Seats</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-teal-600">{Math.round(stats.totalArea / 1000)}K</div>
          <div className="text-sm text-gray-600">Sq.Ft (Carpet)</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hierarchy'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Map className="h-4 w-4 inline mr-2" />
            Hierarchy View
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Analytics Dashboard
          </button>
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search portfolios, campuses, buildings, floors, seats..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Entities</option>
              <option value="organization">Organizations</option>
              <option value="portfolio">Portfolios</option>
              <option value="campus">Campuses</option>
              <option value="building">Buildings</option>
              <option value="floor">Floors</option>
              <option value="seatzone">Seat Zones</option>
            </select>
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Search Results ({searchResults.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.entityType}-${result.id}`}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedEntity(result)}
                >
                  <div>
                    <span className="font-medium">
                      {result.name || result.buildingName || result.floorNumber || result.seatZoneId || result.organizationId}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({result.entityType}) - {result.organizationId || result.portfolioId || result.campusId || result.buildingId || result.floorId}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.status === 'active' ? 'bg-green-100 text-green-800' :
                    result.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                    result.occupancyStatus === 'assigned' ? 'bg-blue-100 text-blue-800' :
                    result.occupancyStatus === 'free' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {result.status || result.occupancyStatus || 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'hierarchy' && <PortfolioHierarchy />}
      {activeTab === 'dashboard' && <PortfolioDashboard />}

      {/* Modals */}
      {showCreateModal === 'organization' && (
        <CreateOrganizationModal
          onClose={() => setShowCreateModal(null)}
          onCreate={() => setShowCreateModal(null)}
        />
      )}

      {showCreateModal === 'portfolio' && (
        <CreatePortfolioModal
          onClose={() => setShowCreateModal(null)}
          onCreate={() => setShowCreateModal(null)}
        />
      )}

      {showCreateModal === 'campus' && (
        <CreateCampusModal
          onClose={() => setShowCreateModal(null)}
          onCreate={() => setShowCreateModal(null)}
        />
      )}

      {showCreateModal === 'building' && (
        <CreateBuildingModal
          onClose={() => setShowCreateModal(null)}
          onCreate={() => setShowCreateModal(null)}
        />
      )}

      {showCreateModal === 'floor' && (
        <CreateFloorModal
          onClose={() => setShowCreateModal(null)}
          onCreate={() => setShowCreateModal(null)}
        />
      )}

      {showBulkImportModal && (
        <BulkImportModal
          onClose={() => setShowBulkImportModal(false)}
        />
      )}
    </div>
  );
};

export default Portfolio;
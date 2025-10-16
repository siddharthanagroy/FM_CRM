import React, { useState } from 'react';
import { Building2, Plus, Search, Filter, Download, Upload, Map, BarChart3, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useAuth } from '../../contexts/AuthContext';
import PortfolioHierarchy, { PortfolioProvider } from './PortfolioHierarchy';
import PortfolioDashboard from './PortfolioDashboard';
import CreateOrganizationModal from './CreateOrganizationModal';
import CreatePortfolioModal from './CreatePortfolioModal';
import CreateCampusModal from './CreateCampusModal';
import CreateBuildingModal from './CreateBuildingModal';
import CreateFloorModal from './CreateFloorModal';
import BulkImportModal from './BulkImportModal';
import OfficeSelector from './OfficeSelector';
import Papa from 'papaparse';

const Portfolio = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'fm_manager';

  const [activeTab, setActiveTab] = useState<'hierarchy' | 'dashboard'>('hierarchy');
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState<string | null>(null);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [showOfficeSelector, setShowOfficeSelector] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<{
    organizationId: string;
    portfolioId: string;
    campusId: string;
    buildingId: string;
    displayName: string;
  } | null>(null);

  const handleOfficeSelect = (selection: {
    organizationId: string;
    portfolioId: string;
    campusId: string;
    buildingId: string;
    displayName: string;
  }) => {
    setSelectedOffice(selection);
    setShowOfficeSelector(false);
    localStorage.setItem('selectedOffice', JSON.stringify(selection));
  };

  const handleExport = (entityType: string, data: any[], filename: string) => {
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

  return (
    <PortfolioProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Portfolio Management
              </h1>
            </div>

            {/* Selected Office */}
            {/*
            {selectedOffice ? (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <span className="font-medium text-blue-900">Selected Office:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-800">{selectedOffice.displayName}</span>
                  </div>
                  <button
                    onClick={() => setShowOfficeSelector(true)}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <button
                  onClick={() => setShowOfficeSelector(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Select an office to filter data
                </button>
              </div>
            )}
            */}
          </div>

          {/* Right side buttons */}
          {canManage && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowBulkImportModal(true)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </button>

              <select
                onChange={(e) => handleExport(e.target.value, [], `${e.target.value}.csv`)}
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
          )}
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

        {/* Hierarchy or Dashboard */}
        {activeTab === 'hierarchy' && <PortfolioHierarchy />}
        {activeTab === 'dashboard' && <PortfolioDashboard />}

        {/* Modals */}
        {showCreateModal === 'organization' && <CreateOrganizationModal onClose={() => setShowCreateModal(null)} onCreate={() => setShowCreateModal(null)} />}
        {showCreateModal === 'portfolio' && <CreatePortfolioModal onClose={() => setShowCreateModal(null)} onCreate={() => setShowCreateModal(null)} />}
        {showCreateModal === 'campus' && <CreateCampusModal onClose={() => setShowCreateModal(null)} onCreate={() => setShowCreateModal(null)} />}
        {showCreateModal === 'building' && <CreateBuildingModal onClose={() => setShowCreateModal(null)} onCreate={() => setShowCreateModal(null)} />}
        {showCreateModal === 'floor' && <CreateFloorModal onClose={() => setShowCreateModal(null)} onCreate={() => setShowCreateModal(null)} />}
        {showBulkImportModal && <BulkImportModal onClose={() => setShowBulkImportModal(false)} />}
        {showOfficeSelector && <OfficeSelector onSelect={handleOfficeSelect} onClose={() => setShowOfficeSelector(false)} />}
      </div>
    </PortfolioProvider>
  );
};

export default Portfolio;

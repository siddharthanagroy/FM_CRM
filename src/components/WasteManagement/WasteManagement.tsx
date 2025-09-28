import React, { useState } from 'react';
import { Plus, Filter, Search, Download, Upload, Recycle, TrendingUp, DollarSign, Leaf } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import WasteEntryCard from './WasteEntryCard';
import CreateWasteEntryModal from './CreateWasteEntryModal';
import WasteAnalytics from './WasteAnalytics';
import WasteVendors from './WasteVendors';
import WasteTargets from './WasteTargets';
import Papa from 'papaparse';

const WasteManagement = () => {
  const { wasteEntries, bulkImportWasteEntries, getWasteMetrics } = useData();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'entries' | 'analytics' | 'vendors' | 'targets'>('entries');

  // Filter waste entries
  const filteredEntries = wasteEntries.filter(entry => {
    const matchesSearch = entry.entryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.wasteCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || entry.wasteCategory === categoryFilter;
    const matchesMethod = methodFilter === 'all' || entry.disposalMethod === methodFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const entryDate = new Date(entry.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = entryDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = entryDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = entryDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesMethod && matchesDate;
  });

  const canCreateEntry = user?.role === 'admin' || user?.role === 'fm_manager' || user?.role === 'hk_team';
  const canViewAnalytics = user?.role === 'admin' || user?.role === 'fm_manager';

  // Get current metrics
  const metrics = getWasteMetrics();

  // Export CSV
  const handleExport = () => {
    const csv = Papa.unparse(filteredEntries);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'waste_entries.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import CSV
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        bulkImportWasteEntries(result.data);
        alert(`Imported ${result.data.length} waste entries successfully!`);
      },
    });
  };

  const wasteCategories = ['general', 'recyclables', 'hazardous', 'e-waste', 'food', 'biomedical', 'organic', 'paper', 'plastic', 'metal', 'glass'];
  const disposalMethods = ['landfill', 'recycle', 'reuse', 'waste-to-energy', 'incineration', 'composting', 'treatment'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Recycle className="h-8 w-8 mr-3 text-green-600" />
            Waste Management
          </h1>
          <p className="text-gray-600">
            Track waste streams, monitor 3R metrics, and generate ESG reports
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Import */}
          {canCreateEntry && (
            <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          )}

          {/* Export */}
          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          
          {canCreateEntry && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{metrics.diversionRate}%</div>
              <div className="text-sm text-gray-600">Diversion Rate</div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{metrics.totalWaste} kg</div>
          <div className="text-sm text-gray-600">Total Waste</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">${metrics.netValue}</div>
              <div className="text-sm text-gray-600">Net Value</div>
            </div>
            <DollarSign className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{metrics.carbonFootprint} kg</div>
              <div className="text-sm text-gray-600">CO₂ Footprint</div>
            </div>
            <Leaf className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('entries')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'entries'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Waste Entries ({filteredEntries.length})
          </button>
          {canViewAnalytics && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics & Reports
            </button>
          )}
          {canViewAnalytics && (
            <button
              onClick={() => setActiveTab('vendors')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vendors'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vendors
            </button>
          )}
          {canViewAnalytics && (
            <button
              onClick={() => setActiveTab('targets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'targets'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Targets & Goals
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'entries' && (
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search entries, location, category..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Categories</option>
                  {wasteCategories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Method Filter */}
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Methods</option>
                {disposalMethods.map((method) => (
                  <option key={method} value={method}>
                    {method.charAt(0).toUpperCase() + method.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Waste Entries List */}
          <div className="space-y-4">
            {filteredEntries.length > 0 ? (
              filteredEntries.map(entry => (
                <WasteEntryCard key={entry.id} entry={entry} />
              ))
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-gray-400 text-lg mb-2">No waste entries found</div>
                <p className="text-gray-500">
                  {searchTerm || categoryFilter !== 'all' || methodFilter !== 'all' || dateFilter !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : canCreateEntry
                    ? 'Get started by creating your first waste entry.'
                    : 'No waste entries have been recorded yet.'
                  }
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'analytics' && <WasteAnalytics />}
      {activeTab === 'vendors' && <WasteVendors />}
      {activeTab === 'targets' && <WasteTargets />}

      {/* Create Waste Entry Modal */}
      {showCreateModal && (
        <CreateWasteEntryModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default WasteManagement;
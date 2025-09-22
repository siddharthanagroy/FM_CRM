import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Package, Table } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import AssetCard from './AssetCard';
import CreateAssetModal from './CreateAssetModal';
import Papa from 'papaparse';

const Assets = () => {
  const { assets } = useData();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || asset.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' ||
      asset.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const canCreateAsset = user?.role === 'admin' || user?.role === 'fm_manager';

  // Stats
  const totalAssets = filteredAssets.length;
  const activeAssets = filteredAssets.filter(
    (a) => a.status === 'active'
  ).length;
  const maintenanceAssets = filteredAssets.filter(
    (a) => a.status === 'maintenance'
  ).length;
  const inactiveAssets = filteredAssets.filter(
    (a) => a.status === 'inactive'
  ).length;

  // Unique categories
  const categories = [...new Set(assets.map((asset) => asset.category))];

  // Export CSV
  const handleExport = () => {
    const csv = Papa.unparse(filteredAssets);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'assets.csv');
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
        console.log('Imported assets:', result.data);
        // 👉 TODO: you can call your createAsset() from DataContext here
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-600">Manage facility assets and equipment</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Import */}
          <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Import
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>

          {/* New Asset */}
          {canCreateAsset && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Asset
            </button>
          )}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-1 rounded ${
            viewMode === 'grid'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Grid View
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-3 py-1 rounded ${
            viewMode === 'table'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Table View
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {totalAssets}
              </div>
              <div className="text-sm text-gray-600">Total Assets</div>
            </div>
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {activeAssets}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {maintenanceAssets}
          </div>
          <div className="text-sm text-gray-600">In Maintenance</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {inactiveAssets}
          </div>
          <div className="text-sm text-gray-600">Inactive</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search assets, asset ID, location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assets List */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Asset ID
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Category
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Location
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Model
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Manufacturer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{asset.assetId}</td>
                  <td className="px-4 py-2">{asset.name}</td>
                  <td className="px-4 py-2">{asset.category}</td>
                  <td className="px-4 py-2 capitalize">{asset.status}</td>
                  <td className="px-4 py-2">{asset.location}</td>
                  <td className="px-4 py-2">{asset.model}</td>
                  <td className="px-4 py-2">{asset.manufacturer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))
          ) : (
            <div className="col-span-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-gray-400 text-lg mb-2">No assets found</div>
              <p className="text-gray-500">
                {searchTerm ||
                statusFilter !== 'all' ||
                categoryFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : canCreateAsset
                  ? 'Get started by adding your first asset.'
                  : 'No assets have been added yet.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Asset Modal */}
      {showCreateModal && (
        <CreateAssetModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default Assets;

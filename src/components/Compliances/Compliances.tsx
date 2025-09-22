import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Shield, AlertTriangle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import ComplianceCard from './ComplianceCard';
import CreateComplianceModal from './CreateComplianceModal';
import Papa from 'papaparse';

const Compliances = () => {
  const { compliances } = useData();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter compliances
  const filteredCompliances = compliances.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complianceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const canCreateCompliance = user?.role === 'admin' || user?.role === 'fm_manager';

  // Stats
  const totalCompliances = filteredCompliances.length;
  const activeCompliances = filteredCompliances.filter((c) => c.status === 'active').length;
  const pendingRenewal = filteredCompliances.filter((c) => c.status === 'pending_renewal').length;
  const expiredCompliances = filteredCompliances.filter((c) => c.status === 'expired').length;

  // Unique categories
  const categories = [...new Set(compliances.map((c) => c.category))];

  // Export CSV
  const handleExport = () => {
    const csv = Papa.unparse(filteredCompliances);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'compliances.csv');
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
        console.log('Imported compliances:', result.data);
        // 👉 TODO: call createCompliance() from DataContext here
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-gray-600">Track legal and statutory requirements</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Import */}
          <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Import
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
          </label>

          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>

          {/* New Compliance */}
          {canCreateCompliance && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Compliance
            </button>
          )}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Grid View
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-3 py-1 rounded ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Table View
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalCompliances}</div>
              <div className="text-sm text-gray-600">Total Compliances</div>
            </div>
            <Shield className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{activeCompliances}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{pendingRenewal}</div>
          <div className="text-sm text-gray-600 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Pending Renewal
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{expiredCompliances}</div>
          <div className="text-sm text-gray-600">Expired</div>
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
              placeholder="Search compliances, certificate number..."
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
              <option value="pending_renewal">Pending Renewal</option>
              <option value="expired">Expired</option>
              <option value="not_applicable">Not Applicable</option>
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
                {category.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Compliances List */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Compliance ID</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Description</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Category</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Issuing Authority</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Certificate No.</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Location</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Issue Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Expiry Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Renewal Frequency (Months)</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Notification Days</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCompliances.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{c.complianceId}</td>
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.description}</td>
                  <td className="px-4 py-2">{c.category}</td>
                  <td className="px-4 py-2">{c.type}</td>
                  <td className="px-4 py-2">{c.issuingAuthority}</td>
                  <td className="px-4 py-2">{c.certificateNumber}</td>
                  <td className="px-4 py-2">{c.location}</td>
                  <td className="px-4 py-2">{c.issueDate}</td>
                  <td className="px-4 py-2">{c.expiryDate || '-'}</td>
                  <td className="px-4 py-2">{c.renewalFrequency || '-'}</td>
                  <td className="px-4 py-2">{c.notificationDays || '-'}</td>
                  <td className="px-4 py-2 capitalize">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompliances.length > 0 ? (
            filteredCompliances.map((c) => <ComplianceCard key={c.id} compliance={c} />)
          ) : (
            <div className="col-span-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-gray-400 text-lg mb-2">No compliances found</div>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : canCreateCompliance
                  ? 'Get started by adding your first compliance requirement.'
                  : 'No compliance requirements have been added yet.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Compliance Modal */}
      {showCreateModal && (
        <CreateComplianceModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default Compliances;

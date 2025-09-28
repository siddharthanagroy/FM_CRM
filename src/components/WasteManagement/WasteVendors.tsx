import React, { useState } from 'react';
import { Plus, Search, Filter, Phone, Mail, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import CreateWasteVendorModal from './CreateWasteVendorModal';

const WasteVendors = () => {
  const { wasteVendors, updateWasteVendor } = useData();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter vendors
  const filteredVendors = wasteVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.vendorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || vendor.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && vendor.isActive) ||
                         (statusFilter === 'inactive' && !vendor.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const canManageVendors = user?.role === 'admin' || user?.role === 'fm_manager';

  const handleToggleStatus = (vendorId: string, currentStatus: boolean) => {
    updateWasteVendor(vendorId, { isActive: !currentStatus });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'collection':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'recycling':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disposal':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'treatment':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'waste-to-energy':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const vendorTypes = ['collection', 'recycling', 'disposal', 'treatment', 'waste-to-energy'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Waste Vendors</h2>
          <p className="text-gray-600">Manage waste collection and disposal vendors</p>
        </div>

        {canManageVendors && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{filteredVendors.length}</div>
          <div className="text-sm text-gray-600">Total Vendors</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {filteredVendors.filter(v => v.isActive).length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {filteredVendors.filter(v => v.type === 'recycling').length}
          </div>
          <div className="text-sm text-gray-600">Recycling Partners</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {filteredVendors.filter(v => v.type === 'waste-to-energy').length}
          </div>
          <div className="text-sm text-gray-600">Waste-to-Energy</div>
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
              placeholder="Search vendors, contact person..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Types</option>
              {vendorTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length > 0 ? (
          filteredVendors.map(vendor => (
            <div key={vendor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                    {vendor.isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="font-mono text-sm text-blue-600 font-medium">{vendor.vendorId}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(vendor.type)}`}>
                      {vendor.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{vendor.contactPerson}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{vendor.phone}</span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span className="text-xs">{vendor.address}</span>
                </div>
              </div>

              {/* Waste Categories */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Waste Categories:</div>
                <div className="flex flex-wrap gap-1">
                  {vendor.wasteCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {vendor.certifications.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Certifications:</div>
                  <div className="flex flex-wrap gap-1">
                    {vendor.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contract Period */}
              <div className="text-sm text-gray-600 mb-4">
                <div>Contract: {new Date(vendor.contractStartDate).toLocaleDateString()} - {new Date(vendor.contractEndDate).toLocaleDateString()}</div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
                  View Details
                </button>
                
                {canManageVendors && (
                  <>
                    <button
                      onClick={() => handleToggleStatus(vendor.id, vendor.isActive)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        vendor.isActive
                          ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                          : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                      }`}
                    >
                      {vendor.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    
                    <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-gray-400 text-lg mb-2">No vendors found</div>
            <p className="text-gray-500">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : canManageVendors
                ? 'Get started by adding your first waste vendor.'
                : 'No waste vendors have been added yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Create Vendor Modal */}
      {showCreateModal && (
        <CreateWasteVendorModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default WasteVendors;
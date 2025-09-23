import React, { useState } from 'react';
import { Plus, Filter, Search, Download, Upload, FileText } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import ServiceRequestCard from './ServiceRequestCard';
import CreateServiceRequestModal from './CreateServiceRequestModal';
import Papa from 'papaparse';

const ServiceRequests = () => {
  const { complaints, bulkImportComplaints, createWorkOrder, createServiceOrder } = useData();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter service requests
  const filteredServiceRequests = complaints.filter(sr => {
    const matchesSearch = sr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sr.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sr.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || sr.category === categoryFilter;
    
    // For end users, only show their service requests
    if (user?.role === 'end_user') {
      return matchesSearch && matchesStatus && matchesCategory && sr.requesterEmail === user.email;
    }
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const canCreateServiceRequest = user?.role === 'end_user' || user?.role === 'admin' || user?.role === 'fm_manager';

  // Convert to Work Order
  const handleConvertToWorkOrder = (serviceRequest: any) => {
    const workOrder = {
      title: `WO: ${serviceRequest.title}`,
      description: `Asset-related work order converted from SR ${serviceRequest.ticketId}: ${serviceRequest.description}`,
      type: 'corrective' as const,
      priority: serviceRequest.priority,
      status: 'open' as const,
      assignedTo: serviceRequest.assignedTo || '',
      complaintId: serviceRequest.id,
      dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
      estimatedHours: serviceRequest.priority === 'high' ? 4 : serviceRequest.priority === 'medium' ? 6 : 8,
    };
    
    createWorkOrder(workOrder);
    alert(`Work Order created successfully for SR ${serviceRequest.ticketId}`);
  };

  // Convert to Service Order
  const handleConvertToServiceOrder = (serviceRequest: any) => {
    const serviceOrder = {
      title: `SO: ${serviceRequest.title}`,
      description: `Service order converted from SR ${serviceRequest.ticketId}: ${serviceRequest.description}`,
      type: 'general' as const,
      priority: serviceRequest.priority,
      status: 'open' as const,
      assignedTo: serviceRequest.assignedTo || '',
      assignedTeam: serviceRequest.assignedTeam,
      complaintId: serviceRequest.id,
      dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72 hours from now
      estimatedHours: serviceRequest.priority === 'high' ? 2 : serviceRequest.priority === 'medium' ? 4 : 6,
    };
    
    createServiceOrder(serviceOrder);
    alert(`Service Order created successfully for SR ${serviceRequest.ticketId}`);
  };

  // Export CSV
  const handleExport = () => {
    const csv = Papa.unparse(filteredServiceRequests);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'service_requests.csv');
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
        bulkImportComplaints(result.data);
        alert(`Imported ${result.data.length} service requests successfully!`);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="h-8 w-8 mr-3 text-blue-600" />
            {user?.role === 'end_user' ? 'My Service Requests' : 'Service Requests'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'end_user' 
              ? 'Track your submitted service requests and issues'
              : 'Manage facility service requests from end users'
            }
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Import */}
          {(user?.role === 'admin' || user?.role === 'fm_manager') && (
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
          
          {canCreateServiceRequest && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Service Request
            </button>
          )}
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
              placeholder="Search service requests, SR ID..."
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
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="pending-parts">Pending Parts</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="hvac">HVAC</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{filteredServiceRequests.length}</div>
          <div className="text-sm text-gray-600">Total Service Requests</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {filteredServiceRequests.filter(sr => ['open', 'assigned', 'in-progress'].includes(sr.status)).length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {filteredServiceRequests.filter(sr => sr.status === 'resolved').length}
          </div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {filteredServiceRequests.filter(sr => sr.priority === 'high').length}
          </div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
      </div>

      {/* Service Requests List */}
      <div className="space-y-4">
        {filteredServiceRequests.length > 0 ? (
          filteredServiceRequests.map(serviceRequest => (
            <ServiceRequestCard 
              key={serviceRequest.id} 
              serviceRequest={serviceRequest}
              onConvertToWorkOrder={handleConvertToWorkOrder}
              onConvertToServiceOrder={handleConvertToServiceOrder}
            />
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-gray-400 text-lg mb-2">No service requests found</div>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : canCreateServiceRequest
                ? 'Get started by creating your first service request.'
                : 'No service requests have been submitted yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Create Service Request Modal */}
      {showCreateModal && (
        <CreateServiceRequestModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default ServiceRequests;
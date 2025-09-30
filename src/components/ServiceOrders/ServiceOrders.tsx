import React, { useState } from 'react';
import { Plus, Filter, Search, FileCheck, Clock, Wrench } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useOfficeSelection } from '../../hooks/useOfficeSelection';
import ServiceOrderCard from './ServiceOrderCard';

const ServiceOrders = () => {
  const { serviceOrders } = useData();
  const { user } = useAuth();
  const { getOfficeContext } = useOfficeSelection();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Get office context for filtering
  const officeContext = getOfficeContext();

  // Filter service orders based on user role and filters
  const filteredServiceOrders = serviceOrders.filter(serviceOrder => {
    const matchesSearch = serviceOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         serviceOrder.serviceOrderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || serviceOrder.status === statusFilter;
    const matchesType = typeFilter === 'all' || serviceOrder.type === typeFilter;
    
    // For technicians, only show their assigned service orders
    if (user?.role === 'technician' || user?.role === 'hk_team') {
      return matchesSearch && matchesStatus && matchesType && serviceOrder.assignedTo === user.name;
    }
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const canCreateServiceOrder = user?.role === 'admin' || user?.role === 'fm_manager';

  // Calculate stats
  const totalServiceOrders = filteredServiceOrders.length;
  const openServiceOrders = filteredServiceOrders.filter(so => ['open', 'assigned', 'in-progress'].includes(so.status)).length;
  const completedServiceOrders = filteredServiceOrders.filter(so => so.status === 'resolved').length;
  const overdueServiceOrders = filteredServiceOrders.filter(so => 
    new Date(so.dueDate) < new Date() && so.status !== 'resolved'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Wrench className="h-8 w-8 mr-3 text-green-600" />
            {user?.role === 'technician' || user?.role === 'hk_team' ? 'My Service Orders' : 'Service Orders'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'technician' || user?.role === 'hk_team'
              ? 'Your assigned non-asset service tasks and compliance work'
              : 'Manage non-asset service orders (compliance, cleaning, general services)'
            }
           {officeContext && (
             <span className="block text-sm text-blue-600 mt-1">
               📍 Context: {officeContext.building?.buildingName} - {officeContext.campus?.name}
             </span>
           )}
          </p>
        </div>

        {canCreateServiceOrder && (
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            New Service Order
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalServiceOrders}</div>
              <div className="text-sm text-gray-600">Total Service Orders</div>
            </div>
            <FileCheck className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{openServiceOrders}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{completedServiceOrders}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{overdueServiceOrders}</div>
          <div className="text-sm text-gray-600 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Overdue
          </div>
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
              placeholder="Search service orders, SO ID..."
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
              <option value="pending-approval">Pending Approval</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="general">General</option>
            <option value="compliance">Compliance</option>
            <option value="cleaning">Cleaning</option>
          </select>
        </div>
      </div>

      {/* Service Orders List */}
      <div className="space-y-4">
        {filteredServiceOrders.length > 0 ? (
          filteredServiceOrders.map(serviceOrder => (
            <ServiceOrderCard key={serviceOrder.id} serviceOrder={serviceOrder} />
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-gray-400 text-lg mb-2">No service orders found</div>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : user?.role === 'technician' || user?.role === 'hk_team'
                ? 'No non-asset service orders have been assigned to you yet.'
                : 'No non-asset service orders have been created yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceOrders;
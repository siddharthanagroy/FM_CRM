import React, { useState } from 'react';
import { Plus, Filter, Search, Calendar, Clock, Wrench } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useOfficeSelection } from '../../hooks/useOfficeSelection';
import WorkOrderCard from './WorkOrderCard';

const WorkOrders = () => {
  const { workOrders } = useData();
  const { user } = useAuth();
  const { getOfficeContext } = useOfficeSelection();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Get office context for filtering
  const officeContext = getOfficeContext();

  // Filter work orders based on user role and filters
  const filteredWorkOrders = workOrders.filter(workOrder => {
    // Note: Work orders are asset-related, so we could filter by asset location
    // For now, we'll show all work orders but this can be enhanced
    
    const matchesSearch = workOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workOrder.workOrderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workOrder.status === statusFilter;
    const matchesType = typeFilter === 'all' || workOrder.type === typeFilter;
    
    // For technicians, only show their assigned work orders
    if (user?.role === 'technician' || user?.role === 'hk_team') {
      return matchesSearch && matchesStatus && matchesType && workOrder.assignedTo === user.name;
    }
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const canCreateWorkOrder = user?.role === 'admin' || user?.role === 'fm_manager';

  // Calculate stats
  const totalWorkOrders = filteredWorkOrders.length;
  const openWorkOrders = filteredWorkOrders.filter(wo => ['open', 'assigned', 'in-progress'].includes(wo.status)).length;
  const completedWorkOrders = filteredWorkOrders.filter(wo => wo.status === 'completed').length;
  const overdueWorkOrders = filteredWorkOrders.filter(wo => 
    new Date(wo.dueDate) < new Date() && wo.status !== 'completed'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Wrench className="h-8 w-8 mr-3 text-blue-600" />
            {user?.role === 'technician' || user?.role === 'hk_team' ? 'My Work Orders' : 'Work Orders'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'technician' || user?.role === 'hk_team'
              ? 'Your assigned asset maintenance and PPM tasks'
              : 'Manage asset-related maintenance work orders (PPM, breakdowns, inspections)'
            }
            {officeContext && (
              <span className="block text-sm text-blue-600 mt-1">
                📍 Context: {officeContext.building?.buildingName} - {officeContext.campus?.name}
              </span>
            )}
          </p>
        </div>

        {canCreateWorkOrder && (
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{totalWorkOrders}</div>
          <div className="text-sm text-gray-600">Total Work Orders</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{openWorkOrders}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{completedWorkOrders}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{overdueWorkOrders}</div>
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
              placeholder="Search work orders, WO ID..."
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
              <option value="completed">Completed</option>
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
            <option value="corrective">Corrective</option>
            <option value="preventive">Preventive</option>
            <option value="inspection">Inspection</option>
          </select>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-4">
        {filteredWorkOrders.length > 0 ? (
          filteredWorkOrders.map(workOrder => (
            <WorkOrderCard key={workOrder.id} workOrder={workOrder} />
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-gray-400 text-lg mb-2">No work orders found</div>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : user?.role === 'technician' || user?.role === 'hk_team'
                ? 'No asset maintenance work orders have been assigned to you yet.'
                : 'No asset maintenance work orders have been created yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkOrders;
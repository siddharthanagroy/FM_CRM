import React, { useState } from 'react';
import { Plus, Search, Filter, CheckSquare, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import ChecklistCard from './ChecklistCard';
import CreateChecklistModal from './CreateChecklistModal';
import ChecklistExecutionModal from './ChecklistExecutionModal';

const Checklists = () => {
  const { checklists, checklistExecutions } = useData();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'templates' | 'executions'>('templates');

  // Filter checklists based on user role and filters
  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = checklist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checklist.checklistId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || checklist.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || checklist.status === statusFilter;
    
    // For technicians, only show checklists assigned to their department
    if (user?.role === 'technician' || user?.role === 'hk_team') {
      const userDepartment = user.department?.toLowerCase();
      return matchesSearch && matchesCategory && matchesStatus && 
             (checklist.assignedDepartments.includes(userDepartment || '') || 
              checklist.assignedDepartments.includes('all'));
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filter executions
  const filteredExecutions = checklistExecutions.filter(execution => {
    const matchesSearch = execution.checklistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         execution.executionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For technicians, only show their executions
    if (user?.role === 'technician' || user?.role === 'hk_team') {
      return matchesSearch && execution.assignedTo === user.name;
    }
    
    return matchesSearch;
  });

  const canCreateChecklist = user?.role === 'admin' || user?.role === 'fm_manager';

  // Calculate stats
  const totalChecklists = filteredChecklists.length;
  const activeChecklists = filteredChecklists.filter(c => c.status === 'active').length;
  const pendingExecutions = filteredExecutions.filter(e => e.status === 'pending').length;
  const overdueExecutions = filteredExecutions.filter(e => 
    new Date(e.dueDate) < new Date() && e.status === 'pending'
  ).length;

  const handleExecuteChecklist = (checklist: any) => {
    setSelectedChecklist(checklist);
    setShowExecutionModal(true);
  };

  const categories = ['Safety', 'Compliance', 'Maintenance', 'Housekeeping', 'Energy Management', 'Security'];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {user?.role === 'technician' || user?.role === 'hk_team' ? 'My Checklists' : 'Digital Checklists'}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {user?.role === 'technician' || user?.role === 'hk_team'
              ? 'Complete your assigned inspection and maintenance checklists'
              : 'Manage digital checklists for inspections, maintenance, and compliance'
            }
          </p>
        </div>

        {canCreateChecklist && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Checklist
          </button>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex items-center space-x-2 overflow-x-auto">
        <button
          onClick={() => setViewMode('templates')}
          className={`px-3 py-2 rounded text-sm whitespace-nowrap ${
            viewMode === 'templates'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Templates ({totalChecklists})
        </button>
        <button
          onClick={() => setViewMode('executions')}
          className={`px-3 py-2 rounded text-sm whitespace-nowrap ${
            viewMode === 'executions'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Executions ({filteredExecutions.length})
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalChecklists}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Templates</div>
            </div>
            <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-xl sm:text-2xl font-bold text-green-600">{activeChecklists}</div>
          <div className="text-xs sm:text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{pendingExecutions}</div>
          <div className="text-xs sm:text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-xl sm:text-2xl font-bold text-red-600">{overdueExecutions}</div>
          <div className="text-xs sm:text-sm text-gray-600 flex items-center">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Overdue
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search checklists..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'templates' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredChecklists.length > 0 ? (
            filteredChecklists.map(checklist => (
              <ChecklistCard 
                key={checklist.id} 
                checklist={checklist} 
                onExecute={handleExecuteChecklist}
              />
            ))
          ) : (
            <div className="col-span-full bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-gray-400 text-lg mb-2">No checklists found</div>
              <p className="text-gray-500 text-sm">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : canCreateChecklist
                  ? 'Get started by creating your first checklist template.'
                  : 'No checklist templates have been created yet.'
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExecutions.length > 0 ? (
            filteredExecutions.map(execution => (
              <div key={execution.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{execution.checklistName}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        execution.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        execution.status === 'in-progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {execution.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="font-mono text-blue-600 font-medium">{execution.executionId}</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {new Date(execution.dueDate).toLocaleDateString()}</span>
                      </div>
                      <span>Assigned to: {execution.assignedTo}</span>
                      {execution.completedAt && (
                        <span className="text-green-600">
                          Completed: {new Date(execution.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {execution.status === 'pending' && (
                      <button
                        onClick={() => {
                          const checklist = checklists.find(c => c.id === execution.checklistId);
                          if (checklist) handleExecuteChecklist(checklist);
                        }}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      >
                        Start
                      </button>
                    )}
                    <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-gray-400 text-lg mb-2">No executions found</div>
              <p className="text-gray-500 text-sm">
                No checklist executions have been created yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Checklist Modal */}
      {showCreateModal && (
        <CreateChecklistModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => setShowCreateModal(false)}
        />
      )}

      {/* Checklist Execution Modal */}
      {showExecutionModal && selectedChecklist && (
        <ChecklistExecutionModal
          checklist={selectedChecklist}
          onClose={() => {
            setShowExecutionModal(false);
            setSelectedChecklist(null);
          }}
          onComplete={() => {
            setShowExecutionModal(false);
            setSelectedChecklist(null);
          }}
        />
      )}
    </div>
  );
};

export default Checklists;
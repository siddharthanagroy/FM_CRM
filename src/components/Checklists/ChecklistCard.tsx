import React from 'react';
import { Calendar, Clock, Users, CheckSquare, Play, Edit, Archive } from 'lucide-react';
import { Checklist } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

interface ChecklistCardProps {
  checklist: Checklist;
  onExecute: (checklist: Checklist) => void;
}

const ChecklistCard: React.FC<ChecklistCardProps> = ({ checklist, onExecute }) => {
  const { user } = useAuth();

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'safety':
        return '🛡️';
      case 'compliance':
        return '📋';
      case 'maintenance':
        return '🔧';
      case 'housekeeping':
        return '🧹';
      case 'energy management':
        return '⚡';
      case 'security':
        return '🔒';
      default:
        return '📝';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'safety':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'compliance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'housekeeping':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'energy management':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'security':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      case 'yearly':
        return 'Yearly';
      case 'on-demand':
        return 'On Demand';
      default:
        return frequency;
    }
  };

  const canExecute = user?.role === 'technician' || user?.role === 'hk_team' || 
                    user?.role === 'admin' || user?.role === 'fm_manager';
  const canEdit = user?.role === 'admin' || user?.role === 'fm_manager';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getCategoryIcon(checklist.category)}</span>
            <h3 className="text-lg font-semibold text-gray-900 truncate">{checklist.name}</h3>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-mono text-sm text-blue-600 font-medium">{checklist.checklistId}</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
              checklist.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
              checklist.status === 'draft' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
              'bg-gray-100 text-gray-800 border-gray-200'
            }`}>
              {checklist.status.toUpperCase()}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{checklist.description}</p>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>Frequency: {getFrequencyText(checklist.frequency)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>Est. Time: {checklist.estimatedDuration} minutes</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-4 w-4 flex-shrink-0" />
              <span>{checklist.items.length} items</span>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>
                {checklist.assignedDepartments.includes('all') 
                  ? 'All Departments' 
                  : checklist.assignedDepartments.join(', ')
                }
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2 ml-4">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(checklist.category)}`}>
            {checklist.category}
          </span>
          
          {checklist.priority === 'high' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
              HIGH PRIORITY
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
          View Details
        </button>
        
        {canExecute && checklist.status === 'active' && (
          <button
            onClick={() => onExecute(checklist)}
            className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
          >
            <Play className="h-3 w-3 mr-1" />
            Execute
          </button>
        )}
        
        {canEdit && (
          <>
            <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </button>
            
            {checklist.status === 'active' && (
              <button className="flex items-center px-3 py-1 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors">
                <Archive className="h-3 w-3 mr-1" />
                Archive
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChecklistCard;
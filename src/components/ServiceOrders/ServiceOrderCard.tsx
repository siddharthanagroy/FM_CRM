import React from 'react';
import { Clock, Calendar, User, AlertTriangle, FileCheck, Shield, MessageSquare } from 'lucide-react';
import { ServiceOrder } from '../../contexts/DataContext';

interface ServiceOrderCardProps {
  serviceOrder: ServiceOrder;
}

const ServiceOrderCard: React.FC<ServiceOrderCardProps> = ({ serviceOrder }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'complaint':
        return <MessageSquare className="h-4 w-4" />;
      case 'compliance':
        return <Shield className="h-4 w-4" />;
      case 'general':
        return <FileCheck className="h-4 w-4" />;
      default:
        return <FileCheck className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'complaint':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'compliance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'general':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = new Date(serviceOrder.dueDate) < new Date() && serviceOrder.status !== 'resolved';

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${
      isOverdue ? 'border-red-200' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{serviceOrder.title}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border status-${serviceOrder.status}`}>
              {serviceOrder.status.replace('-', ' ').toUpperCase()}
            </span>
            {isOverdue && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                <Clock className="h-3 w-3 mr-1" />
                OVERDUE
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-3">{serviceOrder.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="font-mono text-blue-600 font-medium">{serviceOrder.serviceOrderId}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Due: {formatDate(serviceOrder.dueDate)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{serviceOrder.assignedTo}</span>
            </div>
            
            {serviceOrder.estimatedHours && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{serviceOrder.estimatedHours}h estimated</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2 ml-4">
          {/* Priority */}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border priority-${serviceOrder.priority}`}>
            {serviceOrder.priority === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {serviceOrder.priority.toUpperCase()}
          </span>

          {/* Type */}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(serviceOrder.type)}`}>
            {getTypeIcon(serviceOrder.type)}
            <span className="ml-1">{serviceOrder.type.toUpperCase()}</span>
          </span>
        </div>
      </div>

      {/* Progress Information */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Created: {formatDate(serviceOrder.createdAt)}</span>
          {serviceOrder.completedAt && (
            <span className="text-green-600">
              Completed: {formatDate(serviceOrder.completedAt)}
            </span>
          )}
        </div>
        
        {serviceOrder.actualHours && (
          <div className="text-sm text-gray-600">
            Actual time: {serviceOrder.actualHours}h
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
          View Details
        </button>
        
        {serviceOrder.status !== 'resolved' && (
          <>
            <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
              Update Status
            </button>
            <button className="px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors">
              Complete Service
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceOrderCard;
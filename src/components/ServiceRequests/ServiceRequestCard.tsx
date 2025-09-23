import React from 'react';
import { Clock, MapPin, User, AlertTriangle, ArrowRight, Wrench } from 'lucide-react';
import { Complaint } from '../../contexts/DataContext';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

interface ServiceRequestCardProps {
  serviceRequest: Complaint;
  onConvertToWorkOrder?: (serviceRequest: Complaint) => void;
  onConvertToServiceOrder?: (serviceRequest: Complaint) => void;
}

const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({ 
  serviceRequest, 
  onConvertToWorkOrder,
  onConvertToServiceOrder 
}) => {
  const { updateComplaint } = useData();
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electrical':
        return '⚡';
      case 'plumbing':
        return '🔧';
      case 'hvac':
        return '❄️';
      case 'housekeeping':
        return '🧹';
      default:
        return '📋';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electrical':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'plumbing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hvac':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'housekeeping':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusChange = (newStatus: string) => {
    updateComplaint(serviceRequest.id, { status: newStatus as any });
  };

  const handleReopen = () => {
    const reopenCount = (serviceRequest.reopenCount || 0) + 1;
    updateComplaint(serviceRequest.id, { 
      status: 'open', 
      reopenCount,
      autoCloseDate: undefined,
      resolvedAt: undefined 
    });
  };

  const canUpdateStatus = user?.role === 'admin' || user?.role === 'fm_manager' || 
                         (user?.role === 'technician' && serviceRequest.assignedTo === user.name);

  const canConvert = user?.role === 'admin' || user?.role === 'fm_manager';

  // Determine if this is asset-related based on category
  const isAssetRelated = ['electrical', 'plumbing', 'hvac'].includes(serviceRequest.category);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{serviceRequest.title}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border status-${serviceRequest.status}`}>
              {serviceRequest.status.replace('-', ' ').toUpperCase()}
            </span>
            {serviceRequest.reopenCount && serviceRequest.reopenCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                Reopened {serviceRequest.reopenCount}x
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-3">{serviceRequest.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="font-mono text-blue-600 font-medium">{serviceRequest.ticketId}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatDate(serviceRequest.createdAt)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{serviceRequest.location}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{serviceRequest.requesterName}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2 ml-4">
          {/* Priority */}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border priority-${serviceRequest.priority}`}>
            {serviceRequest.priority === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {serviceRequest.priority.toUpperCase()}
          </span>

          {/* Category */}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(serviceRequest.category)}`}>
            <span className="mr-1">{getCategoryIcon(serviceRequest.category)}</span>
            {serviceRequest.category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Assignment */}
      {serviceRequest.assignedTo && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Assigned to:</span>
            <span className="font-medium text-gray-900">{serviceRequest.assignedTo}</span>
          </div>
          
          {serviceRequest.resolvedAt && (
            <div className="text-sm text-green-600">
              Resolved on {formatDate(serviceRequest.resolvedAt)}
            </div>
          )}
        </div>
      )}

      {/* Conversion Buttons */}
      {canConvert && serviceRequest.status === 'open' && (
        <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">Convert to:</span>
          {isAssetRelated && onConvertToWorkOrder && (
            <button
              onClick={() => onConvertToWorkOrder(serviceRequest)}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors border border-blue-200"
            >
              <Wrench className="h-3 w-3 mr-1" />
              Work Order
              <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          )}
          {onConvertToServiceOrder && (
            <button
              onClick={() => onConvertToServiceOrder(serviceRequest)}
              className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors border border-green-200"
            >
              <Wrench className="h-3 w-3 mr-1" />
              Service Order
              <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
          View Details
        </button>
        
        {(serviceRequest.status === 'resolved' || serviceRequest.status === 'closed') && (
          <button 
            onClick={handleReopen}
            className="px-3 py-1 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors"
          >
            Reopen
          </button>
        )}
        
        {canUpdateStatus && (
          <div className="relative">
            <select
              value={serviceRequest.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors border border-blue-200"
            >
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="pending-parts">Pending Parts</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestCard;
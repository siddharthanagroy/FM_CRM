import React from 'react';
import { Clock, AlertCircle, CheckCircle, User } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const RecentActivity = () => {
  const { complaints, workOrders } = useData();

  // Combine and sort recent activities
  const activities = [
    ...complaints.slice(0, 3).map(serviceRequest => ({
      id: serviceRequest.id,
      type: 'service-request',
      title: serviceRequest.title,
      status: serviceRequest.status,
      time: serviceRequest.updatedAt,
      user: serviceRequest.requesterName,
      location: serviceRequest.location,
    })),
    ...workOrders.slice(0, 3).map(workOrder => ({
      id: workOrder.id,
      type: 'work-order',
      title: workOrder.title,
      status: workOrder.status,
      time: workOrder.updatedAt,
      user: workOrder.assignedTo,
      priority: workOrder.priority,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
      case 'assigned':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-600" />
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(activity.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <span className="text-xs text-gray-500">
                  {formatTime(activity.time)}
                </span>
              </div>
              
              <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize border status-${activity.status}`}>
                  {activity.status.replace('-', ' ')}
                </span>
                
                <span className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {activity.user}
                </span>
                
                {activity.type === 'complaint' && activity.location && (
                {activity.type === 'service-request' && activity.location && (
                  <span className="text-gray-400">• {activity.location}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all activities →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
import React from 'react';
import { Clock, User, Wrench, AlertTriangle } from 'lucide-react';

interface Activity {
  id: string;
  type: 'complaint' | 'work_order' | 'asset' | 'system';
  message: string;
  timestamp: string;
  status?: string;
  priority?: string;
}

const RecentActivity: React.FC = () => {
  // Mock data for now to prevent errors
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'complaint',
      message: 'New complaint: Air conditioning not working',
      timestamp: '2h ago',
      status: 'open',
      priority: 'high'
    },
    {
      id: '2',
      type: 'work_order',
      message: 'Work order completed: Elevator maintenance',
      timestamp: '4h ago',
      status: 'completed',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'complaint',
      message: 'New complaint: Plumbing issue in restroom',
      timestamp: '6h ago',
      status: 'assigned',
      priority: 'high'
    },
    {
      id: '4',
      type: 'work_order',
      message: 'Work order created: Light bulb replacement',
      timestamp: '1d ago',
      status: 'pending',
      priority: 'low'
    },
    {
      id: '5',
      type: 'complaint',
      message: 'Complaint resolved: Network connectivity',
      timestamp: '2d ago',
      status: 'resolved',
      priority: 'medium'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'complaint':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'work_order':
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'asset':
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'text-gray-600';
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'resolved':
        return 'text-green-600';
      case 'in-progress':
      case 'assigned':
        return 'text-blue-600';
      case 'open':
      case 'pending':
        return 'text-yellow-600';
      case 'overdue':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">
                {activity.message}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">
                  {activity.timestamp}
                </span>
                {activity.status && (
                  <>
                    <span className="text-xs text-gray-400">•</span>
                    <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).replace('-', ' ')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;

import React from "react";

interface Activity {
  id: number;
  message: string;
  timestamp: string;
}

const RecentActivity: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
      <ul className="space-y-2">
        {activities.map((activity) => (
          <li key={activity.id} className="text-sm text-gray-600">
            <span className="font-medium">{activity.message}</span>  
            <span className="ml-2 text-xs text-gray-400">
              {activity.timestamp}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;

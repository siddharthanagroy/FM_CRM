import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Package,
  BarChart3,
  Calendar,
  FileText,
  Wrench,
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import MetricCard from './MetricCard';
import RecentActivity from './RecentActivity';
import PPMCompliance from './PPMCompliance';

const Dashboard = () => {
  const { complaints, workOrders, assets } = useData();
  const { user } = useAuth();

  const [timeFilter, setTimeFilter] = useState<
    'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'
  >('monthly');
  const [customRange, setCustomRange] = useState<{
    start: string;
    end: string;
  }>({
    start: '',
    end: '',
  });

  // ---- Date filtering function ----
  const filterDataByDate = (items: any[], dateField: string) => {
    const now = new Date();

    if (timeFilter === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return items.filter((i) => new Date(i[dateField]) >= weekAgo);
    }

    if (timeFilter === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      return items.filter((i) => new Date(i[dateField]) >= monthAgo);
    }

    if (timeFilter === 'quarterly') {
      const quarterAgo = new Date();
      quarterAgo.setMonth(now.getMonth() - 3);
      return items.filter((i) => new Date(i[dateField]) >= quarterAgo);
    }

    if (timeFilter === 'yearly') {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      return items.filter((i) => new Date(i[dateField]) >= yearAgo);
    }

    if (timeFilter === 'custom' && customRange.start && customRange.end) {
      const start = new Date(customRange.start);
      const end = new Date(customRange.end);
      return items.filter((i) => {
        const d = new Date(i[dateField]);
        return d >= start && d <= end;
      });
    }

    return items;
  };

  // ---- Apply filtering ----
  const filteredComplaints = filterDataByDate(complaints, 'createdAt');
  const filteredWorkOrders = filterDataByDate(workOrders, 'createdAt');

  // ---- Calculate metrics ----
  const totalComplaints = filteredComplaints.length;
  const openComplaints = filteredComplaints.filter((c) =>
    ['open', 'assigned', 'in-progress'].includes(c.status)
  ).length;
  const resolvedComplaints = filteredComplaints.filter(
    (c) => c.status === 'resolved'
  ).length;

  const totalWorkOrders = filteredWorkOrders.length;
  const completedWorkOrders = filteredWorkOrders.filter(
    (wo) => wo.status === 'completed'
  ).length;
  const overdueWorkOrders = filteredWorkOrders.filter(
    (wo) => new Date(wo.dueDate) < new Date() && wo.status !== 'completed'
  ).length;

  const activeAssets = assets.filter((a) => a.status === 'active').length;

  // PPM Metrics
  const totalPPMs = filteredWorkOrders.filter(
    (wo) => wo.type === 'preventive'
  ).length;
  const completedPPMs = filteredWorkOrders.filter(
    (wo) => wo.type === 'preventive' && wo.status === 'completed'
  ).length;
  const ppmComplianceRate =
    totalPPMs > 0 ? Math.round((completedPPMs / totalPPMs) * 100) : 0;

  const timeFilterOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Facility management overview and key metrics
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {timeFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {timeFilter === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={customRange.start}
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">to</span>
              <input
                type="date"
                value={customRange.end}
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Service Requests"
          value={totalComplaints.toString()}
          icon={FileText}
          color="blue"
          subtitle={`${openComplaints} active`}
          trend="+12%"
        />
        <MetricCard
          title="Work Orders"
          value={totalWorkOrders.toString()}
          icon={Wrench}
          color="purple"
          subtitle={`${completedWorkOrders} completed`}
          trend="+8%"
        />
        <MetricCard
          title="PPM Compliance"
          value={`${ppmComplianceRate}%`}
          icon={TrendingUp}
          color="blue"
          subtitle={`${completedPPMs}/${totalPPMs} completed`}
          trend={ppmComplianceRate >= 80 ? '+5%' : '-2%'}
        />
        <MetricCard
          title="Active Assets"
          value={activeAssets.toString()}
          icon={Package}
          color="purple"
          subtitle={`${assets.length} total assets`}
          trend="+2%"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Overdue Work Orders
              </p>
              <p className="text-3xl font-bold text-red-600">
                {overdueWorkOrders}
              </p>
            </div>
            <Clock className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Require immediate attention
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Resolution Rate
              </p>
              <p className="text-3xl font-bold text-green-600">
                {totalComplaints > 0
                  ? Math.round((resolvedComplaints / totalComplaints) * 100)
                  : 0}
                %
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-400" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Complaints resolved successfully
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Team Utilization
              </p>
              <p className="text-3xl font-bold text-blue-600">78%</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Average team productivity
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* PPM Compliance */}
        <div className="lg:col-span-1">
          <PPMCompliance complianceRate={ppmComplianceRate} />
        </div>
      </div>

      {/* Role-specific sections */}
      {user?.role === 'fm_manager' && (
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Manager Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-left hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900">Schedule PPM</h4>
              <p className="text-sm text-gray-600 mt-1">
                Plan preventive maintenance
              </p>
            </button>
            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-left hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900">Generate Reports</h4>
              <p className="text-sm text-gray-600 mt-1">
                Export performance data
              </p>
            </button>
            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-left hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900">Assign Work Orders</h4>
              <p className="text-sm text-gray-600 mt-1">
                Delegate tasks to team
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


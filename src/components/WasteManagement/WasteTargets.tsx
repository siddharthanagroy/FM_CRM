import React, { useState } from 'react';
import { Plus, Target, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import CreateWasteTargetModal from './CreateWasteTargetModal';

const WasteTargets = () => {
  const { wasteTargets, getWasteMetrics, updateWasteTarget } = useData();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const canManageTargets = user?.role === 'admin' || user?.role === 'fm_manager';
  const currentYear = new Date().getFullYear();
  const currentMetrics = getWasteMetrics();

  // Sort targets by year (most recent first)
  const sortedTargets = [...wasteTargets].sort((a, b) => b.year - a.year);

  const getProgressColor = (actual: number, target: number) => {
    const percentage = (actual / target) * 100;
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (actual: number, target: number) => {
    const percentage = (actual / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateProgress = (actual: number, target: number) => {
    return Math.min((actual / target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Waste Management Targets</h2>
          <p className="text-gray-600">Set and track sustainability goals and KPIs</p>
        </div>

        {canManageTargets && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Set Target
          </button>
        )}
      </div>

      {/* Current Year Performance */}
      {sortedTargets.length > 0 && sortedTargets[0].year === currentYear && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-600" />
            {currentYear} Performance vs Targets
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Diversion Rate */}
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Diversion Rate</span>
                <span className={`text-sm font-bold ${getProgressColor(currentMetrics.diversionRate, sortedTargets[0].diversionRate)}`}>
                  {currentMetrics.diversionRate.toFixed(1)}% / {sortedTargets[0].diversionRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(currentMetrics.diversionRate, sortedTargets[0].diversionRate)}`}
                  style={{ width: `${calculateProgress(currentMetrics.diversionRate, sortedTargets[0].diversionRate)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {calculateProgress(currentMetrics.diversionRate, sortedTargets[0].diversionRate).toFixed(1)}% achieved
              </div>
            </div>

            {/* Recycling Rate */}
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Recycling Rate</span>
                <span className={`text-sm font-bold ${getProgressColor(currentMetrics.recyclingRate, sortedTargets[0].recyclingRate)}`}>
                  {currentMetrics.recyclingRate.toFixed(1)}% / {sortedTargets[0].recyclingRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(currentMetrics.recyclingRate, sortedTargets[0].recyclingRate)}`}
                  style={{ width: `${calculateProgress(currentMetrics.recyclingRate, sortedTargets[0].recyclingRate)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {calculateProgress(currentMetrics.recyclingRate, sortedTargets[0].recyclingRate).toFixed(1)}% achieved
              </div>
            </div>

            {/* Revenue Target */}
            {sortedTargets[0].revenueTarget && (
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Revenue Target</span>
                  <span className={`text-sm font-bold ${getProgressColor(currentMetrics.totalRevenue, sortedTargets[0].revenueTarget)}`}>
                    ${currentMetrics.totalRevenue} / ${sortedTargets[0].revenueTarget}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(currentMetrics.totalRevenue, sortedTargets[0].revenueTarget)}`}
                    style={{ width: `${calculateProgress(currentMetrics.totalRevenue, sortedTargets[0].revenueTarget)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {calculateProgress(currentMetrics.totalRevenue, sortedTargets[0].revenueTarget).toFixed(1)}% achieved
                </div>
              </div>
            )}

            {/* Carbon Reduction */}
            {sortedTargets[0].carbonReduction && (
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Carbon Reduction</span>
                  <span className="text-sm font-bold text-orange-600">
                    {currentMetrics.carbonFootprint} kg CO₂
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Target: {sortedTargets[0].carbonReduction} kg reduction
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Targets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Targets</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diversion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recycling Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waste Reduction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carbon Reduction
                </th>
                {canManageTargets && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTargets.length > 0 ? (
                sortedTargets.map((target) => (
                  <tr key={target.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{target.year}</span>
                        {target.year === currentYear && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Current
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {target.diversionRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {target.recyclingRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {target.wasteReduction}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {target.revenueTarget ? `$${target.revenueTarget}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {target.carbonReduction ? `${target.carbonReduction} kg` : '-'}
                    </td>
                    {canManageTargets && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canManageTargets ? 7 : 6} className="px-6 py-8 text-center">
                    <div className="text-gray-400 text-lg mb-2">No targets set</div>
                    <p className="text-gray-500">
                      {canManageTargets
                        ? 'Set your first sustainability target to start tracking progress.'
                        : 'No sustainability targets have been set yet.'
                      }
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ESG Framework Alignment */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          ESG Framework Alignment
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Environmental (E)</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Waste diversion from landfill</li>
              <li>• Carbon footprint reduction</li>
              <li>• Circular economy practices</li>
              <li>• Resource efficiency</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Social (S)</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Community recycling programs</li>
              <li>• Employee engagement</li>
              <li>• Health & safety compliance</li>
              <li>• Stakeholder transparency</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Governance (G)</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Data transparency & reporting</li>
              <li>• Vendor compliance monitoring</li>
              <li>• Regulatory adherence</li>
              <li>• Performance accountability</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create Target Modal */}
      {showCreateModal && (
        <CreateWasteTargetModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default WasteTargets;
import React from 'react';
import { Calendar, MapPin, AlertCircle, Settings, CheckCircle } from 'lucide-react';
import { Asset } from '../../contexts/DataContext';

interface AssetCardProps {
  asset: Asset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'maintenance':
        return <Settings className="h-4 w-4 text-yellow-500" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hvac':
        return '❄️';
      case 'electrical':
        return '⚡';
      case 'plumbing':
        return '🔧';
      case 'security':
        return '🔒';
      case 'elevator':
        return '🏢';
      default:
        return '📦';
    }
  };

  // Check if maintenance is due soon
  const isMaintenanceDue = () => {
    if (!asset.nextMaintenanceDate) return false;
    const nextMaintenance = new Date(asset.nextMaintenanceDate);
    const today = new Date();
    const daysUntilMaintenance = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilMaintenance <= 7;
  };

  const maintenanceDue = isMaintenanceDue();

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${
      maintenanceDue ? 'ring-2 ring-yellow-200' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getCategoryIcon(asset.category)}</span>
            <h3 className="text-lg font-semibold text-gray-900 truncate">{asset.name}</h3>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-mono text-sm text-blue-600 font-medium">{asset.assetId}</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(asset.status)}`}>
              {getStatusIcon(asset.status)}
              <span className="ml-1">{asset.status.toUpperCase()}</span>
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{asset.location}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium">Model:</span>
              <span>{asset.model}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium">Manufacturer:</span>
              <span>{asset.manufacturer}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            {asset.category}
          </span>
          
          {maintenanceDue && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              Due Soon
            </span>
          )}
        </div>
      </div>

      {/* Maintenance Information */}
      <div className="space-y-2 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Maintenance Frequency:</span>
          <span className="font-medium text-gray-900">{asset.maintenanceFrequency} days</span>
        </div>
        
        {asset.lastMaintenanceDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Maintenance:</span>
            <span className="text-gray-900">{formatDate(asset.lastMaintenanceDate)}</span>
          </div>
        )}
        
        {asset.nextMaintenanceDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Next Maintenance:</span>
            <span className={`font-medium ${maintenanceDue ? 'text-yellow-600' : 'text-gray-900'}`}>
              {formatDate(asset.nextMaintenanceDate)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Warranty Expiry:</span>
          <span className="text-gray-900">{formatDate(asset.warrantyExpiry)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
          View Details
        </button>
        
        {maintenanceDue && (
          <button className="px-3 py-1 text-sm text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded transition-colors">
            Schedule Maintenance
          </button>
        )}
        
        <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
          Edit Asset
        </button>
      </div>
    </div>
  );
};

export default AssetCard;
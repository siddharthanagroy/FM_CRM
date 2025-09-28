import React from 'react';
import { Calendar, MapPin, User, Package, DollarSign, Leaf, CheckCircle, AlertCircle } from 'lucide-react';
import { WasteEntry } from '../../contexts/DataContext';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

interface WasteEntryCardProps {
  entry: WasteEntry;
}

const WasteEntryCard: React.FC<WasteEntryCardProps> = ({ entry }) => {
  const { updateWasteEntry } = useData();
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'paper':
        return '📄';
      case 'plastic':
        return '🥤';
      case 'metal':
        return '🔩';
      case 'glass':
        return '🍶';
      case 'e-waste':
        return '💻';
      case 'food':
        return '🍎';
      case 'hazardous':
        return '☢️';
      case 'biomedical':
        return '🏥';
      case 'organic':
        return '🌱';
      default:
        return '🗑️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'paper':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'plastic':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'metal':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'glass':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'e-waste':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'food':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'hazardous':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'biomedical':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'organic':
        return 'bg-lime-100 text-lime-800 border-lime-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'recycle':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reuse':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'waste-to-energy':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'composting':
        return 'bg-lime-100 text-lime-800 border-lime-200';
      case 'landfill':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'incineration':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'treatment':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleVerify = () => {
    if (user) {
      updateWasteEntry(entry.id, {
        isVerified: true,
        verifiedBy: user.name,
      });
    }
  };

  const canVerify = (user?.role === 'admin' || user?.role === 'fm_manager') && !entry.isVerified;
  const canEdit = user?.role === 'admin' || user?.role === 'fm_manager' || entry.enteredBy === user?.name;

  const netValue = (entry.revenue || 0) - (entry.expense || 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-lg">{getCategoryIcon(entry.wasteCategory)}</span>
            <h3 className="text-lg font-semibold text-gray-900">
              {entry.wasteSubcategory || entry.wasteCategory.charAt(0).toUpperCase() + entry.wasteCategory.slice(1)}
            </h3>
            <span className="font-mono text-sm text-blue-600 font-medium">{entry.entryId}</span>
            {entry.isVerified ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                <AlertCircle className="h-3 w-3 mr-1" />
                Pending
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(entry.date)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{entry.location}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4" />
              <span>{entry.quantity} {entry.unit}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{entry.enteredBy}</span>
            </div>
          </div>

          {entry.notes && (
            <p className="text-sm text-gray-600 mb-3">{entry.notes}</p>
          )}
        </div>

        <div className="flex flex-col items-end space-y-2 ml-4">
          {/* Category */}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(entry.wasteCategory)}`}>
            {entry.wasteCategory.toUpperCase()}
          </span>

          {/* Disposal Method */}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getMethodColor(entry.disposalMethod)}`}>
            {entry.disposalMethod.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Financial and Environmental Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-200">
        {/* Revenue/Expense */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Net Value</span>
          </div>
          <div className={`text-lg font-bold ${netValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(netValue).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            Rev: ${(entry.revenue || 0).toFixed(2)} | Exp: ${(entry.expense || 0).toFixed(2)}
          </div>
        </div>

        {/* Carbon Footprint */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Leaf className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">CO₂ Impact</span>
          </div>
          <div className="text-lg font-bold text-orange-600">
            {(entry.carbonFootprint || 0).toFixed(1)} kg
          </div>
          <div className="text-xs text-gray-500">Carbon equivalent</div>
        </div>

        {/* Vendor */}
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-1">Vendor</div>
          <div className="text-sm text-gray-900">{entry.vendor || 'N/A'}</div>
          {entry.vendorReference && (
            <div className="text-xs text-gray-500 font-mono">{entry.vendorReference}</div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
          View Details
        </button>
        
        {canVerify && (
          <button
            onClick={handleVerify}
            className="px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
          >
            Verify Entry
          </button>
        )}
        
        {canEdit && (
          <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
            Edit Entry
          </button>
        )}
      </div>
    </div>
  );
};

export default WasteEntryCard;
import React from 'react';
import { Calendar, MapPin, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { Compliance } from '../../contexts/DataContext';

interface ComplianceCardProps {
  compliance: Compliance;
}

const ComplianceCard: React.FC<ComplianceCardProps> = ({ compliance }) => {
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
      case 'pending_renewal':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending_renewal':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fire_safety':
        return '🔥';
      case 'electrical':
        return '⚡';
      case 'environmental':
        return '🌱';
      case 'structural':
        return '🏗️';
      case 'health_safety':
        return '🏥';
      default:
        return '📋';
    }
  };

  // Check if renewal is due soon
  const isRenewalDue = () => {
    if (!compliance.expiryDate) return false;
    const expiryDate = new Date(compliance.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= compliance.notificationDays;
  };

  const renewalDue = isRenewalDue();
  const daysUntilExpiry = compliance.expiryDate ? 
    Math.ceil((new Date(compliance.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${
      renewalDue ? 'ring-2 ring-yellow-200' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getCategoryIcon(compliance.category)}</span>
            <h3 className="text-lg font-semibold text-gray-900 truncate">{compliance.name}</h3>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-mono text-sm text-blue-600 font-medium">{compliance.complianceId}</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(compliance.status)}`}>
              {getStatusIcon(compliance.status)}
              <span className="ml-1">{compliance.status.replace('_', ' ').toUpperCase()}</span>
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3">{compliance.description}</p>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{compliance.location}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium">Authority:</span>
              <span>{compliance.issuingAuthority}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium">Certificate #:</span>
              <span className="font-mono text-xs">{compliance.certificateNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            {compliance.category.replace('_', ' ').toUpperCase()}
          </span>
          
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
            {compliance.type.replace('_', ' ').toUpperCase()}
          </span>
          
          {renewalDue && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Due Soon
            </span>
          )}
        </div>
      </div>

      {/* Date Information */}
      <div className="space-y-2 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Issue Date:</span>
          <span className="text-gray-900">{formatDate(compliance.issueDate)}</span>
        </div>
        
        {compliance.expiryDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Expiry Date:</span>
            <span className={`font-medium ${renewalDue ? 'text-yellow-600' : 'text-gray-900'}`}>
              {formatDate(compliance.expiryDate)}
              {daysUntilExpiry > 0 && (
                <span className="ml-1 text-xs text-gray-500">
                  ({daysUntilExpiry} days)
                </span>
              )}
            </span>
          </div>
        )}

        {compliance.type === 'renewable' && compliance.renewalFrequency && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Renewal Frequency:</span>
            <span className="text-gray-900">{compliance.renewalFrequency} months</span>
          </div>
        )}

        {compliance.nextRenewalDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Next Renewal:</span>
            <span className="text-gray-900">{formatDate(compliance.nextRenewalDate)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
          View Details
        </button>
        
        {renewalDue && (
          <button className="px-3 py-1 text-sm text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded transition-colors">
            Start Renewal
          </button>
        )}
        
        <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
          Edit
        </button>
      </div>
    </div>
  );
};

export default ComplianceCard;
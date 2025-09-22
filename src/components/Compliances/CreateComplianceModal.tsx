import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface CreateComplianceModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateComplianceModal: React.FC<CreateComplianceModalProps> = ({ onClose, onCreate }) => {
  const { createCompliance } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
  name: '',
  description: '',
  category: 'fire_safety' as const,
  type: 'renewable' as const,
  status: 'active' as const,
  issueDate: '',
  expiryDate: '', // only for renewable
  renewalFrequency: 12, // only for renewable
  notificationDays: 30, // only for renewable
  issuingAuthority: '',
  certificateNumber: '',
  location: '',
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    let nextRenewalDate = undefined;

    // For renewable, keep expiry, renewalFrequency, notificationDays
    // For one_time, clear these
    const complianceData = {
      ...formData,
      expiryDate: formData.type === 'renewable' ? formData.expiryDate : null,
      renewalFrequency: formData.type === 'renewable' ? formData.renewalFrequency : null,
      notificationDays: formData.type === 'renewable' ? formData.notificationDays : null,
    };

    // Calculate next renewal date only for renewable
    if (formData.type === 'renewable' && formData.expiryDate) {
      const expiry = new Date(formData.expiryDate);
      nextRenewalDate = new Date(
        expiry.getTime() + (formData.renewalFrequency * 30 * 24 * 60 * 60 * 1000)
      )
        .toISOString()
        .split('T')[0];
    }

    await createCompliance({
      ...complianceData,
      nextRenewalDate,
    });

    onCreate();
  } catch (error) {
    console.error('Error creating compliance:', error);
  } finally {
    setLoading(false);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'renewalFrequency' || name === 'notificationDays' ? parseInt(value, 10) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Compliance</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Compliance Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Fire NOC Certificate"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the compliance requirement"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="fire_safety">Fire Safety</option>
                <option value="electrical">Electrical</option>
                <option value="environmental">Environmental</option>
                <option value="structural">Structural</option>
                <option value="health_safety">Health & Safety</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                id="type"
                name="type"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="renewable">Renewable</option>
                <option value="one_time">One Time</option>
              </select>
            </div>

            {/* Issuing Authority */}
            <div>
              <label htmlFor="issuingAuthority" className="block text-sm font-medium text-gray-700 mb-1">
                Issuing Authority *
              </label>
              <input
                type="text"
                id="issuingAuthority"
                name="issuingAuthority"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Delhi Fire Service"
                value={formData.issuingAuthority}
                onChange={handleInputChange}
              />
            </div>

            {/* Certificate Number */}
            <div>
              <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Number *
              </label>
              <input
                type="text"
                id="certificateNumber"
                name="certificateNumber"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., DFS/NOC/2024/1234"
                value={formData.certificateNumber}
                onChange={handleInputChange}
              />
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Building A - Main Campus"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            {/* Issue Date */}
            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.issueDate}
                onChange={handleInputChange}
              />
            </div>

            {/* Expiry Date */}
            {formData.type === 'renewable' && (
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {/* Renewal Frequency */}
            {formData.type === 'renewable' && (
              <div>
                <label htmlFor="renewalFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Renewal Frequency (Months) *
                </label>
                <input
                  type="number"
                  id="renewalFrequency"
                  name="renewalFrequency"
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="12"
                  value={formData.renewalFrequency}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {/* Notification Days */}
            {formData.type === 'renewable' && (
              <div>
                <label htmlFor="notificationDays" className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Days Before Expiry *
                </label>
                <input
                  type="number"
                  id="notificationDays"
                  name="notificationDays"
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="30"
                  value={formData.notificationDays}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500 mt-1">Days before expiry to send renewal notifications</p>
              </div>
            )}

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="pending_renewal">Pending Renewal</option>
                <option value="expired">Expired</option>
                <option value="not_applicable">Not Applicable</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Compliance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplianceModal;
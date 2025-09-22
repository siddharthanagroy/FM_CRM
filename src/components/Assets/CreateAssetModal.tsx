import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface CreateAssetModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateAssetModal: React.FC<CreateAssetModalProps> = ({ onClose, onCreate }) => {
  const { createAsset } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    model: '',
    serialNumber: '',
    manufacturer: '',
    installationDate: '',
    warrantyExpiry: '',
    location: '',
    maintenanceFrequency: 30,
    status: 'active' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createAsset(formData);
      onCreate();
    } catch (error) {
      console.error('Error creating asset:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maintenanceFrequency' ? parseInt(value, 10) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Asset</h2>
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
            {/* Asset Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Asset Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Central HVAC Unit #1"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., HVAC, Electrical, Plumbing"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>

            {/* Model */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <input
                type="text"
                id="model"
                name="model"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Carrier 30RB-050"
                value={formData.model}
                onChange={handleInputChange}
              />
            </div>

            {/* Serial Number */}
            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number
              </label>
              <input
                type="text"
                id="serialNumber"
                name="serialNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., SN123456789"
                value={formData.serialNumber}
                onChange={handleInputChange}
              />
            </div>

            {/* Manufacturer */}
            <div>
              <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer *
              </label>
              <input
                type="text"
                id="manufacturer"
                name="manufacturer"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Carrier"
                value={formData.manufacturer}
                onChange={handleInputChange}
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Rooftop - Building A"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            {/* Installation Date */}
            <div>
              <label htmlFor="installationDate" className="block text-sm font-medium text-gray-700 mb-1">
                Installation Date *
              </label>
              <input
                type="date"
                id="installationDate"
                name="installationDate"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.installationDate}
                onChange={handleInputChange}
              />
            </div>

            {/* Warranty Expiry */}
            <div>
              <label htmlFor="warrantyExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                Warranty Expiry *
              </label>
              <input
                type="date"
                id="warrantyExpiry"
                name="warrantyExpiry"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.warrantyExpiry}
                onChange={handleInputChange}
              />
            </div>

            {/* Maintenance Frequency */}
            <div>
              <label htmlFor="maintenanceFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Frequency (Days) *
              </label>
              <input
                type="number"
                id="maintenanceFrequency"
                name="maintenanceFrequency"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="30"
                value={formData.maintenanceFrequency}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">How often maintenance should be performed (in days)</p>
            </div>

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
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
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
              {loading ? 'Creating...' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssetModal;
import React, { useState } from 'react';
import { X, Truck } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface CreateWasteVendorModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateWasteVendorModal: React.FC<CreateWasteVendorModalProps> = ({ onClose, onCreate }) => {
  const { createWasteVendor } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'collection' as const,
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    wasteCategories: [] as string[],
    certifications: [] as string[],
    contractStartDate: '',
    contractEndDate: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createWasteVendor(formData);
      onCreate();
    } catch (error) {
      console.error('Error creating waste vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      wasteCategories: checked
        ? [...prev.wasteCategories, category]
        : prev.wasteCategories.filter(c => c !== category)
    }));
  };

  const handleCertificationChange = (certification: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      certifications: checked
        ? [...prev.certifications, certification]
        : prev.certifications.filter(c => c !== certification)
    }));
  };

  const vendorTypes = [
    { value: 'collection', label: 'Collection' },
    { value: 'recycling', label: 'Recycling' },
    { value: 'disposal', label: 'Disposal' },
    { value: 'treatment', label: 'Treatment' },
    { value: 'waste-to-energy', label: 'Waste-to-Energy' },
  ];

  const wasteCategories = [
    'general', 'recyclables', 'paper', 'plastic', 'metal', 'glass',
    'e-waste', 'food', 'organic', 'hazardous', 'biomedical'
  ];

  const commonCertifications = [
    'ISO 14001', 'R2 Certified', 'e-Stewards', 'USCC Certified',
    'Organic Certified', 'RCRA Certified', 'DOT Certified'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add New Waste Vendor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., EcoRecycle Solutions"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Type *
              </label>
              <select
                id="type"
                name="type"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.type}
                onChange={handleInputChange}
              >
                {vendorTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., John Smith"
                value={formData.contactPerson}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="contact@vendor.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="+1-555-0123"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="isActive" className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active Vendor</span>
              </label>
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Full business address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          {/* Contract Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contractStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                Contract Start Date *
              </label>
              <input
                type="date"
                id="contractStartDate"
                name="contractStartDate"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.contractStartDate}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="contractEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                Contract End Date *
              </label>
              <input
                type="date"
                id="contractEndDate"
                name="contractEndDate"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.contractEndDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Waste Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waste Categories Handled *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {wasteCategories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.wasteCategories.includes(category)}
                    onChange={(e) => handleCategoryChange(category, e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {category.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certifications
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonCertifications.map((certification) => (
                <label key={certification} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.certifications.includes(certification)}
                    onChange={(e) => handleCertificationChange(certification, e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{certification}</span>
                </label>
              ))}
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
              disabled={loading || formData.wasteCategories.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWasteVendorModal;
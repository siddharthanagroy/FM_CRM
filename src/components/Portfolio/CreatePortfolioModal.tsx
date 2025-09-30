import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';

interface CreatePortfolioModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreatePortfolioModal: React.FC<CreatePortfolioModalProps> = ({ onClose, onCreate }) => {
  const { createPortfolio, organizations } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationId: '',
    name: '',
    region: '',
    country: '',
    countryCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createPortfolio(formData);
      onCreate();
    } catch (error) {
      console.error('Error creating portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const regions = [
    { value: 'APAC', label: 'Asia Pacific' },
    { value: 'EMEA', label: 'Europe, Middle East & Africa' },
    { value: 'AMERICAS', label: 'Americas' },
    { value: 'GLOBAL', label: 'Global' },
  ];

  const countries = [
    { value: 'India', code: 'IN' },
    { value: 'United Kingdom', code: 'UK' },
    { value: 'United States', code: 'US' },
    { value: 'Singapore', code: 'SG' },
    { value: 'Australia', code: 'AU' },
    { value: 'Germany', code: 'DE' },
    { value: 'France', code: 'FR' },
    { value: 'Canada', code: 'CA' },
    { value: 'Japan', code: 'JP' },
    { value: 'China', code: 'CN' },
  ];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countries.find(c => c.value === e.target.value);
    setFormData(prev => ({
      ...prev,
      country: e.target.value,
      countryCode: selectedCountry?.code || '',
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Portfolio</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700 mb-1">
              Organization *
            </label>
            <select
              id="organizationId"
              name="organizationId"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.organizationId}
              onChange={handleInputChange}
            >
              <option value="">Select Organization</option>
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Asia Pacific Portfolio"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Region *
            </label>
            <select
              id="region"
              name="region"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.region}
              onChange={handleInputChange}
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Primary Country *
            </label>
            <select
              id="country"
              name="country"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.country}
              onChange={handleCountryChange}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.value} ({country.code})
                </option>
              ))}
            </select>
          </div>

          {formData.countryCode && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Country Code:</strong> {formData.countryCode}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This will be used for generating campus IDs (e.g., {formData.countryCode}-001)
              </p>
            </div>
          )}

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
              {loading ? 'Creating...' : 'Create Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePortfolioModal;
import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';

interface CreateCampusModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateCampusModal: React.FC<CreateCampusModalProps> = ({ onClose, onCreate }) => {
  const { createCampus, portfolios } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    portfolioId: '',
    name: '',
    city: '',
    address: '',
    gpsCoordinates: '',
    type: 'traditional_office' as const,
    status: 'active' as const,
    totalParkingSlots2W: 0,
    totalParkingSlots4W: 0,
    totalParkingEVSlots: 0,
    amenities: [] as string[],
    greenInfrastructure: {
      hasSolar: false,
      hasRainwaterHarvesting: false,
      hasSTP: false,
      greenAreaPercentage: 0,
    },
    bcpDrSpaceAvailable: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createCampus(formData);
      onCreate();
    } catch (error) {
      console.error('Error creating campus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('greenInfrastructure.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          greenInfrastructure: {
            ...prev.greenInfrastructure,
            [field]: checked,
          },
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else if (name.startsWith('greenInfrastructure.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        greenInfrastructure: {
          ...prev.greenInfrastructure,
          [field]: field === 'greenAreaPercentage' ? parseFloat(value) || 0 : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['totalParkingSlots2W', 'totalParkingSlots4W', 'totalParkingEVSlots'].includes(name)
          ? parseInt(value, 10) || 0
          : value
      }));
    }
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const campusTypes = [
    { value: 'traditional_office', label: 'Traditional Office' },
    { value: 'sales_office', label: 'Sales Office' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'data_center', label: 'Data Center' },
    { value: 'rd_lab', label: 'R&D Lab' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'coworking', label: 'Co-working' },
    { value: 'training_center', label: 'Training Center' },
  ];

  const availableAmenities = [
    'cafeteria', 'gym', 'medical_room', 'recreation_area', 'conference_center',
    'business_lounge', 'library', 'prayer_room', 'daycare', 'parking_garage'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Campus</h2>
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
              <label htmlFor="portfolioId" className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio *
              </label>
              <select
                id="portfolioId"
                name="portfolioId"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.portfolioId}
                onChange={handleInputChange}
              >
                <option value="">Select Portfolio</option>
                {portfolios.map((portfolio) => (
                  <option key={portfolio.id} value={portfolio.id}>
                    {portfolio.name} ({portfolio.region})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Campus Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Bangalore Tech Campus"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Bangalore"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Campus Type *
              </label>
              <select
                id="type"
                name="type"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.type}
                onChange={handleInputChange}
              >
                {campusTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

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
                <option value="inactive">Inactive</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            <div>
              <label htmlFor="gpsCoordinates" className="block text-sm font-medium text-gray-700 mb-1">
                GPS Coordinates
              </label>
              <input
                type="text"
                id="gpsCoordinates"
                name="gpsCoordinates"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 12.8456, 77.6632"
                value={formData.gpsCoordinates}
                onChange={handleInputChange}
              />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Full address of the campus"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          {/* Parking */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Parking Allocation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="totalParkingSlots2W" className="block text-sm font-medium text-gray-700 mb-1">
                  2-Wheeler Slots
                </label>
                <input
                  type="number"
                  id="totalParkingSlots2W"
                  name="totalParkingSlots2W"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.totalParkingSlots2W}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="totalParkingSlots4W" className="block text-sm font-medium text-gray-700 mb-1">
                  4-Wheeler Slots
                </label>
                <input
                  type="number"
                  id="totalParkingSlots4W"
                  name="totalParkingSlots4W"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.totalParkingSlots4W}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="totalParkingEVSlots" className="block text-sm font-medium text-gray-700 mb-1">
                  EV Charging Slots
                </label>
                <input
                  type="number"
                  id="totalParkingEVSlots"
                  name="totalParkingEVSlots"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.totalParkingEVSlots}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {amenity.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Green Infrastructure */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Green Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="greenInfrastructure.hasSolar"
                    checked={formData.greenInfrastructure.hasSolar}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Solar Power</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="greenInfrastructure.hasRainwaterHarvesting"
                    checked={formData.greenInfrastructure.hasRainwaterHarvesting}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Rainwater Harvesting</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="greenInfrastructure.hasSTP"
                    checked={formData.greenInfrastructure.hasSTP}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Sewage Treatment Plant</span>
                </label>
              </div>

              <div>
                <label htmlFor="greenInfrastructure.greenAreaPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                  Green Area Percentage
                </label>
                <input
                  type="number"
                  name="greenInfrastructure.greenAreaPercentage"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.greenInfrastructure.greenAreaPercentage}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* BCP/DR */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="bcpDrSpaceAvailable"
                checked={formData.bcpDrSpaceAvailable}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">BCP/DR Space Available</span>
            </label>
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
              {loading ? 'Creating...' : 'Create Campus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampusModal;
import React, { useState } from 'react';
import { X, Home } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';

interface CreateBuildingModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateBuildingModal: React.FC<CreateBuildingModalProps> = ({ onClose, onCreate }) => {
  const { createBuilding, campuses } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    campusId: '',
    buildingName: '',
    buildingCode: '',
    aliasName: '',
    totalAreaBUA: 0,
    totalAreaRA: 0,
    totalAreaCarpet: 0,
    numberOfFloors: 1,
    ownershipType: 'leased' as const,
    leaseDetails: {
      startDate: '',
      endDate: '',
      monthlyRent: 0,
      camCharges: 0,
      securityDeposit: 0,
      currency: 'USD',
    },
    status: 'active' as const,
    parkingAllocation2W: 0,
    parkingAllocation4W: 0,
    parkingAllocationEV: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const buildingData = {
        ...formData,
        leaseDetails: formData.ownershipType === 'leased' ? formData.leaseDetails : undefined,
      };
      await createBuilding(buildingData);
      onCreate();
    } catch (error) {
      console.error('Error creating building:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('leaseDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        leaseDetails: {
          ...prev.leaseDetails,
          [field]: ['monthlyRent', 'camCharges', 'securityDeposit'].includes(field)
            ? parseFloat(value) || 0
            : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['totalAreaBUA', 'totalAreaRA', 'totalAreaCarpet', 'numberOfFloors', 'parkingAllocation2W', 'parkingAllocation4W', 'parkingAllocationEV'].includes(name)
          ? parseFloat(value) || 0
          : value
      }));
    }
  };

  const currencies = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'INR', label: 'INR' },
    { value: 'SGD', label: 'SGD' },
    { value: 'AUD', label: 'AUD' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Home className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Building</h2>
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
              <label htmlFor="campusId" className="block text-sm font-medium text-gray-700 mb-1">
                Campus *
              </label>
              <select
                id="campusId"
                name="campusId"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.campusId}
                onChange={handleInputChange}
              >
                <option value="">Select Campus</option>
                {campuses.map((campus) => (
                  <option key={campus.id} value={campus.id}>
                    {campus.name} ({campus.campusId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="buildingName" className="block text-sm font-medium text-gray-700 mb-1">
                Building Name *
              </label>
              <input
                type="text"
                id="buildingName"
                name="buildingName"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Pinnacle Tower"
                value={formData.buildingName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="buildingCode" className="block text-sm font-medium text-gray-700 mb-1">
                Building Code *
              </label>
              <input
                type="text"
                id="buildingCode"
                name="buildingCode"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., PIN, PV, TWR"
                value={formData.buildingCode}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">Short code for ID generation (2-3 characters)</p>
            </div>

            <div>
              <label htmlFor="aliasName" className="block text-sm font-medium text-gray-700 mb-1">
                Alias/Local Name
              </label>
              <input
                type="text"
                id="aliasName"
                name="aliasName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Main Building"
                value={formData.aliasName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="numberOfFloors" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Floors *
              </label>
              <input
                type="number"
                id="numberOfFloors"
                name="numberOfFloors"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.numberOfFloors}
                onChange={handleInputChange}
              />
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
          </div>

          {/* Area Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Area Information (sq.ft)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="totalAreaBUA" className="block text-sm font-medium text-gray-700 mb-1">
                  Built-up Area (BUA)
                </label>
                <input
                  type="number"
                  id="totalAreaBUA"
                  name="totalAreaBUA"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.totalAreaBUA}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="totalAreaRA" className="block text-sm font-medium text-gray-700 mb-1">
                  Rentable Area (RA)
                </label>
                <input
                  type="number"
                  id="totalAreaRA"
                  name="totalAreaRA"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.totalAreaRA}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="totalAreaCarpet" className="block text-sm font-medium text-gray-700 mb-1">
                  Carpet Area
                </label>
                <input
                  type="number"
                  id="totalAreaCarpet"
                  name="totalAreaCarpet"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.totalAreaCarpet}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Ownership */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Ownership</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ownershipType" className="block text-sm font-medium text-gray-700 mb-1">
                  Ownership Type *
                </label>
                <select
                  id="ownershipType"
                  name="ownershipType"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.ownershipType}
                  onChange={handleInputChange}
                >
                  <option value="leased">Leased</option>
                  <option value="owned">Owned</option>
                </select>
              </div>
            </div>

            {/* Lease Details */}
            {formData.ownershipType === 'leased' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-3">Lease Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="leaseDetails.startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Lease Start Date
                    </label>
                    <input
                      type="date"
                      name="leaseDetails.startDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.leaseDetails.startDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="leaseDetails.endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Lease End Date
                    </label>
                    <input
                      type="date"
                      name="leaseDetails.endDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.leaseDetails.endDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="leaseDetails.monthlyRent" className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Rent
                    </label>
                    <input
                      type="number"
                      name="leaseDetails.monthlyRent"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.leaseDetails.monthlyRent}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="leaseDetails.camCharges" className="block text-sm font-medium text-gray-700 mb-1">
                      CAM Charges
                    </label>
                    <input
                      type="number"
                      name="leaseDetails.camCharges"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.leaseDetails.camCharges}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="leaseDetails.securityDeposit" className="block text-sm font-medium text-gray-700 mb-1">
                      Security Deposit
                    </label>
                    <input
                      type="number"
                      name="leaseDetails.securityDeposit"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.leaseDetails.securityDeposit}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="leaseDetails.currency" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      name="leaseDetails.currency"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.leaseDetails.currency}
                      onChange={handleInputChange}
                    >
                      {currencies.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Parking Allocation */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Parking Allocation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="parkingAllocation2W" className="block text-sm font-medium text-gray-700 mb-1">
                  2-Wheeler Slots
                </label>
                <input
                  type="number"
                  id="parkingAllocation2W"
                  name="parkingAllocation2W"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.parkingAllocation2W}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="parkingAllocation4W" className="block text-sm font-medium text-gray-700 mb-1">
                  4-Wheeler Slots
                </label>
                <input
                  type="number"
                  id="parkingAllocation4W"
                  name="parkingAllocation4W"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.parkingAllocation4W}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="parkingAllocationEV" className="block text-sm font-medium text-gray-700 mb-1">
                  EV Charging Slots
                </label>
                <input
                  type="number"
                  id="parkingAllocationEV"
                  name="parkingAllocationEV"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.parkingAllocationEV}
                  onChange={handleInputChange}
                />
              </div>
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
              {loading ? 'Creating...' : 'Create Building'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBuildingModal;
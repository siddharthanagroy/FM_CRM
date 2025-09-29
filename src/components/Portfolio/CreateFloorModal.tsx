import React, { useState } from 'react';
import { X, Layers } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';

interface CreateFloorModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateFloorModal: React.FC<CreateFloorModalProps> = ({ onClose, onCreate }) => {
  const { createFloor, buildings } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    buildingId: '',
    floorNumber: '',
    floorArea: 0,
    seatCounts: {
      fixedDesk: 0,
      hotDesk: 0,
      cafeSeat: 0,
      meetingRoomSeat: 0,
    },
    parkingAllocation2W: 0,
    parkingAllocation4W: 0,
    parkingAllocationEV: 0,
    amenities: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createFloor(formData);
      onCreate();
    } catch (error) {
      console.error('Error creating floor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('seatCounts.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seatCounts: {
          ...prev.seatCounts,
          [field]: parseInt(value, 10) || 0,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['floorArea', 'parkingAllocation2W', 'parkingAllocation4W', 'parkingAllocationEV'].includes(name)
          ? parseFloat(value) || 0
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

  const availableAmenities = [
    'meeting_rooms', 'break_area', 'printer_station', 'collaboration_zone',
    'phone_booths', 'storage_area', 'pantry', 'reception'
  ];

  const totalSeats = Object.values(formData.seatCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Floor</h2>
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
              <label htmlFor="buildingId" className="block text-sm font-medium text-gray-700 mb-1">
                Building *
              </label>
              <select
                id="buildingId"
                name="buildingId"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.buildingId}
                onChange={handleInputChange}
              >
                <option value="">Select Building</option>
                {buildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.buildingName} ({building.buildingId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="floorNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Floor Number *
              </label>
              <input
                type="text"
                id="floorNumber"
                name="floorNumber"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., G, M, 1, 2, B1"
                value={formData.floorNumber}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">Can be G (Ground), M (Mezzanine), B1 (Basement), etc.</p>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="floorArea" className="block text-sm font-medium text-gray-700 mb-1">
                Floor Area (sq.ft) *
              </label>
              <input
                type="number"
                id="floorArea"
                name="floorArea"
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.floorArea}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Seat Counts */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Seat Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="seatCounts.fixedDesk" className="block text-sm font-medium text-gray-700 mb-1">
                  Fixed Desk Seats
                </label>
                <input
                  type="number"
                  name="seatCounts.fixedDesk"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.seatCounts.fixedDesk}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="seatCounts.hotDesk" className="block text-sm font-medium text-gray-700 mb-1">
                  Hot Desk Seats
                </label>
                <input
                  type="number"
                  name="seatCounts.hotDesk"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.seatCounts.hotDesk}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="seatCounts.cafeSeat" className="block text-sm font-medium text-gray-700 mb-1">
                  Café Seats
                </label>
                <input
                  type="number"
                  name="seatCounts.cafeSeat"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.seatCounts.cafeSeat}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="seatCounts.meetingRoomSeat" className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Room Seats
                </label>
                <input
                  type="number"
                  name="seatCounts.meetingRoomSeat"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.seatCounts.meetingRoomSeat}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Total Seats:</strong> {totalSeats}
                {formData.floorArea > 0 && (
                  <span className="ml-4">
                    <strong>Density:</strong> {Math.round((totalSeats / formData.floorArea) * 100)} seats per 100 sq.ft
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Parking Allocation */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Floor-level Parking Allocation (Optional)</h3>
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

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Floor Amenities</h3>
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
              {loading ? 'Creating...' : 'Create Floor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFloorModal;
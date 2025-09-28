import React, { useState } from 'react';
import { X, Recycle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

interface CreateWasteEntryModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateWasteEntryModal: React.FC<CreateWasteEntryModalProps> = ({ onClose, onCreate }) => {
  const { createWasteEntry, wasteVendors } = useData();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    building: '',
    department: '',
    wasteCategory: 'general' as const,
    wasteSubcategory: '',
    quantity: 0,
    unit: 'kg' as const,
    disposalMethod: 'landfill' as const,
    vendor: '',
    vendorReference: '',
    revenue: 0,
    expense: 0,
    currency: 'USD',
    carbonFootprint: 0,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      await createWasteEntry({
        ...formData,
        enteredBy: user.name,
      });
      onCreate();
    } catch (error) {
      console.error('Error creating waste entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['quantity', 'revenue', 'expense', 'carbonFootprint'].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const wasteCategories = [
    { value: 'general', label: 'General Waste' },
    { value: 'recyclables', label: 'Recyclables' },
    { value: 'paper', label: 'Paper' },
    { value: 'plastic', label: 'Plastic' },
    { value: 'metal', label: 'Metal' },
    { value: 'glass', label: 'Glass' },
    { value: 'e-waste', label: 'E-Waste' },
    { value: 'food', label: 'Food Waste' },
    { value: 'organic', label: 'Organic Waste' },
    { value: 'hazardous', label: 'Hazardous Waste' },
    { value: 'biomedical', label: 'Biomedical Waste' },
  ];

  const disposalMethods = [
    { value: 'landfill', label: 'Landfill' },
    { value: 'recycle', label: 'Recycle' },
    { value: 'reuse', label: 'Reuse' },
    { value: 'waste-to-energy', label: 'Waste-to-Energy' },
    { value: 'composting', label: 'Composting' },
    { value: 'incineration', label: 'Incineration' },
    { value: 'treatment', label: 'Treatment' },
  ];

  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'tonnes', label: 'Tonnes' },
    { value: 'liters', label: 'Liters' },
    { value: 'pieces', label: 'Pieces' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Recycle className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Waste Entry</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Building A - Floor 2"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                Building
              </label>
              <input
                type="text"
                id="building"
                name="building"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Building A"
                value={formData.building}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Administration"
                value={formData.department}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="wasteCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Waste Category *
              </label>
              <select
                id="wasteCategory"
                name="wasteCategory"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.wasteCategory}
                onChange={handleInputChange}
              >
                {wasteCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="wasteSubcategory" className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <input
                type="text"
                id="wasteSubcategory"
                name="wasteSubcategory"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Office Paper, Food Scraps"
                value={formData.wasteSubcategory}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Quantity and Disposal */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <select
                id="unit"
                name="unit"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.unit}
                onChange={handleInputChange}
              >
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="disposalMethod" className="block text-sm font-medium text-gray-700 mb-1">
                Disposal Method *
              </label>
              <select
                id="disposalMethod"
                name="disposalMethod"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.disposalMethod}
                onChange={handleInputChange}
              >
                {disposalMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="carbonFootprint" className="block text-sm font-medium text-gray-700 mb-1">
                CO₂ Footprint (kg)
              </label>
              <input
                type="number"
                id="carbonFootprint"
                name="carbonFootprint"
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.carbonFootprint}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Vendor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">
                Vendor
              </label>
              <select
                id="vendor"
                name="vendor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.vendor}
                onChange={handleInputChange}
              >
                <option value="">Select Vendor</option>
                {wasteVendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.name}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="vendorReference" className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Reference
              </label>
              <input
                type="text"
                id="vendorReference"
                name="vendorReference"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Invoice/Receipt Number"
                value={formData.vendorReference}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-1">
                Revenue Generated
              </label>
              <input
                type="number"
                id="revenue"
                name="revenue"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
                value={formData.revenue}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="expense" className="block text-sm font-medium text-gray-700 mb-1">
                Disposal Expense
              </label>
              <input
                type="number"
                id="expense"
                name="expense"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
                value={formData.expense}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.currency}
                onChange={handleInputChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Additional notes or observations..."
              value={formData.notes}
              onChange={handleInputChange}
            />
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
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWasteEntryModal;
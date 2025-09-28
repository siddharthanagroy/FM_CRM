import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface CreateWasteTargetModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateWasteTargetModal: React.FC<CreateWasteTargetModalProps> = ({ onClose, onCreate }) => {
  const { createWasteTarget, wasteTargets } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear() + 1,
    diversionRate: 75,
    recyclingRate: 60,
    wasteReduction: 10,
    revenueTarget: 5000,
    carbonReduction: 500,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if target already exists for this year
    const existingTarget = wasteTargets.find(t => t.year === formData.year);
    if (existingTarget) {
      alert(`Target for year ${formData.year} already exists. Please choose a different year.`);
      return;
    }

    setLoading(true);
    
    try {
      await createWasteTarget(formData);
      onCreate();
    } catch (error) {
      console.error('Error creating waste target:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['year', 'revenueTarget', 'carbonReduction'].includes(name) 
        ? parseInt(value, 10) || 0
        : parseFloat(value) || 0
    }));
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Set Waste Management Target</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Year Selection */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Target Year *
            </label>
            <select
              id="year"
              name="year"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={formData.year}
              onChange={handleInputChange}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Core Targets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="diversionRate" className="block text-sm font-medium text-gray-700 mb-1">
                Diversion Rate Target (%) *
              </label>
              <input
                type="number"
                id="diversionRate"
                name="diversionRate"
                required
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.diversionRate}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">Percentage of waste diverted from landfill</p>
            </div>

            <div>
              <label htmlFor="recyclingRate" className="block text-sm font-medium text-gray-700 mb-1">
                Recycling Rate Target (%) *
              </label>
              <input
                type="number"
                id="recyclingRate"
                name="recyclingRate"
                required
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.recyclingRate}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">Percentage of total waste recycled</p>
            </div>

            <div>
              <label htmlFor="wasteReduction" className="block text-sm font-medium text-gray-700 mb-1">
                Waste Reduction Target (%) *
              </label>
              <input
                type="number"
                id="wasteReduction"
                name="wasteReduction"
                required
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.wasteReduction}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">Percentage reduction in total waste generated</p>
            </div>

            <div>
              <label htmlFor="carbonReduction" className="block text-sm font-medium text-gray-700 mb-1">
                Carbon Reduction Target (kg CO₂)
              </label>
              <input
                type="number"
                id="carbonReduction"
                name="carbonReduction"
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.carbonReduction}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">Target CO₂ equivalent reduction</p>
            </div>
          </div>

          {/* Financial Target */}
          <div>
            <label htmlFor="revenueTarget" className="block text-sm font-medium text-gray-700 mb-1">
              Revenue Target ($)
            </label>
            <input
              type="number"
              id="revenueTarget"
              name="revenueTarget"
              min="0"
              step="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="5000"
              value={formData.revenueTarget}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-1">Target revenue from waste recycling and sales</p>
          </div>

          {/* Target Guidelines */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Target Setting Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Diversion Rate:</strong> Industry best practice is 75-90%</li>
              <li>• <strong>Recycling Rate:</strong> Typical targets range from 50-70%</li>
              <li>• <strong>Waste Reduction:</strong> Annual reduction of 5-15% is achievable</li>
              <li>• <strong>Revenue:</strong> Consider market prices for recyclable materials</li>
              <li>• <strong>Carbon:</strong> Align with corporate sustainability commitments</li>
            </ul>
          </div>

          {/* ESG Alignment */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">ESG Framework Alignment</h4>
            <p className="text-sm text-green-700">
              These targets support Environmental (waste reduction, carbon footprint), 
              Social (community impact), and Governance (transparent reporting) objectives 
              for comprehensive ESG compliance.
            </p>
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
              {loading ? 'Setting Target...' : 'Set Target'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWasteTargetModal;
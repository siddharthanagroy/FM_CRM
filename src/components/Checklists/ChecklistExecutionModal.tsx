import React, { useState } from 'react';
import { X, CheckSquare, Camera, FileText, PenTool, Save, Send } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Checklist } from '../../contexts/DataContext';

interface ChecklistExecutionModalProps {
  checklist: Checklist;
  onClose: () => void;
  onComplete: () => void;
}

interface ExecutionResponse {
  itemId: string;
  value: any;
  notes?: string;
  photoUrl?: string;
  signatureUrl?: string;
}

const ChecklistExecutionModal: React.FC<ChecklistExecutionModalProps> = ({ 
  checklist, 
  onClose, 
  onComplete 
}) => {
  const { createChecklistExecution } = useData();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<ExecutionResponse[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [generalNotes, setGeneralNotes] = useState('');

  const currentItem = checklist.items[currentItemIndex];
  const isLastItem = currentItemIndex === checklist.items.length - 1;
  const isFirstItem = currentItemIndex === 0;

  const getResponse = (itemId: string) => {
    return responses.find(r => r.itemId === itemId);
  };

  const updateResponse = (itemId: string, updates: Partial<ExecutionResponse>) => {
    setResponses(prev => {
      const existing = prev.find(r => r.itemId === itemId);
      if (existing) {
        return prev.map(r => r.itemId === itemId ? { ...r, ...updates } : r);
      } else {
        return [...prev, { itemId, value: null, ...updates }];
      }
    });
  };

  const handleNext = () => {
    if (!isLastItem) {
      setCurrentItemIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstItem) {
      setCurrentItemIndex(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Check if all required items are completed
      const requiredItems = checklist.items.filter(item => item.required);
      const completedRequired = requiredItems.filter(item => {
        const response = getResponse(item.id);
        return response && response.value !== null && response.value !== '';
      });

      if (completedRequired.length < requiredItems.length) {
        alert('Please complete all required items before submitting.');
        setLoading(false);
        return;
      }

      await createChecklistExecution({
        checklistId: checklist.id,
        checklistName: checklist.name,
        assignedTo: user.name,
        responses,
        generalNotes,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      });

      onComplete();
    } catch (error) {
      console.error('Error completing checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItemInput = () => {
    const response = getResponse(currentItem.id);

    switch (currentItem.type) {
      case 'checkbox':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`item-${currentItem.id}`}
                  checked={response?.value === true}
                  onChange={() => updateResponse(currentItem.id, { value: true })}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-green-700 font-medium">Yes / Pass</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`item-${currentItem.id}`}
                  checked={response?.value === false}
                  onChange={() => updateResponse(currentItem.id, { value: false })}
                  className="text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-red-700 font-medium">No / Fail</span>
              </label>
            </div>
          </div>
        );

      case 'text':
        return (
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your response..."
            value={response?.value || ''}
            onChange={(e) => updateResponse(currentItem.id, { value: e.target.value })}
          />
        );

      case 'dropdown':
        return (
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={response?.value || ''}
            onChange={(e) => updateResponse(currentItem.id, { value: e.target.value })}
          >
            <option value="">Select an option...</option>
            {currentItem.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'photo':
        return (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Take a photo for this item</p>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => {
                  // In a real app, this would open camera or file picker
                  const mockPhotoUrl = `photo_${Date.now()}.jpg`;
                  updateResponse(currentItem.id, { value: mockPhotoUrl, photoUrl: mockPhotoUrl });
                }}
              >
                Take Photo
              </button>
            </div>
            {response?.photoUrl && (
              <div className="text-sm text-green-600">
                ✓ Photo captured: {response.photoUrl}
              </div>
            )}
          </div>
        );

      case 'signature':
        return (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Digital signature required</p>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => {
                  // In a real app, this would open signature pad
                  const mockSignatureUrl = `signature_${Date.now()}.png`;
                  updateResponse(currentItem.id, { value: mockSignatureUrl, signatureUrl: mockSignatureUrl });
                }}
              >
                Add Signature
              </button>
            </div>
            {response?.signatureUrl && (
              <div className="text-sm text-green-600">
                ✓ Signature captured: {response.signatureUrl}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getCompletionPercentage = () => {
    const totalItems = checklist.items.length;
    const completedItems = responses.filter(r => r.value !== null && r.value !== '').length;
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{checklist.name}</h2>
              <p className="text-sm text-gray-600">
                Item {currentItemIndex + 1} of {checklist.items.length} • {getCompletionPercentage()}% Complete
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getCompletionPercentage()}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Current Item */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {currentItem.title}
                  {currentItem.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                {currentItem.description && (
                  <p className="text-gray-600 mb-4">{currentItem.description}</p>
                )}
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {currentItem.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {renderItemInput()}

            {/* Notes for current item */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any additional notes or observations..."
                value={getResponse(currentItem.id)?.notes || ''}
                onChange={(e) => updateResponse(currentItem.id, { notes: e.target.value })}
              />
            </div>
          </div>

          {/* General Notes (shown on last item) */}
          {isLastItem && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                General Notes & Summary
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any general observations, issues found, or recommendations..."
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={handlePrevious}
              disabled={isFirstItem}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {checklist.items.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentItemIndex
                      ? 'bg-blue-600'
                      : responses.find(r => r.itemId === checklist.items[index].id)?.value !== null
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {isLastItem ? (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Complete Checklist
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistExecutionModal;
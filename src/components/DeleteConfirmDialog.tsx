import { PortfolioWithDetails } from '../types/database';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  portfolio: PortfolioWithDetails;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({ portfolio, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Delete Portfolio</h2>
          </div>

          <p className="text-slate-600 mb-2">
            Are you sure you want to delete the portfolio <strong>{portfolio.name}</strong>?
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Portfolio ID:</span>
                <span className="font-mono text-slate-900">{portfolio.portfolioid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Organization:</span>
                <span className="text-slate-900">{portfolio.organization_name}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-red-600 font-medium mb-6">
            This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Delete Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

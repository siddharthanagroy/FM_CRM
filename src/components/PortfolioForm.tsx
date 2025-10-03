import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PortfolioWithDetails, OrganizationWithCountry } from '../types/database';
import { X } from 'lucide-react';

interface PortfolioFormProps {
  portfolio: PortfolioWithDetails | null;
  organizations: OrganizationWithCountry[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function PortfolioForm({ portfolio, organizations, onClose, onSuccess }: PortfolioFormProps) {
  const [formData, setFormData] = useState({
    portfolioid: '',
    name: '',
    description: '',
    organizationid: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (portfolio) {
      setFormData({
        portfolioid: portfolio.portfolioid,
        name: portfolio.name,
        description: portfolio.description || '',
        organizationid: portfolio.organizationid,
      });
    }
  }, [portfolio]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!formData.portfolioid.trim()) {
        throw new Error('Portfolio ID is required');
      }
      if (!formData.name.trim()) {
        throw new Error('Portfolio name is required');
      }
      if (!formData.organizationid) {
        throw new Error('Organization is required');
      }

      if (portfolio) {
        const { error } = await supabase
          .from('portfolios')
          .update({
            portfolioid: formData.portfolioid,
            name: formData.name,
            description: formData.description || null,
            organizationid: formData.organizationid,
            updated_at: new Date().toISOString(),
          })
          .eq('id', portfolio.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolios')
          .insert({
            portfolioid: formData.portfolioid,
            name: formData.name,
            description: formData.description || null,
            organizationid: formData.organizationid,
          });

        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {portfolio ? 'Edit Portfolio' : 'Create New Portfolio'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="portfolioid" className="block text-sm font-semibold text-slate-700 mb-2">
              Portfolio ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="portfolioid"
              value={formData.portfolioid}
              onChange={(e) => setFormData({ ...formData, portfolioid: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
              placeholder="e.g., PORT-001"
              required
            />
            <p className="mt-1 text-xs text-slate-500">Unique identifier for this portfolio</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
              Portfolio Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., North American Properties"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={4}
              placeholder="Describe this portfolio..."
            />
          </div>

          <div>
            <label htmlFor="organizationid" className="block text-sm font-semibold text-slate-700 mb-2">
              Organization <span className="text-red-500">*</span>
            </label>
            <select
              id="organizationid"
              value={formData.organizationid}
              onChange={(e) => setFormData({ ...formData, organizationid: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select an organization...</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.country_name})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              The organization that owns this portfolio
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {saving ? 'Saving...' : portfolio ? 'Update Portfolio' : 'Create Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

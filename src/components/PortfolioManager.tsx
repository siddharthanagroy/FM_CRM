import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Portfolio, PortfolioWithDetails, OrganizationWithCountry } from '../types/database';
import { Plus, CreditCard as Edit2, Trash2, Search, Building2 } from 'lucide-react';
import PortfolioForm from './PortfolioForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';

export default function PortfolioManager() {
  const [portfolios, setPortfolios] = useState<PortfolioWithDetails[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationWithCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioWithDetails | null>(null);
  const [deletingPortfolio, setDeletingPortfolio] = useState<PortfolioWithDetails | null>(null);

  useEffect(() => {
    fetchPortfolios();
    fetchOrganizations();
  }, []);

  async function fetchPortfolios() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          organizations!inner (
            name,
            countries (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map((item: any) => ({
        ...item,
        organization_name: item.organizations?.name,
        country_name: item.organizations?.countries?.name,
      }));

      setPortfolios(formattedData);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrganizations() {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          *,
          countries (
            name
          )
        `)
        .order('name');

      if (error) throw error;

      const formattedData = data.map((item: any) => ({
        ...item,
        country_name: item.countries?.name || 'Unknown',
      }));

      setOrganizations(formattedData);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  }

  async function handleDelete(portfolio: PortfolioWithDetails) {
    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolio.id);

      if (error) throw error;

      setPortfolios(portfolios.filter(p => p.id !== portfolio.id));
      setDeletingPortfolio(null);
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('Failed to delete portfolio. Please try again.');
    }
  }

  const filteredPortfolios = portfolios.filter(portfolio =>
    portfolio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.portfolioid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portfolio.country_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">Portfolio Management</h1>
          </div>
          <p className="text-slate-600">Manage your organization portfolios and their relationships</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search portfolios, organizations, or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={() => {
                  setEditingPortfolio(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                Add Portfolio
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600">Loading portfolios...</p>
            </div>
          ) : filteredPortfolios.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">
                {searchTerm ? 'No portfolios match your search' : 'No portfolios yet'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first portfolio
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Portfolio ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredPortfolios.map((portfolio) => (
                    <tr key={portfolio.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-slate-900">{portfolio.portfolioid}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">{portfolio.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 line-clamp-2">
                          {portfolio.description || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-900">{portfolio.organization_name || '—'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {portfolio.country_name || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">
                          {new Date(portfolio.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingPortfolio(portfolio);
                              setIsFormOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit portfolio"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingPortfolio(portfolio)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete portfolio"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {filteredPortfolios.length > 0 && (
          <div className="mt-4 text-sm text-slate-600 text-center">
            Showing {filteredPortfolios.length} of {portfolios.length} portfolios
          </div>
        )}
      </div>

      {isFormOpen && (
        <PortfolioForm
          portfolio={editingPortfolio}
          organizations={organizations}
          onClose={() => {
            setIsFormOpen(false);
            setEditingPortfolio(null);
          }}
          onSuccess={() => {
            fetchPortfolios();
            setIsFormOpen(false);
            setEditingPortfolio(null);
          }}
        />
      )}

      {deletingPortfolio && (
        <DeleteConfirmDialog
          portfolio={deletingPortfolio}
          onConfirm={() => handleDelete(deletingPortfolio)}
          onCancel={() => setDeletingPortfolio(null)}
        />
      )}
    </div>
  );
}

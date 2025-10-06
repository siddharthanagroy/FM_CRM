import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Building2, MapPin, Home, Layers, 
  CreditCard as Edit, Trash2, Building 
} from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useAuth } from '../../contexts/AuthContext';

const PortfolioHierarchy = () => {
  const { 
    getOrganizationHierarchy, 
    deleteOrganization, 
    deletePortfolio, 
    deleteCampus, 
    deleteBuilding, 
    deleteFloor 
  } = usePortfolio();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const canManage = user?.role === 'admin' || user?.role === 'fm_manager';
  const hierarchy = getOrganizationHierarchy() || [];

  console.log('Organization Hierarchy:', hierarchy);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
    setExpandedItems(newExpanded);
  };

  const handleDelete = (type: string, id: string, name: string) => {
    if (!window.confirm(`Delete ${name}? This will remove all related entities.`)) return;
    switch (type) {
      case 'organization': deleteOrganization(id); break;
      case 'portfolio': deletePortfolio(id); break;
      case 'campus': deleteCampus(id); break;
      case 'building': deleteBuilding(id); break;
      case 'floor': deleteFloor(id); break;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'retired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {hierarchy.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Organization Data</h3>
          <p className="text-gray-500 mb-4">
            Create your first organization to organize your facilities.
          </p>
          {canManage && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create Organization
            </button>
          )}
        </div>
      ) : (
        hierarchy.map(org => (
          <div key={org.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Organization */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button onClick={() => toggleExpanded(`org-${org.id}`)} className="p-1 hover:bg-gray-100 rounded">
                  {expandedItems.has(`org-${org.id}`) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                <Building className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{org.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="font-mono text-indigo-600">{org.organizationid}</span>
                    {org.headquarters && <span>{org.headquarters}</span>}
                    <span>{(org.portfolios || []).length} portfolios</span>
                  </div>
                </div>
              </div>
              {canManage && (
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete('organization', org.id, org.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                </div>
              )}
            </div>

            {/* Portfolio */}
            {expandedItems.has(`org-${org.id}`) &&
              (org.portfolios || []).map(portfolio => (
                <div key={portfolio.id} className="pl-8 border-l-2 border-gray-200 ml-4">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => toggleExpanded(`portfolio-${portfolio.id}`)} className="p-1 hover:bg-gray-100 rounded">
                        {expandedItems.has(`portfolio-${portfolio.id}`) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{portfolio.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="font-mono text-blue-600">{portfolio.portfolioid}</span>
                          {portfolio.description && <span>{portfolio.description}</span>}
                          <span>{(portfolio.campuses || []).length} campuses</span>
                        </div>
                      </div>
                    </div>
                    {canManage && (
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete('portfolio', portfolio.id, portfolio.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    )}
                  </div>

                  {/* Campus */}
                  {expandedItems.has(`portfolio-${portfolio.id}`) &&
                    (portfolio.campuses || []).map(campus => (
                      <div key={campus.id} className="pl-8 border-l-2 border-gray-200 ml-4">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <button onClick={() => toggleExpanded(`campus-${campus.id}`)} className="p-1 hover:bg-gray-100 rounded">
                              {expandedItems.has(`campus-${campus.id}`) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                            <MapPin className="h-5 w-5 text-green-600" />
                            <div>
                              <h5 className="font-medium text-gray-900">{campus.name}</h5>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="font-mono text-green-600">{campus.campusid}</span>
                                <span>{campus.city}, {campus.country}</span>
                                <span>{(campus.buildings || []).length} buildings</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
};

export default PortfolioHierarchy;

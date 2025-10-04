import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Building2, MapPin, Home, X } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';

interface OfficeSelectorProps {
  onSelect: (selection: {
    organizationId: string;
    portfolioId: string;
    campusId: string;
    buildingId: string;
    displayName: string;
  }) => void;
  onClose: () => void;
}

const OfficeSelector: React.FC<OfficeSelectorProps> = ({ onSelect, onClose }) => {
  const { getOrganizationHierarchy } = usePortfolio();
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());
  const [expandedPortfolios, setExpandedPortfolios] = useState<Set<string>>(new Set());
  const [expandedCampuses, setExpandedCampuses] = useState<Set<string>>(new Set());

  const hierarchy = getOrganizationHierarchy();

  const toggleOrg = (id: string) => {
    const newSet = new Set(expandedOrgs);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedOrgs(newSet);
  };

  const togglePortfolio = (id: string) => {
    const newSet = new Set(expandedPortfolios);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedPortfolios(newSet);
  };

  const toggleCampus = (id: string) => {
    const newSet = new Set(expandedCampuses);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedCampuses(newSet);
  };

  const handleBuildingSelect = (
    org: any,
    portfolio: any,
    campus: any,
    building: any
  ) => {
    const displayName = `${org.name} > ${campus.name} > ${building.buildingName}`;
    onSelect({
      organizationId: org.id,
      portfolioId: portfolio.id,
      campusId: campus.id,
      buildingId: building.id,
      displayName,
    });
  };

  const handleCampusSelect = (
    org: any,
    portfolio: any,
    campus: any
  ) => {
    const displayName = `${org.name} > ${campus.name}`;
    onSelect({
      organizationId: org.id,
      portfolioId: portfolio.id,
      campusId: campus.id,
      buildingId: campus.buildings[0]?.id || '',
      displayName,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Select Office Location</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {hierarchy.map((org) => (
              <div key={org.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleOrg(org.id)}
                >
                  <div className="flex items-center space-x-2">
                    {expandedOrgs.has(org.id) ? (
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    )}
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{org.name}</span>
                  </div>
                </div>

                {expandedOrgs.has(org.id) && (
                  <div className="pl-6 pr-3 py-2 space-y-2">
                    {org.portfolios.map((portfolio: any) => (
                      <div key={portfolio.id} className="space-y-2">
                        <div
                          className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 rounded"
                          onClick={() => togglePortfolio(portfolio.id)}
                        >
                          <div className="flex items-center space-x-2">
                            {expandedPortfolios.has(portfolio.id) ? (
                              <ChevronDown className="h-4 w-4 text-gray-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-600" />
                            )}
                            <span className="text-sm font-medium text-gray-700">{portfolio.name}</span>
                          </div>
                        </div>

                        {expandedPortfolios.has(portfolio.id) && (
                          <div className="pl-6 space-y-2">
                            {portfolio.campuses.map((campus: any) => (
                              <div key={campus.id} className="space-y-2">
                                <div
                                  className="flex items-center justify-between p-2 cursor-pointer hover:bg-blue-50 rounded group"
                                  onClick={() => handleCampusSelect(org, portfolio, campus)}
                                >
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCampus(campus.id);
                                      }}
                                      className="p-1 hover:bg-gray-100 rounded"
                                    >
                                      {expandedCampuses.has(campus.id) ? (
                                        <ChevronDown className="h-4 w-4 text-gray-600" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-gray-600" />
                                      )}
                                    </button>
                                    <MapPin className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-gray-700 group-hover:text-blue-700">
                                      {campus.name}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500 group-hover:text-blue-600">
                                    Select Campus
                                  </span>
                                </div>

                                {expandedCampuses.has(campus.id) && (
                                  <div className="pl-6 space-y-1">
                                    {campus.buildings.map((building: any) => (
                                      <div
                                        key={building.id}
                                        className="flex items-center justify-between p-2 cursor-pointer hover:bg-blue-50 rounded group"
                                        onClick={() => handleBuildingSelect(org, portfolio, campus, building)}
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Home className="h-4 w-4 text-orange-600" />
                                          <span className="text-sm text-gray-700 group-hover:text-blue-700">
                                            {building.buildingName}
                                          </span>
                                        </div>
                                        <span className="text-xs text-gray-500 group-hover:text-blue-600">
                                          Select Building
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {hierarchy.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No organizations available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficeSelector;

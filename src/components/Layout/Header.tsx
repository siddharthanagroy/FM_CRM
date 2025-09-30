import React from 'react';
import {
  Bell,
  Search,
  LogOut,
  User,
  Building,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { usePortfolio } from '../../contexts/PortfolioContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { getUnreadNotifications } = useData();
  const { getOfficeHierarchy, organizations } = usePortfolio();
  const unreadNotifications = getUnreadNotifications();

  // Office selection states
  const [selectedOrganization, setSelectedOrganization] = React.useState('');
  const [selectedOffice, setSelectedOffice] = React.useState('');
  const [expandedOrganizations, setExpandedOrganizations] = React.useState<string[]>([]);
  const [expandedPortfolios, setExpandedPortfolios] = React.useState<string[]>([]);
  const [expandedCountries, setExpandedCountries] = React.useState<string[]>([]);
  const [expandedCampuses, setExpandedCampuses] = React.useState<string[]>([]);
  const [expandedBuildings, setExpandedBuildings] = React.useState<string[]>([]);
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Notifications dropdown
  const [showNotifications, setShowNotifications] = React.useState(false);

  // Get office hierarchy data
  const officeHierarchy = getOfficeHierarchy(selectedOrganization || undefined);

  // Organization selection handler
  const handleOrganizationSelect = (orgId: string) => {
    setSelectedOrganization(orgId);
    setSelectedOffice('');
    // Reset all expanded states
    setExpandedOrganizations([]);
    setExpandedPortfolios([]);
    setExpandedCountries([]);
    setExpandedCampuses([]);
    setExpandedBuildings([]);
  };

  // Office selection handler
  const handleOfficeSelect = (organization: any, portfolio: any, campus: any, building: any, floor?: any) => {
    const officePath = floor 
      ? `${organization.name} → ${portfolio.region} → ${portfolio.country} → ${campus.name} → ${building.buildingName} → Floor ${floor.floorNumber}`
      : `${organization.name} → ${portfolio.region} → ${portfolio.country} → ${campus.name} → ${building.buildingName}`;
    
    setSelectedOffice(officePath);
    setShowDropdown(false);
    
    // Store selection in localStorage for persistence
    localStorage.setItem('selectedOffice', JSON.stringify({
      organizationId: organization.id,
      portfolioId: portfolio.id,
      campusId: campus.id,
      buildingId: building.id,
      floorId: floor?.id,
      displayName: officePath,
    }));
  };

  // Load saved office selection on mount
  React.useEffect(() => {
    const savedOffice = localStorage.getItem('selectedOffice');
    if (savedOffice) {
      try {
        const parsed = JSON.parse(savedOffice);
        setSelectedOrganization(parsed.organizationId);
        setSelectedOffice(parsed.displayName);
      } catch (error) {
        console.error('Error loading saved office selection:', error);
      }
    }
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Welcome (hidden on mobile) */}
        <div className="flex items-center space-x-4">
          <h1 className="hidden sm:block text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Search tickets, assets..."
            />
          </div>

          {/* Organization / Office Tree Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none"
            >
              <Building className="h-4 w-4 text-gray-500" />
              <span>{selectedOffice || 'Select Office'}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showDropdown && (
              <div className="absolute mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                {/* Organization Selection */}
                {organizations.length > 1 && (
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Select Organization:</label>
                    <select
                      value={selectedOrganization}
                      onChange={(e) => handleOrganizationSelect(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All Organizations</option>
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {officeHierarchy.map((organization) => (
                  <div key={organization.id} className="border-b border-gray-100 last:border-none">
                    {/* Organization */}
                    <button
                      onClick={() =>
                        setExpandedOrganizations((prev) =>
                          prev.includes(organization.id)
                            ? prev.filter((id) => id !== organization.id)
                            : [...prev, organization.id]
                        )
                      }
                      className="flex w-full justify-between items-center px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50"
                    >
                      {organization.name}
                      {expandedOrganizations.includes(organization.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {/* Portfolios */}
                    {expandedOrganizations.includes(organization.id) &&
                      organization.portfolios.map((portfolio) => (
                        <div key={portfolio.id} className="pl-4">
                          <button
                            onClick={() =>
                              setExpandedPortfolios((prev) =>
                                prev.includes(portfolio.id)
                                  ? prev.filter((id) => id !== portfolio.id)
                                  : [...prev, portfolio.id]
                              )
                            }
                            className="flex w-full justify-between items-center px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded"
                          >
                            {portfolio.region} - {portfolio.country}
                            {expandedPortfolios.includes(portfolio.id) ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </button>

                          {/* Campuses */}
                          {expandedPortfolios.includes(portfolio.id) &&
                            portfolio.campuses.map((campus) => (
                              <div key={campus.id} className="pl-4">
                                <button
                                  onClick={() =>
                                    setExpandedCampuses((prev) =>
                                      prev.includes(campus.id)
                                        ? prev.filter(
                                            (id) =>
                                              id !== campus.id
                                          )
                                        : [...prev, campus.id]
                                    )
                                  }
                                  className="flex w-full justify-between items-center px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 rounded"
                                >
                                  {campus.name} ({campus.city})
                                  {expandedCampuses.includes(campus.id) ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3" />
                                  )}
                                </button>

                                {/* Buildings */}
                                {expandedCampuses.includes(campus.id) &&
                                  campus.buildings.map((building) => (
                                    <div key={building.id} className="pl-4">
                                      <button
                                        onClick={() =>
                                          setExpandedBuildings((prev) =>
                                            prev.includes(building.id)
                                              ? prev.filter((id) => id !== building.id)
                                              : [...prev, building.id]
                                          )
                                        }
                                        className="flex w-full justify-between items-center px-3 py-1 text-sm text-gray-400 hover:bg-gray-50 rounded"
                                      >
                                        {building.buildingName}
                                        {expandedBuildings.includes(building.id) ? (
                                          <ChevronDown className="h-3 w-3" />
                                        ) : (
                                          <ChevronRight className="h-3 w-3" />
                                        )}
                                      </button>

                                      {/* Building Selection */}
                                      {expandedBuildings.includes(building.id) && (
                                        <div className="pl-4">
                                          <button
                                            onClick={() => handleOfficeSelect(organization, portfolio, campus, building)}
                                            className="block w-full text-left px-3 py-1 text-xs text-gray-500 hover:bg-blue-50 hover:text-blue-700 rounded"
                                          >
                                            📍 {building.buildingName}
                                          </button>
                                          
                                          {/* Floors */}
                                          {building.floors.map((floor) => (
                                            <button
                                              key={floor.id}
                                              onClick={() => handleOfficeSelect(organization, portfolio, campus, building, floor)}
                                              className="block w-full text-left px-3 py-1 text-xs text-gray-500 hover:bg-blue-50 hover:text-blue-700 rounded"
                                            >
                                              🏢 Floor {floor.floorNumber}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                {unreadNotifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">No new notifications</p>
                ) : (
                  unreadNotifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <p>{n.message}</p>
                      <p className="text-xs text-gray-400">{n.timestamp}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative flex items-center space-x-3">
            <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role.replace('_', ' ')}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { Bell, Search, LogOut, User, Building, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { getUnreadNotifications, markNotificationAsRead } = useData();
  const unreadNotifications = getUnreadNotifications();

  const [showNotifications, setShowNotifications] = React.useState(false);

  // Office selection state
  const [selectedOffice, setSelectedOffice] = React.useState('');
  const [showOfficeSelector, setShowOfficeSelector] = React.useState(false);
  const [expandedCompany, setExpandedCompany] = React.useState<string | null>(null);
  const [expandedState, setExpandedState] = React.useState<string | null>(null);

  // Office hierarchy data
  const officeHierarchy = {
    company: 'Subhra Solutions',
    regions: [
      {
        id: 'india',
        name: 'India',
        states: [
          {
            id: 'west-bengal',
            name: 'West Bengal',
            offices: [
              { id: 'IN-10001', name: 'IN 10001-RDB Tech Park' },
              { id: 'IN-10002', name: 'IN 10002- Millenium City' }
            ]
          },
          {
            id: 'karnataka',
            name: 'Karnataka',
            offices: [
              { id: 'IN-10003', name: 'IN 10003 - Embassy Golf Link' },
              { id: 'IN-10004', name: 'IN 10004 - Manyata Tech Park' }
            ]
          }
        ]
      }
    ]
  };

  const handleOfficeSelect = (office: any, state: string) => {
    setSelectedOffice(`${state} - ${office.name}`);
    setShowOfficeSelector(false);
    setExpandedCompany(null);
    setExpandedState(null);
  };

  const toggleExpanded = (type: 'company' | 'state', id: string) => {
    if (type === 'company') {
      setExpandedCompany(expandedCompany === id ? null : id);
    } else {
      setExpandedState(expandedState === id ? null : id);
    }
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.office-selector') && !target.closest('.notifications-dropdown')) {
        setShowOfficeSelector(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Welcome - Hidden on mobile */}
        <div className="hidden sm:flex items-center space-x-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
        </div>

        {/* Mobile title */}
        <div className="sm:hidden">
          <h1 className="text-lg font-semibold text-gray-900">FM CRM</h1>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search - Hidden on mobile */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Search tickets, assets..."
            />
          </div>

          {/* Office Selector */}
          <div className="relative office-selector">
            <button
              onClick={() => setShowOfficeSelector(!showOfficeSelector)}
              className="flex items-center space-x-1 sm:space-x-2 border border-gray-300 rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 hover:bg-gray-50"
            >
              <Building className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="hidden sm:inline truncate max-w-32 lg:max-w-none">
                {selectedOffice || 'Select Office'}
              </span>
              <span className="sm:hidden">Office</span>
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </button>

            {/* Office Dropdown */}
            {showOfficeSelector && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{officeHierarchy.company}</h3>
                    <button
                      onClick={() => setShowOfficeSelector(false)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {officeHierarchy.regions.map((region) => (
                  <div key={region.id} className="border-b border-gray-100 last:border-none">
                    <button
                      onClick={() => toggleExpanded('company', region.id)}
                      className="flex w-full justify-between items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {region.name}
                      {expandedCompany === region.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {expandedCompany === region.id && (
                      <div className="pl-4 pb-2">
                        {region.states.map((state) => (
                          <div key={state.id} className="mb-2">
                            <button
                              onClick={() => toggleExpanded('state', state.id)}
                              className="flex w-full justify-between items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                            >
                              {state.name}
                              {expandedState === state.id ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>

                            {expandedState === state.id && (
                              <div className="pl-4 mt-1 space-y-1">
                                {state.offices.map((office) => (
                                  <button
                                    key={office.id}
                                    onClick={() => handleOfficeSelect(office, state.name)}
                                    className="block w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded"
                                  >
                                    {office.name}
                                  </button>
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

          {/* Notifications */}
          <div className="relative notifications-dropdown">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {unreadNotifications.length > 0 ? (
                    unreadNotifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.priority === 'high' ? 'bg-red-500' :
                            notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
    {
      id: 'c1',
      name: 'Company A',
      offices: ['Delhi', 'Mumbai', 'Bangalore'],
    },
    {
      id: 'c2',
      name: 'Company B',
      offices: ['Hyderabad', 'Chennai'],
    },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Welcome */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">
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

          {/* Company / Office Selector */}
          <div className="relative">
            {!useTreeSelector ? (
              // Simple Dropdown
              <select
                value={selectedOffice}
                onChange={(e) => setSelectedOffice(e.target.value)}
                className="border border-gray-300 text-sm rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Office</option>
                {companies.map((c) =>
                  c.offices.map((o) => (
                    <option key={`${c.id}-${o}`} value={`${c.name} - ${o}`}>
                      {c.name} → {o}
                    </option>
                  ))
                )}
              </select>
            ) : (
              // Tree Selector
              <div className="relative">
                <button
                  className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <Building className="h-4 w-4 text-gray-500" />
                  <span>{selectedOffice || 'Select Company / Office'}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* Dropdown tree */}
                <div className="absolute mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  {companies.map((company) => (
                    <div key={company.id} className="border-b border-gray-100 last:border-none">
                      <button
                        onClick={() =>
                          setExpandedCompany(
                            expandedCompany === company.id ? null : company.id
                          )
                        }
                        className="flex w-full justify-between items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {company.name}
                        {expandedCompany === company.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      {expandedCompany === company.id && (
                        <div className="pl-6 pb-2">
                          {company.offices.map((office) => (
                            <button
                              key={office}
                              onClick={() => {
                                setSelectedOffice(`${company.name} - ${office}`);
                                setExpandedCompany(null);
                              }}
                              className="block w-full text-left px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                            >
                              {office}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
            {/* Notifications dropdown unchanged */}
          </div>

          {/* User Menu */}
          <div className="relative flex items-center space-x-3">
            <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role.replace('_', ' ')}</p>
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

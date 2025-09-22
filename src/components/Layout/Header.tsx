import React from 'react';
import { Bell, Search, LogOut, User, Building, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { getUnreadNotifications, markNotificationAsRead } = useData();
  const unreadNotifications = getUnreadNotifications();

  const [showNotifications, setShowNotifications] = React.useState(false);

  // New state for company/office
  const [selectedOffice, setSelectedOffice] = React.useState('');
  const [useTreeSelector, setUseTreeSelector] = React.useState(true); // set default to tree

  const [expandedCompany, setExpandedCompany] = React.useState<string | null>(null);

  // Example data (replace with API/Firestore later)
  const companies = [
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
                  <span>{selectedOffice || 'Select Company'}</span>
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

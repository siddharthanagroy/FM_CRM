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

const Header = () => {
  const { user, logout } = useAuth();
  const { getUnreadNotifications } = useData();
  const unreadNotifications = getUnreadNotifications();

  // Company/office selection states
  const [selectedOffice, setSelectedOffice] = React.useState('');// full path
  
  const [expandedCompanies, setExpandedCompanies] = React.useState<string[]>([]);
  const [expandedCountries, setExpandedCountries] = React.useState<string[]>([]);
  const [expandedCities, setExpandedCities] = React.useState<string[]>([]);
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Example hierarchical data
  const companies = [
    {
      id: 'c1',
      name: 'APAC',
      countries: [
        {
          name: 'India',
          cities: [
            { name: 'Delhi', offices: ['Office 1', 'Office 2'] },
            { name: 'Mumbai', offices: ['Office 1'] },
          ],
        },
      ],
    },
    {
      id: 'c2',
      name: 'EMEA',
      countries: [
        {
          name: 'England',
          cities: [
            { name: 'Durham', offices: ['Office 1'] },
            { name: 'London', offices: ['Office 1', 'Office 2', 'Office 3'] },
          ],
        },
      ],
    },
  ];

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

          {/* Company / Office Tree Dropdown */}
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
              <div className="absolute mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                {companies.map((company) => (
                  <div key={company.id} className="border-b border-gray-100 last:border-none">
                    {/* Company */}
                    <button
                      onClick={() =>
                        setExpandedCompanies((prev) =>
                          prev.includes(company.id)
                            ? prev.filter((id) => id !== company.id)
                            : [...prev, company.id]
                        )
                      }
                      className="flex w-full justify-between items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {company.name}
                      {expandedCompanies.includes(company.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {/* Countries */}
                    {expandedCompanies.includes(company.id) &&
                      company.countries.map((country) => (
                        <div key={country.name} className="pl-4">
                          <button
                            onClick={() =>
                              setExpandedCountries((prev) =>
                                prev.includes(`${company.id}-${country.name}`)
                                  ? prev.filter((id) => id !== `${company.id}-${country.name}`)
                                  : [...prev, `${company.id}-${country.name}`]
                              )
                            }
                            className="flex w-full justify-between items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                          >
                            {country.name}
                            {expandedCountries.includes(`${company.id}-${country.name}`) ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </button>

                          {/* Cities */}
                          {expandedCountries.includes(`${company.id}-${country.name}`) &&
                            country.cities.map((city) => (
                              <div key={city.name} className="pl-4">
                                <button
                                  onClick={() =>
                                    setExpandedCities((prev) =>
                                      prev.includes(`${company.id}-${country.name}-${city.name}`)
                                        ? prev.filter(
                                            (id) =>
                                              id !==
                                              `${company.id}-${country.name}-${city.name}`
                                          )
                                        : [...prev, `${company.id}-${country.name}-${city.name}`]
                                    )
                                  }
                                  className="flex w-full justify-between items-center px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 rounded"
                                >
                                  {city.name}
                                  {expandedCities.includes(
                                    `${company.id}-${country.name}-${city.name}`
                                  ) ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3" />
                                  )}
                                </button>

                                {/* Offices */}
                                {expandedCities.includes(
                                  `${company.id}-${country.name}-${city.name}`
                                ) &&
                                {city.offices.map((office) => (
  <button
    key={office}
    onClick={() => {
      setSelectedOffice(office); // only the office name for display
      setShowDropdown(false); // close dropdown
    }}
    className="block w-full text-left px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded"
  >
    {office}
  </button>
))}
     

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
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
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

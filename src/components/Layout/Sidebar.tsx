import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardList, 
  Package, 
  Building2, 
  Users,
  Settings,
  BarChart3,
  Shield,
  Wrench,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Truck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getNavItems = () => {
    const baseItems = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ];

    const roleBasedItems: Record<string, any[]> = {
      admin: [
        { icon: FileText, label: 'Service Requests', path: '/service-requests' },
        { icon: ClipboardList, label: 'Work Orders', path: '/work-orders' },
        { icon: Wrench, label: 'Service Orders', path: '/service-orders' },
        { icon: Package, label: 'Assets', path: '/assets' },
        { icon: Shield, label: 'PPM / Compliance', path: '/compliances' },
        { icon: CheckSquare, label: 'Checklists', path: '/checklists' },
        { icon: Truck, label: 'Vendors', path: '/vendors' },
        { icon: Users, label: 'Users', path: '/users' },
        { icon: BarChart3, label: 'Reports', path: '/reports' },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ],
      fm_manager: [
        { icon: FileText, label: 'Service Requests', path: '/service-requests' },
        { icon: ClipboardList, label: 'Work Orders', path: '/work-orders' },
        { icon: Wrench, label: 'Service Orders', path: '/service-orders' },
        { icon: Package, label: 'Assets', path: '/assets' },
        { icon: Shield, label: 'PPM / Compliance', path: '/compliances' },
        { icon: CheckSquare, label: 'Checklists', path: '/checklists' },
        { icon: Truck, label: 'Vendors', path: '/vendors' },
        { icon: BarChart3, label: 'Reports', path: '/reports' },
      ],
      technician: [
        { icon: ClipboardList, label: 'Work Orders', path: '/work-orders' },
        { icon: Wrench, label: 'My Service Orders', path: '/service-orders' },
        { icon: Package, label: 'Assets', path: '/assets' },
        { icon: CheckSquare, label: 'My Checklists', path: '/checklists' },
      ],
      hk_team: [
        { icon: ClipboardList, label: 'Work Orders', path: '/work-orders' },
        { icon: Wrench, label: 'My Service Orders', path: '/service-orders' },
        { icon: CheckSquare, label: 'My Checklists', path: '/checklists' },
      ],
      end_user: [
        { icon: FileText, label: 'My Service Requests', path: '/service-requests' },
      ],
    };

    return [...baseItems, ...(roleBasedItems[user?.role || 'end_user'] || [])];
  };

  const navItems = getNavItems();

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile hamburger button
  const MobileMenuButton = () => (
    <button
      onClick={toggleSidebar}
      className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50"
      aria-label="Toggle menu"
    >
      {isMobileMenuOpen ? (
        <X className="h-6 w-6 text-gray-700" />
      ) : (
        <Menu className="h-6 w-6 text-gray-700" />
      )}
    </button>
  );

  // Desktop collapse button
  const CollapseButton = () => (
    <button
      onClick={toggleSidebar}
      className="hidden md:flex absolute -right-3 top-8 z-10 p-1.5 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50"
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {isCollapsed ? (
        <ChevronRight className="h-4 w-4 text-gray-600" />
      ) : (
        <ChevronLeft className="h-4 w-4 text-gray-600" />
      )}
    </button>
  );

  // Mobile overlay
  const MobileOverlay = () => (
    isMobileMenuOpen && (
      <div
        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
        onClick={closeMobileMenu}
      />
    )
  );

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';
  const mobileClasses = isMobile 
    ? `fixed inset-y-0 left-0 z-30 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`
    : 'relative';

  return (
    <>
      <MobileMenuButton />
      <MobileOverlay />
      
      <div className={`bg-white h-full shadow-lg border-r border-gray-200 ${sidebarWidth} ${mobileClasses} transition-all duration-300 flex flex-col`}>
        <CollapseButton />
        
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">FM CRM</h1>
                <p className="text-xs text-gray-500 whitespace-nowrap">Facility Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation - Now takes remaining space */}
        <nav className="flex-1 mt-6 px-4 pb-4 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                title={isCollapsed && !isMobile ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(!isCollapsed || isMobile) && (
                  <span className="ml-3 whitespace-nowrap">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed desktop view */}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Optional: Small branding footer (only visible when expanded) */}
        {(!isCollapsed || isMobile) && (
          <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              © 2024 FM CRM
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
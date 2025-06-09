import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ActivitySquare, CalendarClock, ClipboardList, History, User, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { doctor, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/appointments', icon: <ClipboardList className="w-5 h-5" />, label: 'Приёмы' },
    { path: '/history', icon: <History className="w-5 h-5" />, label: 'История' },
    { path: '/schedule', icon: <CalendarClock className="w-5 h-5" />, label: 'Расписание' },
    { path: '/profile', icon: <User className="w-5 h-5" />, label: 'Профиль' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:z-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ActivitySquare className="h-8 w-8 text-primary-600" />
              <span className="text-lg font-semibold">MediLink</span>
            </div>
            <button 
              className="p-1 rounded-md lg:hidden hover:bg-gray-100" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center px-4 py-3 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-primary-50 text-primary-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  src={doctor?.profileImage || "https://randomuser.me/api/portraits/men/75.jpg"} 
                  alt="Врач" 
                  className="h-10 w-10 rounded-full"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{doctor?.name}</p>
                <p className="text-xs text-gray-500">{doctor?.specialty}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="mt-4 flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              className="p-1 rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="text-xl font-semibold text-gray-800 lg:hidden">
              MediLink
            </div>
            
            <div className="text-xl font-semibold text-gray-800 hidden lg:block">
              {navItems.find(item => item.path === location.pathname)?.label || 'Панель управления'}
            </div>
            
            <div className="flex items-center">
              {/* Notification bell icon could go here */}
              <div className="hidden sm:flex items-center ml-4">
                <span className="text-sm text-gray-700 mr-2">Др. {doctor?.name?.split(' ')[1]}</span>
                <img 
                  src={doctor?.profileImage || "https://randomuser.me/api/portraits/men/75.jpg"} 
                  alt="Врач" 
                  className="h-8 w-8 rounded-full"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
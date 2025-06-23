import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

// import { WebSocketContext } from '../context/SocketContext';

export default function Navbar({ onTabChange, unreadCount, resetUnreadCount }) {
  const { auth, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const { unreadCount, resetUnreadCount } = useContext(WebSocketContext);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    ...(auth.role === 'argonome' ? [{
      key: 'publish',
      label: 'Publish',
    }] : []),
    { key: 'feed', label: 'Feed' },
    { key: 'map', label: 'Carte' },
    { key: 'notifications', label: 'Notifications' },
  ];

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">🌱 CropAlert</div>
            <div className="text-lg hidden sm:block">Welcome {auth.role}</div>
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    onTabChange(key)
                    if (key === 'notifications') resetUnreadCount();
                  }}
                  className="relative bg-white text-green-700 px-4 py-2 rounded hover:bg-green-100"
                >
                  {label}
                  {key === 'notifications' && unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}

            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Log Out
            </button>
          </div>

          {/* Burger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white text-2xl focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {menuItems.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  onTabChange(key);
                  if (key === 'notifications') resetUnreadCount();
                  setIsMobileMenuOpen(false);
                }}
                className="relative block w-full bg-white text-green-700 px-4 py-2 rounded hover:bg-green-100"
              >
                {label}
                {key === 'notifications' && unreadCount > 0 && (
                  <span className="absolute top-1 right-4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}

          <button
            onClick={logout}
            className="block w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}

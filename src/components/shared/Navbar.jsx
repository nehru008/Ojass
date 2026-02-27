import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/map', icon: '🗺️', label: 'Map' },
  { path: '/responder', icon: '🚑', label: 'Respond' },
  { path: '/profile', icon: '👤', label: 'Profile' },
  { path: '/admin', icon: '⚙️', label: 'Admin' },
];

/**
 * Navbar Component - Bottom navigation bar
 */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass z-50"
         style={{ borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex justify-around items-center py-2 px-4 max-w-lg mx-auto">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${active ? 'text-red-400' : 'text-gray-500'}`}
            >
              <span className={`text-xl w-10 h-10 flex items-center justify-center rounded-xl transition-all ${active ? 'bg-red-500 bg-opacity-15' : ''}`}>
                {item.icon}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;

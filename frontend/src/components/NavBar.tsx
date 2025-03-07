// frontend/src/components/Navbar.tsx
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-slate-900 p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="text-2xl font-bold text-white flex items-center">
            <span className="text-blue-400 mr-2">♞</span> Chess App
          </Link>
        </div>
        
        <div className="flex flex-wrap justify-center space-x-1 md:space-x-4">
          <Link
            to="/game"
            className={`px-4 py-2 rounded-md transition-colors ${
              isActive('/game')
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Play Online
          </Link>
          
          <Link
            to="/play-computer"
            className={`px-4 py-2 rounded-md transition-colors ${
              isActive('/play-computer')
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Play Computer
          </Link>
        </div>
      </div>
    </nav>
  );
};
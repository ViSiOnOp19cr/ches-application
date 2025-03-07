import { useAuth, UserButton } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

export const Navbar = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  
  return (
    <nav className="bg-slate-900 p-4">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">Chess App</Link>
        
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Link to="/game" className="text-white hover:text-blue-300">Play</Link>
              <div className="flex items-center">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonBox: 'relative',
                      userButtonTrigger: 'focus:outline-none hover:opacity-80',
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <Button 
                varient="primary" 
                size="sm" 
                text="Sign In" 
                onClick={() => navigate('/sign-in')} 
              />
              <Button 
                varient="secondary" 
                size="sm" 
                text="Sign Up" 
                onClick={() => navigate('/sign-up')} 
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
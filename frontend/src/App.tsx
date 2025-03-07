
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import './App.css';
import {Landing} from './pages/home';
import {Game} from './pages/game';
import { SignInPage } from './pages/auth/SignIn';
import { SignUpPage } from './pages/auth/SignUp';
import { ProfilePage } from './pages/auth/userProfile';
import { useAuth, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import {Navbar} from './components/NavBar';
import {ComputerGame} from './pages/computerGame';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen bg-slate-800">
      <div className="bg-slate-700 p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-xl text-white mb-4">Loading authentication...</h2>
        <div className="animate-pulse bg-blue-500 h-2 w-64 rounded"></div>
      </div>
    </div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <>{children}</>;
};


function App() {
  return (
    <div>
      <div className='min-h-screen bg-slate-800'>
        <ClerkLoading>
          <div className="flex justify-center items-center h-screen bg-slate-800">
            <div className="bg-slate-700 p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-xl text-white mb-4">Loading authentication...</h2>
              <div className="animate-pulse bg-blue-500 h-2 w-64 rounded"></div>
            </div>
          </div>
        </ClerkLoading>
        
        <ClerkLoaded>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/game" element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              } />
              <Route path="/play-computer" element={
                <ProtectedRoute>
                  <ComputerGame/>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </ClerkLoaded>
      </div>
    </div>
  );
}

export default App;

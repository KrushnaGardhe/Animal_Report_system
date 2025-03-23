import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import ReportForm from './components/ReportForm';
import NGOLogin from './components/NGOLogin';
import NGORegister from './components/NGORegister';
import NGODashboard from './components/NGODashboard';
import Home from './components/Home';
import { supabase } from './lib/supabase';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const isDashboard = location.pathname === '/ngo/dashboard';

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      if (!session) {
        navigate('/ngo/login');
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/ngo/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <PawPrint className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Animal Rescue</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/report" className="text-gray-600 hover:text-gray-900">Report Case</Link>
            {isDashboard ? (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/ngo/register"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Register NGO
                </Link>
                <Link
                  to="/ngo/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  NGO Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/ngo/login" element={<NGOLogin />} />
            <Route path="/ngo/register" element={<NGORegister />} />
            <Route path="/ngo/dashboard" element={<NGODashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
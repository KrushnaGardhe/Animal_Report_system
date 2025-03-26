import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { PawPrint, Menu, X } from 'lucide-react';
import ReportForm from './components/ReportForm';
import NGOLogin from './components/NGOLogin';
import NGORegister from './components/NGORegister';
import NGODashboard from './components/NGODashboard';
import Home from './components/Home';
import FirstAid from './components/FirstAid';
import { supabase } from './lib/supabase';

function MobileNav({ isOpen, setIsOpen, session, handleSignOut, isDashboard }) {
  return (
    <div
      className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      onClick={() => setIsOpen(false)}
    >
      <div
        className={`fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="py-4">
          {isDashboard ? (
            <div className="px-4">
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">

              <div className="border-t my-2"></div>
              <Link
                to="/ngo/register"
                className="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                onClick={() => setIsOpen(false)}
              >
                Register NGO
              </Link>
              <Link
                to="/ngo/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                NGO Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isDashboard = location.pathname === '/ngo/dashboard';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

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
    <>
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {isDashboard ? (
              <Link className="flex items-center">
                <PawPrint className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Animal Rescue</span>
              </Link>
            ) : (
              <Link to="/" className="flex items-center">
                <PawPrint className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Animal Rescue</span>
              </Link>
            )}


            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {isDashboard ? (
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Sign Out
                </button>
              ) : (
                <>

                  <Link
                    to="/ngo/register"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Register NGO
                  </Link>
                  <Link
                    to="/ngo/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    NGO Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        session={session}
        handleSignOut={handleSignOut}
        isDashboard={isDashboard}
      />
    </>
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
            <Route path="/first-aid" element={<FirstAid />} />
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
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, onAuthStateChanged, FirebaseUser, db, doc, getDoc, setDoc } from '../firebase';
import { LogIn, LogOut, Search, TrendingUp, ShieldCheck, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user exists in Firestore, if not create them
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            role: currentUser.email === 'jamesjamire@gmail.com' ? 'admin' : 'brand'
          });
          setIsAdmin(currentUser.email === 'jamesjamire@gmail.com');
        } else {
          setIsAdmin(userDoc.data().role === 'admin');
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { name: 'Discovery', path: '/discovery', icon: Search },
    { name: 'Rankings', path: '/rankings', icon: TrendingUp },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin', icon: ShieldCheck }] : []),
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
                  <TrendingUp size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500">
                  Qu
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-emerald-600 ${
                    location.pathname === item.path ? 'text-emerald-600' : 'text-stone-600'
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-stone-200">
                  <div className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-stone-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                        <User size={16} />
                      </div>
                    )}
                    <span className="text-sm font-medium hidden lg:block">{user.displayName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-stone-500 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm"
                >
                  <LogIn size={18} />
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 rounded-xl transition-colors"
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                <div className="pt-4 border-t border-stone-100">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-4">
                        <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-xs text-stone-500">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 text-white rounded-xl font-medium"
                    >
                      <LogIn size={20} />
                      Sign In with Google
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-stone-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                  <TrendingUp size={20} />
                </div>
                <span className="text-lg font-bold tracking-tight">Qu</span>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                The premier influencer discovery and ranking platform for the East African market. 
                Empowering brands with AI-driven insights.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-stone-400">Platform</h4>
              <ul className="space-y-2 text-sm text-stone-600">
                <li><Link to="/discovery" className="hover:text-emerald-600 transition-colors">Discovery</Link></li>
                <li><Link to="/rankings" className="hover:text-emerald-600 transition-colors">Rankings</Link></li>
                <li><Link to="/about" className="hover:text-emerald-600 transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-stone-400">Legal</h4>
              <ul className="space-y-2 text-sm text-stone-600">
                <li><Link to="/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-100 text-center text-xs text-stone-400">
            © {new Date().getFullYear()} Qu. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

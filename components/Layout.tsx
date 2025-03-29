import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiFolder, 
  FiBarChart2,
  FiMenu,
  FiX
} from 'react-icons/fi';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for nav bar effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActivePath = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/categories', label: 'Categories', icon: FiFolder },
    { path: '/reports', label: 'Reports', icon: FiBarChart2 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header 
        className={`fixed w-full top-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-sm shadow-sm' 
            : 'bg-gradient-to-r from-blue-800 to-blue-800 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-blue-800 rounded-md">
                <h1 className={`text-xl font-bold transition-colors duration-300 ${
                  scrolled ? 'text-blue-800' : 'text-white'
                }`}>
                  Expense Tracker
                </h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <Link 
                    key={item.path} 
                    href={item.path} 
                    className={`group relative flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      scrolled
                        ? isActive
                          ? 'text-blue-800' 
                          : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50/80'
                        : isActive
                          ? 'text-white bg-white/20' 
                          : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="mr-1.5" size={18} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className={`absolute bottom-0 left-1/2 w-1/2 h-0.5 transform -translate-x-1/2 rounded-full ${
                        scrolled ? 'bg-blue-800' : 'bg-white'
                      }`}></span>
                    )}
                  </Link>
                );
              })}
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-inset ${
                  scrolled
                    ? 'text-gray-600 hover:text-blue-800 focus:ring-blue-800' 
                    : 'text-white hover:bg-white/10 focus:ring-white'
                }`}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <FiX className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 shadow-md rounded-b-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-150 ${
                    isActivePath(item.path)
                      ? 'bg-blue-50 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3" size={20} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Add padding to compensate for fixed header */}
      <div className="pt-16 flex-grow flex">
        <main className="flex-grow p-4 md:p-6 w-full">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 
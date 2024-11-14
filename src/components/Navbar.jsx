import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { navItems } from "../constants";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  
  useEffect(() => {
    const updateCursorPosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* Outer circle */}
      <div
        className={`w-8 h-8 border-2 border-orange-500 rounded-full transition-transform duration-150 ease-out ${
          isClicking ? 'scale-75' : 'scale-100'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Inner dot */}
      <div
        className={`absolute top-1/4 center rounded-full transition-all duration-150 ease-out ${
          isClicking ? 'bg-red-500 scale-[2]' : 'bg-orange-500 scale-100'
        }`}
        style={{
          width: '8px',
          height: '8px',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <>
      <CustomCursor />
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        a, button, [role="button"] {
          cursor: none !important;
        }

        a:hover, button:hover, [role="button"]:hover {
          cursor: none !important;
        }
      `}</style>
      <nav className={`sticky top-0 z-50 py-3 border-b transition-colors duration-300
        ${darkMode ? 'border-orange-500/20 bg-black/80' : 'border-neutral-200 bg-white/80'}
        backdrop-blur-lg`}>
        <div className="container px-4 mx-auto relative lg:text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center flex-shrink-0">
              <span className={`text-xl tracking-tight 
                ${darkMode ? 'text-orange-100' : 'text-neutral-900'}`}>
                Aumkar Mali
              </span>
            </div>
            
            <div className="flex items-center gap-8">
              <ul className="hidden lg:flex space-x-12">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href} 
                      className={`transition-colors duration-300
                        ${darkMode 
                          ? 'text-orange-200 hover:text-orange-400' 
                          : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={toggleTheme} 
                className={`p-2 rounded-full transition-all duration-300
                  ${darkMode 
                    ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 hover:text-orange-300' 
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                  }`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button 
                onClick={toggleNavbar} 
                className={`lg:hidden transition-colors duration-300
                  ${darkMode ? 'text-orange-400' : 'text-neutral-700'}`}
              >
                {mobileDrawerOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {mobileDrawerOpen && (
            <div className={`fixed inset-x-0 top-[calc(100%+1px)] z-20 p-6 
              flex flex-col items-center lg:hidden transition-colors duration-300
              ${darkMode 
                ? 'bg-gradient-to-b from-black to-neutral-900 border-b border-orange-500/20' 
                : 'bg-white border-b border-neutral-200'
              }`}>
              <ul className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href} 
                      className={`text-lg transition-colors duration-300
                        ${darkMode 
                          ? 'text-orange-200 hover:text-orange-400' 
                          : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
          <p>© {new Date().getFullYear()} matchCalii. All rights reserved.</p>
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import getIcon from './utils/iconUtils';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toast.info(`Theme changed to ${!isDarkMode ? 'dark' : 'light'} mode`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: !isDarkMode ? "dark" : "light",
    });
  };

  // Dynamic icon components
  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-surface-200 dark:border-surface-700 py-3 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="font-heading text-xl sm:text-2xl font-bold text-primary dark:text-primary-light">
            MathWizPro
          </a>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700"
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? 
              <SunIcon className="w-5 h-5 text-yellow-400" /> : 
              <MoonIcon className="w-5 h-5 text-surface-600" />
            }
          </motion.button>
        </div>
      </header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="mt-auto py-4 px-4 sm:px-6 lg:px-8 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto text-center text-sm text-surface-500 dark:text-surface-400">
          <p>© {new Date().getFullYear()} MathWizPro. All rights reserved.</p>
        </div>
      </footer>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
        className="!font-sans"
        toastClassName="!bg-surface-50 !text-surface-800 dark:!bg-surface-800 dark:!text-surface-100 !shadow-card !border !border-surface-200 dark:!border-surface-700"
      />
    </div>
  );
}

export default App;
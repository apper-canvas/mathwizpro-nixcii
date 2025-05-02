import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  const navigate = useNavigate();
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const HomeIcon = getIcon('Home');

  return (
    <motion.div 
      className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-20 h-20 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-6"
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center">Page Not Found</h2>
      
      <p className="text-surface-600 dark:text-surface-300 text-center max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved to another location.
      </p>
      
      <motion.button
        onClick={() => navigate('/')}
        className="btn btn-primary flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <HomeIcon className="w-5 h-5" />
        <span>Back to Home</span>
      </motion.button>
    </motion.div>
  );
};

export default NotFound;
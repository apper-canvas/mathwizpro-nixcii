import { useState } from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = () => {
  const [calculatorMode, setCalculatorMode] = useState('standard'); // standard, scientific
  
  // Dynamic icon components
  const CalculatorIcon = getIcon('Calculator');
  const PlusSquareIcon = getIcon('PlusSquare');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
        <motion.div 
          className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-primary/10 text-primary dark:text-primary-light mb-4"
          whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <CalculatorIcon className="w-8 h-8 md:w-10 md:h-10" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2">
          MathWizPro
        </h1>
        <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 text-center max-w-2xl">
          Your advanced calculator for all mathematical operations
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border 
              ${calculatorMode === 'standard' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-300 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700'}`}
            onClick={() => setCalculatorMode('standard')}
          >
            Standard
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border 
              ${calculatorMode === 'scientific' 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-300 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700'}`}
            onClick={() => setCalculatorMode('scientific')}
          >
            Scientific
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <MainFeature mode={calculatorMode} />
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {featuresData.map((feature, index) => (
          <motion.div
            key={index}
            className="card p-6 flex flex-col items-center text-center"
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-100 dark:bg-surface-700 mb-4">
              {React.createElement(getIcon(feature.icon), { className: "w-6 h-6 text-primary dark:text-primary-light" })}
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-surface-600 dark:text-surface-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const featuresData = [
  {
    icon: 'Calculator',
    title: 'Basic Operations',
    description: 'Perform addition, subtraction, multiplication, and division with ease.'
  },
  {
    icon: 'BarChart',
    title: 'Scientific Functions',
    description: 'Access trigonometric, logarithmic, and exponential functions.'
  },
  {
    icon: 'History',
    title: 'Calculation History',
    description: 'Keep track of your previous calculations for reference.'
  }
];

export default Home;
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = ({ mode }) => {
  // State variables
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Icons
  const HistoryIcon = getIcon('History');
  const XIcon = getIcon('X');
  const CopyIcon = getIcon('Copy');
  const CheckIcon = getIcon('Check');
  const TrashIcon = getIcon('Trash');
  
  // Scientific mode state
  const [angle, setAngle] = useState('deg'); // 'deg' or 'rad'
  
  // Reset calculator state
  const resetCalculator = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };
  
  // Input digit handler
  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };
  
  // Decimal point handler
  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };
  
  // Handle operators
  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(displayValue);
    
    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplayValue(String(result));
      setFirstOperand(result);
      
      // Add to history
      addToHistory(`${firstOperand} ${operator} ${inputValue} = ${result}`);
    }
    
    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  // Calculate result
  const calculate = (firstOperand, secondOperand, operator) => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '×':
        return firstOperand * secondOperand;
      case '÷':
        return firstOperand / secondOperand;
      case '^':
        return Math.pow(firstOperand, secondOperand);
      default:
        return secondOperand;
    }
  };
  
  // Calculate result on equals
  const handleEquals = () => {
    if (!operator || firstOperand === null) return;
    
    const inputValue = parseFloat(displayValue);
    const result = calculate(firstOperand, inputValue, operator);
    setDisplayValue(String(result));
    
    // Add to history
    addToHistory(`${firstOperand} ${operator} ${inputValue} = ${result}`);
    
    // Reset for new calculation
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };
  
  // Add to calculation history
  const addToHistory = (calculation) => {
    setHistory(prev => [calculation, ...prev].slice(0, 10)); // Keep only last 10 calculations
  };
  
  // Clear history
  const clearHistory = () => {
    setHistory([]);
    toast.info('Calculation history cleared');
  };
  
  // Memory functions
  const memoryStore = () => {
    setMemory(parseFloat(displayValue));
    toast.success('Value stored in memory');
  };
  
  const memoryRecall = () => {
    setDisplayValue(String(memory));
    setWaitingForSecondOperand(false);
  };
  
  const memoryClear = () => {
    setMemory(0);
    toast.info('Memory cleared');
  };
  
  const memoryAdd = () => {
    setMemory(memory + parseFloat(displayValue));
    toast.success('Added to memory');
  };
  
  const memorySubtract = () => {
    setMemory(memory - parseFloat(displayValue));
    toast.success('Subtracted from memory');
  };
  
  // Scientific functions
  const calculateSin = () => {
    const value = parseFloat(displayValue);
    const valueInRadians = angle === 'deg' ? (value * Math.PI / 180) : value;
    setDisplayValue(String(Math.sin(valueInRadians)));
    addToHistory(`sin(${value}${angle === 'deg' ? '°' : ' rad'}) = ${Math.sin(valueInRadians)}`);
  };
  
  const calculateCos = () => {
    const value = parseFloat(displayValue);
    const valueInRadians = angle === 'deg' ? (value * Math.PI / 180) : value;
    setDisplayValue(String(Math.cos(valueInRadians)));
    addToHistory(`cos(${value}${angle === 'deg' ? '°' : ' rad'}) = ${Math.cos(valueInRadians)}`);
  };
  
  const calculateTan = () => {
    const value = parseFloat(displayValue);
    const valueInRadians = angle === 'deg' ? (value * Math.PI / 180) : value;
    setDisplayValue(String(Math.tan(valueInRadians)));
    addToHistory(`tan(${value}${angle === 'deg' ? '°' : ' rad'}) = ${Math.tan(valueInRadians)}`);
  };
  
  const calculateLog = () => {
    const value = parseFloat(displayValue);
    setDisplayValue(String(Math.log10(value)));
    addToHistory(`log(${value}) = ${Math.log10(value)}`);
  };
  
  const calculateLn = () => {
    const value = parseFloat(displayValue);
    setDisplayValue(String(Math.log(value)));
    addToHistory(`ln(${value}) = ${Math.log(value)}`);
  };
  
  const calculateSquareRoot = () => {
    const value = parseFloat(displayValue);
    setDisplayValue(String(Math.sqrt(value)));
    addToHistory(`√(${value}) = ${Math.sqrt(value)}`);
  };
  
  const calculatePower = () => {
    handleOperator('^');
  };
  
  const toggleAngleMode = () => {
    setAngle(prev => prev === 'deg' ? 'rad' : 'deg');
    toast.info(`Angle mode: ${angle === 'deg' ? 'Radians' : 'Degrees'}`);
  };
  
  // Copy to clipboard
  const [copySuccess, setCopySuccess] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayValue).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        toast.success('Copied to clipboard!');
      },
      () => {
        toast.error('Failed to copy');
      }
    );
  };
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default behavior for calculator keys
      if (/[0-9+\-*/.=]/.test(e.key)) {
        e.preventDefault();
      }
      
      // Handle digits
      if (/[0-9]/.test(e.key)) {
        inputDigit(e.key);
      }
      
      // Handle operators
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('×');
      if (e.key === '/') handleOperator('÷');
      
      // Handle equals
      if (e.key === 'Enter' || e.key === '=') handleEquals();
      
      // Handle decimal
      if (e.key === '.') inputDecimal();
      
      // Handle backspace
      if (e.key === 'Backspace') {
        if (displayValue !== '0' && displayValue.length > 1) {
          setDisplayValue(displayValue.slice(0, -1));
        } else {
          setDisplayValue('0');
        }
      }
      
      // Handle escape (clear)
      if (e.key === 'Escape') resetCalculator();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [displayValue, firstOperand, operator, waitingForSecondOperand]);
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calculator Display and Keypad */}
      <motion.div 
        className="calculator flex-1 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Calculator Display */}
        <div className="calculator-display bg-surface-100 dark:bg-surface-700 p-4 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-surface-500 dark:text-surface-400">
              {operator && `${firstOperand} ${operator}`}
            </span>
            <div className="flex gap-2">
              <motion.button
                onClick={copyToClipboard}
                className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-600"
                whileTap={{ scale: 0.9 }}
                aria-label="Copy result"
              >
                {copySuccess ? 
                  <CheckIcon className="w-4 h-4 text-green-500" /> : 
                  <CopyIcon className="w-4 h-4 text-surface-500 dark:text-surface-400" />
                }
              </motion.button>
              <motion.button
                onClick={() => setShowHistory(!showHistory)}
                className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-600"
                whileTap={{ scale: 0.9 }}
                aria-label="Show history"
              >
                <HistoryIcon className="w-4 h-4 text-surface-500 dark:text-surface-400" />
              </motion.button>
            </div>
          </div>
          <div className="text-right overflow-x-auto whitespace-nowrap text-3xl md:text-4xl font-semibold pr-1">
            {displayValue}
          </div>
          {mode === 'scientific' && (
            <div className="absolute top-4 left-4">
              <button 
                onClick={toggleAngleMode}
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  angle === 'deg' 
                    ? 'bg-primary/10 text-primary dark:text-primary-light' 
                    : 'bg-secondary/10 text-secondary dark:text-secondary-light'
                }`}
              >
                {angle === 'deg' ? 'DEG' : 'RAD'}
              </button>
            </div>
          )}
        </div>
        
        {/* Memory Buttons */}
        <div className="memory-row grid grid-cols-5 gap-1 p-2 border-b border-surface-200 dark:border-surface-700">
          <button 
            className="text-xs text-center py-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300"
            onClick={memoryClear}
          >
            MC
          </button>
          <button 
            className="text-xs text-center py-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300"
            onClick={memoryRecall}
          >
            MR
          </button>
          <button 
            className="text-xs text-center py-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300"
            onClick={memoryStore}
          >
            MS
          </button>
          <button 
            className="text-xs text-center py-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300"
            onClick={memoryAdd}
          >
            M+
          </button>
          <button 
            className="text-xs text-center py-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300"
            onClick={memorySubtract}
          >
            M-
          </button>
        </div>
        
        {/* Scientific Functions (conditional rendering) */}
        {mode === 'scientific' && (
          <div className="scientific-functions grid grid-cols-4 gap-1 p-2 border-b border-surface-200 dark:border-surface-700">
            <button 
              className="text-sm font-medium text-center py-2 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300"
              onClick={calculateSin}
            >
              sin
            </button>
            <button 
              className="text-sm font-medium text-center py-2 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300"
              onClick={calculateCos}
            >
              cos
            </button>
            <button 
              className="text-sm font-medium text-center py-2 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300"
              onClick={calculateTan}
            >
              tan
            </button>
            <button 
              className="text-sm font-medium text-center py-2 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300"
              onClick={calculatePower}
            >
              x^y
            </button>
            <button 
              className="text-sm font-medium text-center py-2 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300"
              onClick={calculateLog}
            >
              log
            </button>
            <button 
              className="text-sm font-medium text-center py-2 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300"
              onClick={calculateLn}
            >
              ln
            </button>
            <button 
              className="text-sm font-medium text-center py-2 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300"
              onClick={calculateSquareRoot}
            >
              √
            </button>
            <button 
              className="text-sm font-medium text-center py-2 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300"
              onClick={() => {
                const result = Math.PI;
                setDisplayValue(String(result));
              }}
            >
              π
            </button>
          </div>
        )}
        
        {/* Calculator Keypad */}
        <div className="calculator-keypad p-3 grid grid-cols-4 gap-2">
          {/* First Row */}
          <button 
            className="calculator-key bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 h-14"
            onClick={resetCalculator}
          >
            C
          </button>
          <button 
            className="calculator-key bg-surface-100 dark:bg-surface-700 h-14"
            onClick={() => {
              if (displayValue !== '0' && displayValue.length > 1) {
                setDisplayValue(displayValue.slice(0, -1));
              } else {
                setDisplayValue('0');
              }
            }}
          >
            ⌫
          </button>
          <button 
            className="calculator-key bg-surface-100 dark:bg-surface-700 h-14"
            onClick={() => {
              setDisplayValue(String(parseFloat(displayValue) * -1));
            }}
          >
            ±
          </button>
          <button 
            className="calculator-key bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light h-14"
            onClick={() => handleOperator('÷')}
          >
            ÷
          </button>
          
          {/* Second Row */}
          <button 
            className="calculator-key bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-14"
            onClick={() => inputDigit('7')}
          >
            7
          </button>
          <button 
            className="calculator-key bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-14"
            onClick={() => inputDigit('8')}
          >
            8
          </button>
          <button 
            className="calculator-key bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-14"
            onClick={() => inputDigit('9')}
          >
            9
          </button>
          <button 
            className="calculator-key bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light h-14"
            onClick={() => handleOperator('×')}
          >
            ×
          </button>
          
          {/* Third Row */}
          <button 
            className="calculator-key bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-14"
            onClick={() => inputDigit('4')}
          >
            4
          </button>
          <button 
            className="calculator-key bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-14"
            onClick={() => inputDigit('5')}
          >
            5
          </button>
          <button 
            className="calculator-key bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-14"
            onClick={() => inputDigit('6')}
          >
            6
          </button>
          <button 
            className="calculator-key bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light h-14"
            onClick={() => handleOperator('-')}
          >
            -
          </button>
          
          {/* Fourth Row */}
          <button 
            className="calculator-key bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-14"
            onClick={() => inputDigit('1')}
          >
            1
          </button>
          <button 
            className="calculator-key bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-14"
            onClick={() => inputDigit('2')}
          >
            2
          </button>
          <button 
            className="calculator-key bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-14"
            onClick={() => inputDigit('3')}
          >
            3
          </button>
          <button 
            className="calculator-key bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light h-14"
            onClick={() => handleOperator('+')}
          >
            +
          </button>
          
          {/* Fifth Row */}
          <button 
            className="calculator-key bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-14 col-span-2"
            onClick={() => inputDigit('0')}
          >
            0
          </button>
          <button 
            className="calculator-key bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-14"
            onClick={inputDecimal}
          >
            .
          </button>
          <button 
            className="calculator-key bg-primary text-white h-14"
            onClick={handleEquals}
          >
            =
          </button>
        </div>
      </motion.div>
      
      {/* History Panel (Conditionally rendered) */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            className="history-panel md:w-80 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="history-header flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="font-semibold">History</h3>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={clearHistory}
                  className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  disabled={history.length === 0}
                  aria-label="Clear history"
                >
                  <TrashIcon className={`w-4 h-4 ${history.length === 0 ? 'text-surface-300 dark:text-surface-600' : 'text-surface-500 dark:text-surface-400'}`} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowHistory(false)}
                  className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  aria-label="Close history"
                >
                  <XIcon className="w-4 h-4 text-surface-500 dark:text-surface-400" />
                </motion.button>
              </div>
            </div>
            
            <div className="history-content p-2 max-h-[400px] overflow-y-auto">
              {history.length === 0 ? (
                <div className="text-center py-6 text-surface-500 dark:text-surface-400">
                  <p>No calculations yet</p>
                </div>
              ) : (
                <ul>
                  {history.map((item, index) => (
                    <motion.li 
                      key={index}
                      className="py-2 px-3 text-sm border-b border-surface-100 dark:border-surface-700 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer transition-colors"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        // Parse result from history item
                        const result = item.split('=')[1].trim();
                        setDisplayValue(result);
                      }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QrCode, Upload, Search } from 'lucide-react';

import QRScanner from '../components/QRScanner';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const handleScanSuccess = (decodedText: string) => {
    // Expected format: https://yourdomain.com/upload/FOLDER_ID
    if (decodedText.includes('/upload/')) {
      const parts = decodedText.split('/upload/');
      const folderId = parts[1];
      if (folderId) {
        navigate(`/upload/${folderId}`);
      }
    } else if (decodedText.includes('/upload')) {
      navigate('/upload');
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold mb-6"
      >
        તમારા લગ્નના ફોટા શોધો <span className="text-primary">AI ફેસ મેચિંગ</span> સાથે
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl text-gray-600 mb-12"
      >
        ફક્ત એક સેલ્ફી અપલોડ કરો અને હજારો ફોટામાંથી તમારા ફોટા આપોઆપ શોધો.
      </motion.p>
      
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div 
          onClick={() => setShowScanner(!showScanner)}
          className={`card flex flex-col items-center text-center cursor-pointer transition-all ${showScanner ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/30'}`}
        >
          <div className="w-16 h-16 bg-pink-100 text-primary rounded-full flex items-center justify-center mb-4">
            <QrCode size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">QR સ્કેન કરો</h3>
          <p className="text-gray-500 text-sm">લગ્ન સ્થળ પર આપેલા QR કોડને સ્કેન કરો.</p>
        </div>
        
        <Link to="/upload" className="card flex flex-col items-center text-center hover:border-primary/30 transition-all">
          <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Upload size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">સેલ્ફી અપલોડ કરો</h3>
          <p className="text-gray-500 text-sm">તમારો સ્પષ્ટ સેલ્ફી ફોટો અપલોડ કરો.</p>
        </Link>
        
        <div className="card flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-pink-100 text-primary rounded-full flex items-center justify-center mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">પરિણામ મેળવો</h3>
          <p className="text-gray-500 text-sm">AI તમારા ફોટા શોધીને તમારી પર્સનલ ગેલેરી બતાવશે.</p>
        </div>
      </div>

      {showScanner && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">QR સ્કેનર</h2>
          <QRScanner onScanSuccess={handleScanSuccess} />
          <button 
            onClick={() => setShowScanner(false)}
            className="mt-4 text-gray-500 underline"
          >
            બંધ કરો
          </button>
        </motion.div>
      )}
      
      {!showScanner && (
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/upload" className="btn-primary text-lg inline-flex items-center gap-2">
            શરૂ કરો <Upload size={20} />
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, ArrowLeft, Heart, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAuthorizedImageUrl } from '../services/faceApi';

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const storedMatches = sessionStorage.getItem('matched_photos');
    if (storedMatches) {
      const rawPhotos = JSON.parse(storedMatches);
      // ✅ Use a fresh conversion to ensure URLs are correct
      const authorizedPhotos = rawPhotos.map((url: string) => {
        // Ensure we are using the thumbnail URL for display
        return getAuthorizedImageUrl(url);
      });
      setPhotos(authorizedPhotos);
    }
  }, []);

  if (photos.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchX size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">કોઈ ફોટા મળ્યા નથી</h2>
        <p className="text-gray-500 mb-8">અફસોસ, આ ડ્રાઈવમાં તમારા કોઈ ફોટા મળ્યા નથી.</p>
        <Link to="/upload" className="btn-primary">ફરી પ્રયાસ કરો</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="text-gray-500 hover:text-primary flex items-center gap-1 transition-colors">
          <ArrowLeft size={20} /> હોમ
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-bold">તમારી ગેલેરી</h1>
          <p className="text-gray-500 text-sm">
            AI એ તમને {photos.length} ફોટામાં ઓળખ્યા છે!
          </p>
        </div>
        <div className="w-20"></div> {/* Spacer */}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {photos.map((url, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
          >
            <img 
              src={url} 
              alt={`Wedding photo ${index}`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <a 
                href={url} 
                download 
                target="_blank" 
                rel="noreferrer"
                className="bg-white p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
              >
                <Download size={24} />
              </a>
              <button className="bg-white p-3 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                <Share2 size={24} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 bg-primary/5 rounded-3xl p-8 text-center border border-primary/10">
        <h2 className="text-2xl font-bold mb-4">બધા ફોટા એકસાથે ડાઉનલોડ કરવા છે?</h2>
        <button className="btn-primary flex items-center gap-2 mx-auto">
          ઝિપ ફાઇલ ડાઉનલોડ કરો <Download size={20} />
        </button>
      </div>
    </div>
  );
};

export default Gallery;

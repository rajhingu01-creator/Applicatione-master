import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Camera, ArrowRight, X } from 'lucide-react';

import { loadModels, getDescriptorFromGuestSelfie, findMatch } from '../services/faceApi';
import { getDriveImageLinks } from '../services/driveService';

const GuestUpload: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      let filesProcessed = 0;

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          filesProcessed++;
          if (filesProcessed === files.length) {
            setImages(prev => [...prev, ...newImages].slice(0, 3)); // Limit to 3 selfies
            setError(null);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSearch = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      await loadModels();
      
      const guestDescriptors: Float32Array[] = [];

      for (const imgData of images) {
        const img = new Image();
        img.src = imgData;
        await new Promise((resolve) => (img.onload = resolve));
        
        const descriptors = await getDescriptorFromGuestSelfie(img);
        if (descriptors && descriptors.length > 0) {
          guestDescriptors.push(...descriptors);
        }
      }
      
      if (guestDescriptors.length === 0) {
        setError("કોઈપણ ફોટામાં ચહેરો ઓળખાયો નથી. મહેરબાની કરીને બીજા ફોટા ટ્રાય કરો.");
        setIsProcessing(false);
        return;
      }

      let driveData = [];
      let peopleData = [];

      // Get indexed data from localStorage
      const storedData = localStorage.getItem('wedding_drive_index');
      const storedPeople = localStorage.getItem('wedding_people_index');
      
      if (storedData) {
        const parsed = JSON.parse(storedData);
        driveData = parsed.map((item: any) => ({
          url: item.url,
          descriptors: item.descriptors.map((d: any) => new Float32Array(d))
        }));
      }

      if (storedPeople) {
        peopleData = JSON.parse(storedPeople);
      }

      if (driveData.length === 0) {
        setError("હજી સુધી કોઈ ફોટા ઇન્ડેક્સ થયા નથી. એડમિનનો સંપર્ક કરો.");
        setIsProcessing(false);
        return;
      }

      // Use the professional findMatch engine
      // If we have peopleData, we match against clusters for "Google Photos" experience
      let matchedUrls: string[] = [];
      
      if (peopleData.length > 0) {
        console.log('👥 Matching against people clusters...');
        const allMatchedUrls = new Set<string>();
        
        // Convert people clusters to format findMatch expects
        const clusterData = peopleData.map((p: any) => ({
          url: p.id, // Use ID to identify which cluster matched
          descriptors: p.descriptors.map((d: any) => new Float32Array(d))
        }));

        const matchedClusterIds = findMatch(guestDescriptors, clusterData);
        
        // Collect all URLs from matched clusters
        matchedClusterIds.forEach(id => {
          const person = peopleData.find((p: any) => p.id === id);
          if (person) {
            person.urls.forEach((u: string) => allMatchedUrls.add(u));
          }
        });
        
        matchedUrls = Array.from(allMatchedUrls);
      } else {
        // Fallback to raw image matching
        matchedUrls = findMatch(guestDescriptors, driveData);
      }

      if (matchedUrls.length === 0) {
        setError("અફસોસ, આ ડ્રાઈવમાં તમારા કોઈ ફોટા મળ્યા નથી.");
        setIsProcessing(false);
        return;
      }

      // Save matches and navigate
      sessionStorage.setItem('matched_photos', JSON.stringify(matchedUrls));
      navigate('/gallery');

    } catch (err) {
      console.error(err);
      setError("મેચિંગ દરમિયાન કોઈ ભૂલ આવી. ફરી પ્રયાસ કરો.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">તમારી સેલ્ફી લો</h1>
        <p className="text-gray-500 mb-8">વધારે એક્યુરેસી માટે તમે 2-3 અલગ અલગ ફોટા અપલોડ કરી શકો છો.</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/20">
              <img src={img} alt={`Selfie ${idx}`} className="w-full h-full object-cover" />
              <button 
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white transition-all shadow-md"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          
          {images.length < 3 && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer flex flex-col items-center justify-center gap-2 aspect-square rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <Camera className="text-primary" size={32} />
              <span className="text-xs font-bold text-primary">બીજો ફોટો ઉમેરો</span>
            </div>
          )}
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          multiple
          className="hidden" 
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={images.length === 0 || isProcessing}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all shadow-xl ${
            images.length === 0 || isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-accent'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              શોધાઈ રહ્યું છે...
            </>
          ) : (
            <>
              મારા ફોટા શોધો <ArrowRight size={20} />
            </>
          )}
        </button>

        <p className="mt-6 text-xs text-gray-400 italic">
          * અમે તમારો ફોટો ક્યાંય સેવ નથી કરતા, તે ફક્ત ફેસ મેચિંગ માટે વપરાય છે.
        </p>
      </motion.div>
    </div>
  );
};

export default GuestUpload;

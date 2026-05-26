import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Database, Link as LinkIcon, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

import QRGenerator from '../components/QRGenerator';

import { getDriveImageLinks } from '../services/driveService';
import { loadModels, getDescriptorsFromImageUrlsBatched, clusterFaces } from '../services/faceApi';

const Admin: React.FC = () => {
  const [driveLink, setDriveLink] = useState('');
  const [folderId, setFolderId] = useState('');
  const [isIndexing, setIsIndexing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [qrValue, setQrValue] = useState(window.location.origin + '/upload');
  const indexingRef = useRef(false);

  useEffect(() => {
    if (folderId) {
      setQrValue(`${window.location.origin}/upload/${folderId}`);
    } else {
      setQrValue(`${window.location.origin}/upload`);
    }
  }, [folderId]);

  const handleIndex = async () => {
    if (!driveLink || indexingRef.current) return;

    indexingRef.current = true;
    setIsIndexing(true);
    setProgress(0);
    setProgressText('');
    setStatusType('info');
    setStatus('Models લોડ થઈ રહ્યા છે...');

    try {
      await loadModels();

      setStatus('Google Drive માંથી ઈમેજ લિસ્ટ મેળવી રહ્યા છીએ...');
      const images = await getDriveImageLinks(driveLink);

      if (!images || images.length === 0) {
        setStatus('ડ્રાઈવમાં કોઈ ફોટા મળ્યા નથી.');
        setStatusType('error');
        return;
      }

      setStatus(`${images.length} ફોટા મળ્યા. ચહેરા ઓળખી રહ્યા છીએ...`);
      setProgress(5);

      // ✅ Batched processing with progress callback
      const driveData = await getDescriptorsFromImageUrlsBatched(
        images,
        (done, total) => {
          const pct = Math.round((done / total) * 80) + 5; // 5% to 85%
          setProgress(pct);
          setProgressText(`${done} / ${total} ફોટા પ્રોસેસ થઈ ગયા`);
          setStatus(`ચહેરા ઓળખી રહ્યા છીએ... (${done}/${total})`);
        }
      );

      setStatus('લોકોને ગ્રુપ કરી રહ્યા છીએ (Google Photos Style)...');
      setProgress(90);
      
      const people = clusterFaces(driveData);

      // Save raw index
      const serializedIndex = driveData.map(item => ({
        url: item.url,
        descriptors: item.descriptors.map(d => Array.from(d)),
      }));
      localStorage.setItem('wedding_drive_index', JSON.stringify(serializedIndex));

      // Save people clusters
      localStorage.setItem('wedding_people_index', JSON.stringify(people));

      const withFaces = driveData.filter(d => d.descriptors.length > 0).length;
      setProgress(100);
      setProgressText('');
      setStatusType('success');
      setStatus(
        `✅ સફળ! ${images.length} ફોટા પ્રોસેસ થયા. ${withFaces} ફોટામાં ચહેરા મળ્યા અને ${people.length} અલગ-અલગ લોકો ઓળખાયા.`
      );
    } catch (err) {
      console.error(err);
      setStatusType('error');
      setStatus('ભૂલ આવી: ઇન્ડેક્સિંગ નિષ્ફળ ગયું. ફરી પ્રયાસ કરો.');
    } finally {
      setIsIndexing(false);
      indexingRef.current = false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Database className="text-primary" /> Admin પેનલ
      </h1>

      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Wedding ફોટા ઇન્ડેક્સ કરો</h2>
        <p className="text-gray-500 mb-6 text-sm">
          તમારા Google Drive ફોલ્ડરની પબ્લિક લિંક અહીં પેસ્ટ કરો. AI દરેક ફોટામાંથી
          ચહેરા ઓળખીને ઇન્ડેક્સ કરશે.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Drive લિંક
            </label>
            <div className="relative">
              <input
                type="text"
                value={driveLink}
                onChange={e => setDriveLink(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <LinkIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Drive Folder ID (QR માટે)
            </label>
            <div className="relative">
              <input
                type="text"
                value={folderId}
                onChange={e => setFolderId(e.target.value)}
                placeholder="Folder ID (e.g. 1A2B3C...)"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <LinkIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          <button
            onClick={handleIndex}
            disabled={isIndexing || !driveLink}
            className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
              isIndexing || !driveLink
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary hover:bg-accent shadow-lg'
            }`}
          >
            {isIndexing ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              <Database size={20} />
            )}
            {isIndexing ? 'ઇન્ડેક્સિંગ થઈ રહ્યું છે...' : 'ઇન્ડેક્સિંગ શરૂ કરો'}
          </button>
        </div>

        {/* ✅ Progress Bar */}
        {isIndexing && progress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{progressText}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                className="bg-primary h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        {/* ✅ Status Message */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
              statusType === 'success'
                ? 'bg-green-50 text-green-700'
                : statusType === 'error'
                ? 'bg-red-50 text-red-700'
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            {statusType === 'success' ? (
              <CheckCircle className="mt-0.5 shrink-0" size={18} />
            ) : statusType === 'error' ? (
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
            ) : (
              <RefreshCw className="animate-spin mt-0.5 shrink-0" size={18} />
            )}
            <p className="text-sm font-medium">{status}</p>
          </motion.div>
        )}
      </div>

      {/* QR Code Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">QR કોડ જનરેટ કરો</h2>
        <p className="text-gray-500 mb-6 text-sm">
          મહેમાનો માટે આ QR કોડ ડાઉનલોડ કરો અને વેન્યુ પર લગાવો.
        </p>
        <div className="flex justify-center mb-6">
          <QRGenerator value={qrValue} />
        </div>
        <button className="w-full py-2 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-all">
          ડાઉનલોડ QR
        </button>
      </div>
    </div>
  );
};

export default Admin;
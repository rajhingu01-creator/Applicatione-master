import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <Camera size={28} />
            <span>WeddingRecall</span>
          </Link>
          <nav className="flex gap-6">
            <Link to="/admin" className="text-gray-600 hover:text-primary font-medium">Admin</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 WeddingRecall - AI Face Match Gallery</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

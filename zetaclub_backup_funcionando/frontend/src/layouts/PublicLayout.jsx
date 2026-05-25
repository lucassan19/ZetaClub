import React from 'react';
import PublicNavbar from '../components/PublicNavbar';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <PublicNavbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PlaybookProvider } from './context/PlaybookContext';
import { AppRoutes } from './routes/AppRoutes';
import { useDB } from './hooks/useDB';

export default function App() {
  const { isInitialized, error } = useDB();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600">Database Error</h1>
          <p className="mt-2 text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <PlaybookProvider>
        <AppRoutes />
      </PlaybookProvider>
    </BrowserRouter>
  );
}
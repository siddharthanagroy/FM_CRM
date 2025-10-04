import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import Portfolio from './pages/Portfolio';
// Import other components as needed

function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <div className="min-h-screen bg-gray-50">
          <Portfolio />
        </div>
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;
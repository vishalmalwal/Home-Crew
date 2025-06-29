import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Router from './components/Router';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="App">
          <Router />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';  // ✅ Correct
import App from './App';
import store from './store/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>       {/* Fournit le store Redux */}
      <BrowserRouter>              {/* Fournit la navigation React Router */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

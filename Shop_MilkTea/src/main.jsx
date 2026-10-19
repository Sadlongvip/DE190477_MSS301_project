import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider';
import { CartProvider } from './context/CartProvider';
import { InventoryProvider } from './context/InventoryProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <InventoryProvider>
          <App />
        </InventoryProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);


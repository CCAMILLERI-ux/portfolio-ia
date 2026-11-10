import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import './index.css';
import App from './App';
import { FleetProvider } from './state/FleetContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FleetProvider>
      <App />
    </FleetProvider>
  </StrictMode>,
);

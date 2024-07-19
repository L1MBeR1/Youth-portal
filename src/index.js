import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import queryClient from './queryClient';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools />
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();

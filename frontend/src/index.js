import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './queryClient';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	// <React.StrictMode>
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>
	// </React.StrictMode>
);

reportWebVitals();

import React from 'react';
import APITestPage from './APITestPage';
import PublicationPage from './PublicationPage';

function App() {
    return (
        <>
            <div>
                <APITestPage />
            </div>
            <div style={{ border: '1px solid red' }}>
                <PublicationPage />
            </div>
        </>
    );
}

export default App;

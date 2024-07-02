import React, { useState } from 'react';
import axios from 'axios';

const APITestPage = () => {
    const [url, setUrl] = useState('http://127.0.0.1:8000/api/auth/login');
    const [method, setMethod] = useState('GET');
    const [body, setBody] = useState(
`{
"email":"hello@example.com",
"password":"1111"        
}`);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSendRequest = async () => {
        setLoading(true);
        setError(null);
        try {
            let options = {
                method: method,
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: method !== 'GET' ? JSON.parse(body) : null,
            };

            const response = await axios(options);
            setResponse(response.data);
        } catch (error) {
            if (error instanceof SyntaxError) {
                setError('Invalid JSON format in the request body.');
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>API Tester</h2>
            <div>
                <label htmlFor="urlInput">URL:</label>
                <input
                    id="urlInput"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{ width: '80%', marginBottom: '10px' }}
                />
                <br />
                <label htmlFor="methodSelect">Method:</label>
                <select
                    id="methodSelect"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    style={{ marginBottom: '10px' }}
                >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
                <br />
                {method !== 'GET' && (
                    <div>
                        <label htmlFor="bodyInput">Body:</label>
                        <textarea
                            id="bodyInput"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={4}
                            style={{ width: '80%', marginBottom: '10px' }}
                        />
                    </div>
                )}
                <button onClick={handleSendRequest} disabled={loading}>
                    {loading ? 'Loading...' : 'Send Request'}
                </button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <h3>Response:</h3>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {response && (
                    <pre style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(response, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default APITestPage;

import React, { useState } from 'react';
import axios from 'axios';

const APITestPage = () => {
    const [url, setUrl] = useState('http://127.0.0.1:8000/api/auth/login');
    const [method, setMethod] = useState('GET');
    const [body, setBody] = useState(
        `{
    "email":"admin@example.org",
    "password":"password"        
}`);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectDeadline, setProjectDeadline] = useState('');
    const [projectBudget, setProjectBudget] = useState('');

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

    const handleVKLogin = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/proxy/vk', {
                params: {
                    scope: 'email',
                    response_type: 'code',
                    state: 'some_state', // опционально
                }
            });
            window.location.href = response.data.redirect; // Перенаправляем пользователя на VK
        } catch (error) {
            console.error('Error during VK login:', error);
            setError('Failed to initiate VK login.');
        }
    };

    const handleCreateProject = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/news/create', {
                name: projectName,
                description: projectDescription,
                deadline: projectDeadline,
                budget: projectBudget
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setResponse(response.data);
        } catch (error) {
            setError(error.message);
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
                <br />
                <button onClick={handleVKLogin} style={{ display: 'block', padding: '10px', background: 'blue', color: 'white', marginTop: '10px' }}>
                    Login with VKontakte
                </button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Create Project</h3>
                <label htmlFor="projectName">Project Name:</label>
                <input
                    id="projectName"
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    style={{ width: '80%', marginBottom: '10px' }}
                />
                <br />
                <label htmlFor="projectDescription">Project Description:</label>
                <input
                    id="projectDescription"
                    type="text"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    style={{ width: '80%', marginBottom: '10px' }}
                />
                <br />
                <label htmlFor="projectDeadline">Project Deadline:</label>
                <input
                    id="projectDeadline"
                    type="text"
                    value={projectDeadline}
                    onChange={(e) => setProjectDeadline(e.target.value)}
                    style={{ width: '80%', marginBottom: '10px' }}
                />
                <br />
                <label htmlFor="projectBudget">Project Budget:</label>
                <input
                    id="projectBudget"
                    type="text"
                    value={projectBudget}
                    onChange={(e) => setProjectBudget(e.target.value)}
                    style={{ width: '80%', marginBottom: '10px' }}
                />
                <br />
                <button onClick={handleCreateProject} disabled={loading}>
                    {loading ? 'Loading...' : 'Create Project'}
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
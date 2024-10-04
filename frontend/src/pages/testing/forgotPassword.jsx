import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    // Эта страница принимает токен из URL-адреса.
    // http://localhost:3000/reset-password?token=eyJ0e......

    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/api/auth/password/reset', {
                token,
                password,
                password_confirmation: confirmPassword,
            });

            setMessage('Password has been reset successfully');
        } catch (error) {
            setMessage('An error occurred while resetting password');
        }
    };

    return (
        <div>
            <h1>token: {token}</h1>
            <h2>Reset Password</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPassword;

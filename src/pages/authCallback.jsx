import { useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { vkAuth } from '../api/authApi';
import { setToken } from '../utils/authUtils/tokenStorage';

export default function AuthCallback() {
	const queryClient = useQueryClient();
	const location = useLocation();
	const navigate = useNavigate();
	const codeVerifierRef = useRef(null);

	const handleAuth = async (code, deviceId, storedCodeVerifier) => {
		navigate(`/login?redirect=true`);
		try {
			const data = await vkAuth({
				code,
				device_id: deviceId,
				code_verifier: storedCodeVerifier,
			});
			if (data) {
				const token = data.access_token;
				if (token) {
					await setToken(token);
					const decoded = jwtDecode(token);
					await new Promise(resolve => setTimeout(resolve, 2000));
					await queryClient.refetchQueries(['profile']);
					if (decoded.roles.includes('admin')) {
						navigate('/admin');
					} else if (decoded.roles.includes('moderator')) {
						navigate('/moderator');
					} else if (decoded.roles.includes('su')) {
						navigate('/su');
					} else {
						navigate('/');
					}
				}
			} else {
				navigate(`/login?error=service_error`);
			}
		} catch (error) {
			console.error('Authentication error', error);
			navigate(`/login?error=service_error`);
		} finally {
			sessionStorage.removeItem('auth');
			sessionStorage.removeItem('state');
			sessionStorage.removeItem('code_verifier');
		}
	};

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const code = params.get('code');
		const state = params.get('state');
		const deviceId = params.get('device_id');
		const error = params.get('error');

		const storedState = sessionStorage.getItem('state');
		const storedCodeVerifier = sessionStorage.getItem('code_verifier');

		if (error && storedState === state) {
			navigate(`/login?error=${error}`);
			return;
		}

		if (!code || !state || !deviceId) {
			navigate('/404');
			return;
		}
		console.log(state, storedState);
		if (state !== storedState) {
			console.error('State mismatch, possible CSRF attack!');
			navigate('login?error=state_error');
			return;
		}

		if (typeof code === 'string') {
			codeVerifierRef.current = storedCodeVerifier;
			sessionStorage.setItem('auth', true);
			handleAuth(code, deviceId, storedCodeVerifier, state);
		}
	}, [location, navigate]);

	return <></>;
}

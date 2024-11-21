import axios from 'axios';

const API_URL = 'http://localhost:8000';  // Replace with your backend API URL

// Function to login a user and get tokens
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        });

        if (response.status === 200) {
            // Store the tokens in localStorage or state management (e.g., Redux)
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            return response.data;
        }
    } catch (error) {
        console.error("Login failed:", error.response?.data?.detail || error.message);
        throw error;
    }
};

// Function to refresh the access token using refresh token
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error("No refresh token available.");
    }

    try {
        const response = await axios.post(`${API_URL}/refresh_token`, {}, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`,
            },
        });

        if (response.status === 200) {
            // Store the new access token
            localStorage.setItem('access_token', response.data.access_token);
            return response.data;
        }
    } catch (error) {
        console.error("Token refresh failed:", error.response?.data?.detail || error.message);
        throw error;
    }
};

// Function to logout user
export const logoutUser = () => {
    // Clear the tokens from localStorage or state
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};


import React, { useState } from 'react';
import { loginUser } from './api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const data = await loginUser(email, password);
            // Redirect to dashboard or protected route after successful login
            console.log("Login successful:", data);
        } catch (error) {
            setErrorMessage('Login failed. Please check your credentials.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default LoginPage;


import React, { useEffect, useState } from 'react';
import { refreshAccessToken } from './api';
import axios from 'axios';

const ProtectedPage = () => {
    const [data, setData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get('http://localhost:8000/protected', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setData(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                // Token expired, try refreshing it
                try {
                    const newToken = await refreshAccessToken();
                    fetchData();  // Retry fetching data with new access token
                } catch (refreshError) {
                    setErrorMessage('Session expired. Please log in again.');
                }
            } else {
                setErrorMessage(error.response?.data?.detail || error.message);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h2>Protected Page</h2>
            {errorMessage && <p>{errorMessage}</p>}
            {data ? <p>{data}</p> : <p>Loading...</p>}
        </div>
    );
};

export default ProtectedPage;


import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage';
import ProtectedPage from './ProtectedPage';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={LoginPage} />
                <Route path="/protected" component={ProtectedPage} />
                <Route path="/" exact>
                    <h2>Welcome to the app. Please log in.</h2>
                </Route>
            </Switch>
        </Router>
    );
};

export default App;

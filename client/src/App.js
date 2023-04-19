import './App.css';
import React, { useEffect, useState } from 'react';
import { createRoot } from "react-dom/client";
import {
    Route,
    Router,
} from "react-router-dom";
import jwtDecode from 'jwt-decode';

function PrivateRoute({ children, ...rest }) {
    const token = localStorage.getItem('token');

    return (
        <Route
            {...rest}
            render={({ location }) =>
                token ? (
                    children
                ) : (
                    <Route
                        to={{
                            pathname: '/login',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
}

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { email, password };

        // Send login request to server
        const response = await fetch('https://immense-citadel-53026.herokuapp.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        const data = await response.json();

        if (response.ok) {
            // Decode token
            const token = data.accessToken;
            const decodedToken = jwtDecode(token);
            localStorage.setItem('token', token);
            window.location = '/tasks';
        } else {
            // Handle login error
            console.error('Login failed:', data.error);
            // ... you can show an error message or handle the error in any other way
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

function App() {

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch('https://immense-citadel-53026.herokuapp.com//tasks', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(data => setTasks(data));
    }, []);

    return (
        <Router location='null' navigator='null' >
            <Route path="/login">
                <Login />
            </Route>
            <PrivateRoute path="/tasks">
                <div>
                    <h1>Tasks</h1>
                    <ul>
                        {tasks.map(task => (
                            <li key={task.id}>{task.title}</li>
                        ))}
                    </ul>
                </div>
            </PrivateRoute>
        </Router>
    );
}

export default App;

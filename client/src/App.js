import './App.css';
import React, { useEffect, useState } from 'react';
import {
    Route, Routes, Navigate, Link
} from "react-router-dom";

// create a private route component
// https://reactrouter.com/web/example/auth-workflow
const ProtectedRoute = ({ user, children }) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { email, password };

        // Send login request to server
        const response = await fetch('http://localhost:8080/login', {
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
        fetch('http://localhost:8080/tasks', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(data => setTasks(data));
    }, []);

    return (
        <>
        <nav>
            <Link to="/login">Login</Link>
            <Link to="/tasks">Tasks</Link>
        </nav>

        <Routes>
            <Route
                path="login"
                element={<Login />}
            />
            <Route
                path="tasks"
                element={
                    <ProtectedRoute user={tasks}>
                        <h1>Tasks</h1>
                        <ul>
                            {tasks.map(task => (
                                <li key={task.id}>{task.title}</li>
                            ))}
                        </ul>
                    </ProtectedRoute>
                }
            />
        </Routes>
        </>
    );
}

export default App;

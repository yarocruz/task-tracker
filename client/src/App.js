import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
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
                    <Redirect
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
        <Router>
            <Switch>
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
            </Switch>
        </Router>
    );
}

export default App;

import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {

    const [data, setData] = useState(null);

    // This is just a quick test to see if the server is running
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            fetch('http://localhost:8080/tasks')
                .then(res => res.json())
                .then(data => setData(data));
        }
    }, []);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
        <div>
            {data ? data.map(task => <div key={task.id}>{task.title}</div>) : null}
        </div>
    </div>
  );
}

export default App;

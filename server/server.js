require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 8080;
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const data = {
    tasks: [
        {
            id: 1,
            title: "Task 1",
            description: "This is task 1",
            completed: false,
        },
        {
            id: 2,
            title: "Task 2",
            description: "This is task 2",
        },
    ]
}

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//GET all user tasks
app.get('/tasks', (req, res) => {
    //TODO: get all tasks from the database
    res.json(data.tasks);
});

//POST a new user task
app.post('/tasks', (req, res) => {
    //TODO: add a new task to the database
});

// UPDATE an existing task by ID
app.put('/tasks/:id', (req, res) => {
    // TODO: update an existing task in the database
});

//DELETE a task by ID
app.delete('/tasks/:id', (req, res) => {
    // Todo: delete a task from the database
});

app.listen(PORT, () => console.log(`Server now listening at http://localhost:${PORT}`));
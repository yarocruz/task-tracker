require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 8080;
const morgan = require("morgan");
const cors = require("cors");
const sequelize = require("./config/connection");
const { User, Task } = require("./models");

const app = express();

// dummy data to quickly test the server and send to client
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
// app.use(cors(
//     {
//         origin:'*',
//         credentials:true,            //access-control-allow-credentials:true
//         optionSuccessStatus:200,
//     }
// )); // allow all origins

// Middleware to set CORS headers
app.use((req, res, next) => {
    // Replace 'https://neon-marzipan-917d6a.netlify.app' with the domain of your client application
    res.setHeader('Access-Control-Allow-Origin', 'https://neon-marzipan-917d6a.netlify.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Accept, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

// login
app.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
        }

        const validPassword = await bcrypt.compare(req.body.password, userData.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
        }

        const userEmail = { name: userData.email };
        const accessToken = jwt.sign(userEmail, process.env.ACCESS_TOKEN_SECRET);
        return res.json({ accessToken: accessToken });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

// register
app.post('/register', async (req, res) => {
    try {
        const newUser = req.body;
        // hash the password from 'req.body' and save to newUser
        newUser.password = await bcrypt.hash(req.body.password, 10);
        // create the newUser with the hashed password and save to DB
        const userData = await User.create(newUser);

        res.status(200).json(userData);

        // const user = { name: userData.name };
        // const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        // res.json({ accessToken: accessToken });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

//GET all user tasks
app.get('/tasks', authenticateToken, (req, res) => {
    //TODO: get all tasks from the database
    res.json(data.tasks);
});

//POST a new user task
app.post('/tasks', authenticateToken, (req, res) => {
    //TODO: add a new task to the database
});

// UPDATE an existing task by ID
app.put('/tasks/:id', authenticateToken, (req, res) => {
    // TODO: update an existing task in the database
});

//DELETE a task by ID
app.delete('/tasks/:id', authenticateToken, (req, res) => {
    // Todo: delete a task from the database
});

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connect from "./database";
import UserRouter from "./routes/user.router";

import User from "../models/user";

const app = express();
connect().then(r => console.log('Success'));

// Middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors());

app.get('/',async function (req, res) {
    res.json(await User.findAll());
});

// Routes
app.use('/user', UserRouter);

export default app;

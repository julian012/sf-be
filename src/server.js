import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connect from "./database";
import UserRouter from "./routes/user.router";
import OuvreRouter from "./routes/ouvre.router";
import TaskRouter from "./routes/task.router";
import AssignWorker from "./routes/assignworker.router";

const app = express();
connect().then(r => console.log('Success'));

// Middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors());

app.get('/',async function (req, res) {
    res.json('Hola');
});

// Routes
app.use('/user', UserRouter);
app.use('/ouvre', OuvreRouter);
app.use('/task', TaskRouter);
app.use('/assignworker', AssignWorker);

export default app;

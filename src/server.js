import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connect from "./database";
import UserRouter from "./routes/user.router";
import OuvreRouter from "./routes/ouvre.router";
import TaskRouter from "./routes/task.router";
import AssignWorkerRouter from "./routes/assignworker.router";
import TypeMateialRouter from "./routes/typematerial.router";
import MaterialRouter from "./routes/material.router";
import AssignMaterialRouter from "./routes/assignmaterial.router";

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
app.use('/assignworker', AssignWorkerRouter);
app.use('/typematerial', TypeMateialRouter);
app.use('/material', MaterialRouter);
app.use('/assignMaterial', AssignMaterialRouter);

export default app;

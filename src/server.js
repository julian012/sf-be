import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connect from "./database";
import UserRouter from "./routes/user.router";
import OuvreRouter from "./routes/ouvre.router";
import TaskRouter from "./routes/task.router";
import AssignWorkerRouter from "./routes/assignworker.router";
import TypeMateialRouter from "./routes/typematerial.router";
import TypeMachineRouter from "./routes/typemachine.router";
import MaterialRouter from "./routes/material.router";
import MachineRouter from "./routes/machine.router";
import AssignMaterialRouter from "./routes/assignmaterial.router";
import AssignMachineRouter from "./routes/assignmachine.router";
import Schedule from "./routes/schedule.router"

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
app.use('/typemachine', TypeMachineRouter);
app.use('/material', MaterialRouter);
app.use('/machine', MachineRouter);
app.use('/assignMaterial', AssignMaterialRouter);
app.use('/assignMachine', AssignMachineRouter);
app.use('/schedule', Schedule)

export default app;

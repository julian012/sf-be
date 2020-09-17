import {Router} from 'express';
import Task from "../../models/task";
import {verifyToken, verifyForm} from '../utils/utils';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.status(200).json({tasks: tasks})
    } catch (e) {
        res.status(422).json({
            message: 'error'
        })
    }
})

router.post('/addTask', verifyToken, async (req, res) => {
    try {
        var errors = await verifyForm(req.body, 'task');
        var values = Object.values(errors.errors);
        if(values.length > 0){
            res.status(422).send(values);
        }else{
            const task = await Task.create(req.body)
            if(!task) throw new Error();
            res.status(200).json({id: task.id, name: task.taskName, startDate: task.taskStartDate});
        }
    }catch (e) {
        console.log(e.message);
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

router.post('/getTask', verifyToken, async (req, res) => {
    try{
        const task = await Task.findOne({where: {
            id : req.body.id
        }})
        res.status(200).json({task: task});
    }catch (e){
        res.status(422).json({message: 'No se encontro la actividad'});
    }
})

router.get('/getActivitiesByOuvre', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.findAll({where: {
            ouvreId: req.query.id
        }});
        res.status(200).json({tasks: tasks})
    }catch(e){
        res.status(422).json({message: 'No se encontro la obra'});
    }
})

router.post('/updateTasks', verifyToken, async (req, res) => {
    try{
        const data = req.body
        var errors = await verifyForm(data, 'task')
        var values = Object.values(errors.errors)
        if(values.length > 0){
            res.status(422).json({"error": values});
        }else{
            var task = await Task.update({
                taskName: data.taskName,
                taskDescription: data.taskDescription,
                taskStartDate: data.taskStartDate,
                taskEndDate: data.taskEndDate,
                taskState: data.taskState,
                ouvreId: data.ouvreId
            }, {where: {
                id: data.id
            }})
            console.log(task)
            res.status(200).json({id: data.id})
        }
    }catch(e){
        res.status(422).json({"error": e})
    }
})

export default router;
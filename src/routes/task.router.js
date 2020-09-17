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

router.post('/getPercentageOuvre', verifyToken, async (req, res) => {
    try{
        const tasks = await Task.findAll({where: {
            ouvreId: req.body.id
        }})
        var complete = 0;
        for(var i = 0; i < tasks.length; i++){
            if(tasks[i].taskState === 'FINISHED'){
                complete++;
            }
        }
        var result = (complete * 100) / tasks.length;
        res.status(200).json({percentage: result});
    }catch(e){
        res.status(422).json({"error": e})
    }
})

router.post('/getPercentageAllOuvre', verifyToken, async(req, res) => {
    try{
        const tasks = await Task.findAll();
        const ouvres = [];
        for(var i = 0; i < tasks.length; i++){
            if(!(verifyArray(ouvres, tasks[i].ouvreId))){
                ouvres.push(tasks[i].ouvreId);
            }
        }
        const result = [];
        for(var i = 0; i < ouvres.length; i++){
            var complete = 0;
            var tasksNumber = 0;
            for(var j = 0; j < tasks.length; j++){
                if(tasks[j].ouvreId == ouvres[i]){
                    tasksNumber++;
                    if(tasks[j].taskState === 'FINISHED'){
                        complete++;
                    }
                }    
            }
            var per = (complete * 100) / tasksNumber;
            result.push({id: ouvres[i], percentage: per})
        }
        res.status(200).json({result: result});
    }catch(e){
        console.log(e);
        res.status(422).json({"error": e});
    }
})

function verifyArray(array, id){
    for(var i = 0; i < array.length; i++){
        if(array[i] === id){
            return true;
        }
    }
    return false;
}

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
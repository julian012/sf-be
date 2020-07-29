import {Router} from 'express';
import Task from "../../models/task";
import {verifyToken} from '../utils/utils';

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
        const task = await Task.create(req.body)
        if(!task) throw new Error();
        res.status(200).json({message: 'Creada Correctamente'});
    }catch (e) {
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

router.post('/getActivitiesByOuvre', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.findAll({where: {
            ouvreId: req.body.ouvreId
        }});
        res.status(200).json({tasks: tasks})
    }catch(e){
        res.status(422).json({message: 'No se encontro la obra'});
    }
})

export default router;
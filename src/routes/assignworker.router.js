import {Router} from 'express';
import AssignWorker from "../../models/assignworker";
import {verifyToken} from '../utils/utils';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const assignworker = await AssignWorker.findAll();
        res.status(200).json({assignworkers: assignworkers})
    } catch (e) {
        res.status(422).json({
            message: 'error'
        })
    }
})

router.post('/addAssignWorker', verifyToken, async (req, res) => {
    try {
        const assignworker = await AssignWorker.create(req.body)
        if(!assignworker) throw new Error();
        res.status(200).json({message: 'Creada Correctamente'});
    }catch (e) {
        console.log(e)
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

router.post('/getAssignWorker', verifyToken, async (req, res) => {
    try{
        const assignworker = await AssignWorker.findOne({where: {
            id : req.body.id
        }})
        res.status(200).json({assignworker: assignworker});
    }catch (e){
        res.status(422).json({message: 'No se encontro la actividad'});
    }
})

router.post('/getAssignWorkerByTask', verifyToken, async (req, res) => {
    try {
        const assignworkers = await AssignWorker.findAll({where: {
            taskId: req.body.taskId
        }});
        res.status(200).json({assignworkers: assignworkers})
    }catch(e){
        res.status(422).json({message: 'No se encontro la asignacion'});
    }
})

router.post('/getAssignWorkerByUser', verifyToken, async (req, res) => {
    try {
        const assignworkers = await AssignWorker.findAll({where: {
            userId: req.body.userId
        }});
        res.status(200).json({assignworkers: assignworkers})
    }catch(e){
        res.status(422).json({message: 'No se encontro la asignacion'});
    }
})

export default router;
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

router.delete('/deleteAssignWorker', verifyToken, async (req, res) => {
    try{
        const result = await AssignWorker.destroy({
            where: {
                id: req.query.assingWorkerId
            }
        })
        switch(result){
            case 0:
                res.status(422).json({message: 'La asignacion ingresada no existe'});
            break;
            case 1:
                res.status(200).json({message: 'Asignacion eliminada correctamente'});
            break;
        }
    }catch(e){
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
})

router.delete('/deleteWorkerOfTask', verifyToken, async (req, res) => {
    try{
        const result = await AssignWorker.destroy({
            where: {
                userId: req.query.userId,
                taskId: req.query.taskId
            }
        })
        switch(result){
            case 0:
                res.status(422).json({message: 'No existe esa asignacion'});
            break;
            case 1:
                res.status(200).json({message: 'Eliminacion completa'});
            break;
        }
    }catch(e){
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
})

router.post('/transferWorker', verifyToken, async (req, res) => {
    try{
        const assign = await AssignWorker.findOne({where: {
            id: req.body.id
        }})
        delete assign.dataValues['id'];
        assign.dataValues.taskId = req.body.taskId;
        const assignworker = await AssignWorker.create(assign.dataValues)
        if(!assignworker) throw new Error();
        const updateAssign = await AssignWorker.update({stateAssign: 'TRANSFER'}, {where:{
            id: req.body.id
        }})
        if(!updateAssign) throw new Error();
        res.status(200).json({message: 'Transferencia Correcta'});
    }catch(e){
        console.log(e);
        res.status(422).json({message: 'No se pudo completar la accion'})
    }
})

router.get('/getTimeWorkedByWorker', verifyToken, async (req, res) => {
    const day = new Date().getDay();
    try{
       const assigns = await AssignWorker.findAll({});
       for(var i = 0; i < assigns.length; i++){
        res.status(200).json({day: day});
       } 
    }catch(e){
        res.status(422).json({error: e});
    }
})

export default router;
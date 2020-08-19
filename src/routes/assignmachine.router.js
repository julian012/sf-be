import {Router} from 'express';
import AssignMachine from "../../models/assignmachines";
import {verifyToken, verifyForm} from '../utils/utils';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const assignMachine = await AssignMachine.findAll();
        res.status(200).json({assignMachine: assignMachine})
    } catch (e) {
        console.log(e.message);
        res.status(422).json({
            message: 'error'
        })
    }
})

router.post('/addAssignMachine', verifyToken, async (req, res) => {
    try {
        var errors = await verifyForm(req.body, 'assignMachine');
        var values = Object.values(errors.errors);
        if(values.length > 0){
            res.status(422).send(values);
        }else{
            const assignMachine = await AssignMachine.create(req.body)
            if(!assignMachine) throw new Error();
            res.status(200).json({assignMachine: assignMachine});
        }
    }catch (e) {
        console.log(e)
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

router.delete('/deleteAssignMachine', verifyToken, async (req, res) => {
    try{
        const test = await AssignMachine.destroy({
            where: {
                id: req.query.assingMachineId
            }
        })
        switch(test){
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

export default router
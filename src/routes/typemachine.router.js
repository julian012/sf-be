import {Router} from 'express';
import TypeMachine from "../../models/typemachines";
import {verifyToken, verifyForm} from '../utils/utils';

const router = Router();

router.get('/getAllTypeMachines', verifyToken, async (req, res) => {
    try {
        const typeMachines = await TypeMachine.findAll();
        res.status(200).json({typeMachines: typeMachines})
    } catch (e) {
        res.status(422).json({
            message: 'error'
        })
    }
})

router.post('/addTypeMachine', verifyToken, async (req, res) => {
    try {
        var errors = await verifyForm(req.body, 'typeMachine');
        var values = Object.values(errors.errors);
        if(values.length > 0){
            res.status(422).send(values);
        }else{
            const typeMachine = await TypeMachine.create(req.body)
            if(!typeMachine) throw new Error();
            res.status(200).json({typeMachine: typeMachine});
        }   
    }catch (e) {
        console.log(e)
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

export default router;
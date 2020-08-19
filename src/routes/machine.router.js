import {Router} from 'express';
import Machine from "../../models/machine";
import {verifyToken, verifyForm, Op} from '../utils/utils'

const router = Router();

router.get('/getAllMachines', verifyToken, async(req, res) => {
    try{
        const machines = await Machine.findAll()
        res.status(200).json({machines: machines})
    }catch(e){
        res.status(422).json({message: 'Ocurrio un error'})
    }
})

router.post('/addMachine', verifyToken, async(req, res) => {
    try{
        var errors = await verifyForm(req.body, 'machine');
        var values = Object.values(errors.errors);
        if(values.length > 0){
            res.status(422).send(values);
        }else{
            const material = await Machine.create(req.body)
            if(!material) throw new Error();
            res.status(200).json({material: material});
        }   
    }catch(e){
        res.status(422).json({message: 'Datos incorrectos'})
    }
})

export default router
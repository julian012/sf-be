import {Router} from 'express';
import Ouvre from "../../models/ouvre";
import {verifyToken, verifyForm} from '../utils/utils'

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const ouvres = await Ouvre.findAll();
        res.status(200).json({ouvres: ouvres})
    } catch (e) {
        res.status(422).json({
            message: 'error'
        })
    }
})

router.post('/addOuvre', verifyToken, async (req, res) => {
    try {
        var errors = await verifyForm(req.body, 'ouvre');
        var values = Object.values(errors.errors);
        if(values.length > 0){
            res.status(422).send(values);
        }else{
            const ouvre = await Ouvre.create(req.body)
            if(!ouvre) throw new Error  ();
            res.status(200).json({ouvre: ouvre});
        }   
    }catch (e) {
        console.log(e);
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

router.post('/getOuvre', verifyToken, async (req, res) => {
    try{
        const ouvre = await Ouvre.findOne({where: {
            id : req.body.id
        }})
        res.status(200).json({ouvre: ouvre});
    }catch (e){
        res.status(422).json({message: 'No se encontro la obra'});
    }
})

router.post('/assignDirector', verifyToken, async (req, res) => {
    try{
        const ouvre = await Ouvre.update({userId: req.body.userId}, 
                                         {where: {id: id}})
    }catch(e){
        res.status(422).json({message: 'No se encuentro director'})
    }
})

export default router;
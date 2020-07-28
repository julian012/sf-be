import {Router} from 'express';
import Ouvre from "../../models/ouvre";
import {verifyToken} from '../utils/utils'

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const ouvres = await Ouvre.findAll();
        res.status(200).json(ouvres)
    } catch (e) {
        res.status(422).json({
            message: 'error'
        })
    }
})

router.post('/addOuvre', verifyToken, async (req, res) => {
    try {
        const ouvre = await Ouvre.create({
            ouvreName: req.body.ouvreName,
            ouvreDirection: req.body.ouvreDirection, 
            ouvreStartDate: req.body.ouvreStartDate,
            ouvreEndDate: req.body.ouvreEndDate,
            statusOuvre: req.body.statusOuvre,
            userId: req.body.userId
        })
        if(!ouvre) throw new Error();
        res.status(200).json({message: 'Creada Correctamente'});
    }catch (e) {
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

export default router
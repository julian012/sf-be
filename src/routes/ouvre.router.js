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

export default router
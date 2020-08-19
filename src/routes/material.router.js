import {Router} from 'express';
import Material from "../../models/material";
import {verifyToken, verifyForm} from '../utils/utils'

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const materials = await Material.findAll();
        res.status(200).json({materials: materials})
    } catch (e) {
        res.status(422).json({
            message: 'error'
        })
    }
})

router.get('/getMaterials', verifyToken, async (req, res) => {
    try{
        const materials = await Material.findAll()
        if(materials.length > 0){
            res.status(200).send({materials: materials})
        }
    }catch(e){
        console.log(e);
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
})

router.post('/addMaterial', verifyToken, async (req, res) => {
    try {
        var errors = await verifyForm(req.body, 'material');
        var values = Object.values(errors.errors);
        if(values.length > 0){
            res.status(422).send(values);
        }else{
            const material = await Material.create(req.body)
            if(!material) throw new Error();
            res.status(200).json({material: material});
        }   
    }catch (e) {
        console.log(e);
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

export default router;
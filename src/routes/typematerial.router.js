import {Router} from 'express';
import TypeMaterial from "../../models/typematerial";
import {verifyToken, verifyForm} from '../utils/utils';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const typeMaterials = await TypeMaterial.findAll();
        res.status(200).json({typeMaterials: typeMaterials})
    } catch (e) {
        res.status(422).json({
            message: 'error'
        })
    }
})

router.post('/addTypeMaterial', verifyToken, async (req, res) => {
    try {
        var errors = await verifyForm(req.body, 'typeMaterial');
        var values = Object.values(errors.errors);
        if(values.length > 0){
            res.status(422).send(values);
        }else{
            const typeMaterial = await TypeMaterial.create(req.body)
            if(!typeMaterial) throw new Error();
            res.status(200).json({typeMaterial: typeMaterial});
        }   
    }catch (e) {
        console.log(e);
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

export default router;
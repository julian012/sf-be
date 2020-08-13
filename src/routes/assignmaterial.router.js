import {Router} from 'express';
import AssignMaterial from "../../models/assignmaterial";
import {verifyToken, verifyForm} from '../utils/utils';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const assignmaterial = await AssignMaterial.findAll();
        res.status(200).json({assignmaterial: assignmaterial})
    } catch (e) {
        console.log(e.message);
        res.status(422).json({
            message: 'error'
        })
    }
})

router.post('/addAssignMaterial', verifyToken, async (req, res) => {
    try {
        var errors = await verifyForm(req.body, 'assignMaterial');
        var values = Object.values(errors.errors);
        if(values.length > 0){
            res.status(422).send(values);
        }else{
            const assignmaterial = await AssignMaterial.create(req.body)
            if(!assignmaterial) throw new Error();
            res.status(200).json({assignmaterial: assignmaterial});
        }
    }catch (e) {
        console.log(e)
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

router.post('/getAssignByOuvre', verifyToken, async (req, res) => {
    try{
        const assignMaterial = await AssignMaterial.findAll({where: {
            ouvreId: req.body.ouvreId
        }});
        res.status(200).json({assignMaterial: assignMaterial})
     } catch(e){
         console.log(e.message);
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

router.post('/getAssignByMaterial', verifyToken, async (req, res) => {
    try{
        const assignMaterial = await AssignMaterial.findAll({where: {
            materialId: req.body.materialId
        }});
        res.status(200).json({assignMaterial: assignMaterial})
     } catch(e){
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

export default router;
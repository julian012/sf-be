import {Router} from 'express';
import AssignMaterial from "../../models/assignmaterial";
import {verifyToken, verifyForm} from '../utils/utils';
import Material from "../../models/material";
import { verify } from 'jsonwebtoken';

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
})

router.delete('/deleteAssignMaterial', verifyToken, async (req, res) => {
    try{
        const result = await AssignMaterial.destroy({
            where: {
                id: req.query.assingMaterialId
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

router.post('/giveBackMaterial', verifyToken, async (req, res) => {
    try{
        const assignMaterial = await AssignMaterial.findAll({where: {
            id: req.body.idAssignMaterial
        }});
        var quantityFinal = assignMaterial[0].quantityUsed;
        if(quantityFinal > req.body.quantity){
            var q = quantityFinal - req.body.quantity;
            await AssignMaterial.update({
                quantityUsed: q
            }, {where: {
                id: req.body.idAssignMaterial
            }})
            res.status(200).json({'success': 'Cambio realizado'})
        }{
            res.status(422).json({'error': 'Cantidad no valida'})
        }
    }catch(e){
        res.status(422).json({error: 'No se pudo completar la accion'});
    }
})

router.post('/getMaterialWithAssign', verifyToken, async (req, res)=>{
    try{
        var assignsInfo = [];
        const material = await Material.findAll({where: {
            id: req.body.id
        }});
        const assignMaterial = await AssignMaterial.findAll({where: {
            materialId: material[0].id
        }});
        for(var i = 0; i < assignMaterial.length; i++){
            var data = {};
            data.id = assignMaterial[i].id;
            data.ouvreId = assignMaterial[i].ouvreId,
            data.quantityUsed = assignMaterial[i].quantityUsed
            assignsInfo.push(data);
        }
        material[0].dataValues.Assigns = assignsInfo;
        res.status(200).json({'material': material})
    }catch(e){
        res.status(422).json({message: 'No se pudo completar la accion'})
    }
})

router.post('/getMaterialPercentageByOuvre', verifyToken, async(req, res) => {
    try{
        var results = [];
        var ids = [];
        const materials = await AssignMaterial.findAll({where: {
            ouvreId: req.body.id
        }});
        var total = 0;
        for(var i = 0; i < materials.length; i++){
            total += materials[i].quantityUsed;
            if(!(verifyArray(ids, materials[i].materialId))){
                ids.push(materials[i].materialId);
            }
        }
        for(var i = 0; i < ids.length; i++){
            var totalParcial = 0;
            for(var j = 0; j < materials.length; j++){
                if(materials[j].materialId === ids[i]){
                    totalParcial += materials[j].quantityUsed;
                }
            }
            var percentaje = (totalParcial * 100) / total; 
            results.push({id: ids[i], percentaje: percentaje});
        }
        res.status(200).json({result: results});
    }catch(e){
        res.status(422).json({message: 'No se pudo completar la accion'})
    }
})



function verifyArray(array, id){
    for(var i = 0; i < array.length; i++){
        if(array[i] === id){
            return true;
        }
    }
    return false;
}

export default router;
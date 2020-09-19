import {Router} from 'express';
import AssignMaterial from "../../models/assignmaterial";
import {verifyToken, verifyForm} from '../utils/utils';
import Material from "../../models/material";
import Ouvre from '../../models/ouvre'
import User from '../../models/user'
import TypeMaterial from '../../models/typematerial'
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

router.get('/getMaterialWithAssign', verifyToken, async (req, res)=>{
    try{
        var assignsInfo = [];
        const material = await Material.findOne({where: {
            id: req.query.id
        }});

        const provider = await User.findOne({
            where:{
                id: material.dataValues.userId
            }
        })

        material.dataValues.userName = provider.userName

        const typeMaterial = await TypeMaterial.findOne({
            where:{
                id: material.dataValues.typeMaterialId
            }
        })

        material.dataValues.typeMaterialName = typeMaterial.dataValues.typeMaterialName

        const assignMaterial = await AssignMaterial.findAll({where: {
            materialId: material.id
        }});
        for(var i = 0; i < assignMaterial.length; i++){
            var data = {};

            const ouvre = await Ouvre.findOne({
                where: {id: assignMaterial[i].ouvreId}
            })

            data.id = assignMaterial[i].id
            data.ouvreId = ouvre.id
            data.ouvreName = ouvre.ouvreName
            data.quantityUsed = assignMaterial[i].quantityUsed
            data.createdAt = assignMaterial[i].createdAt
            assignsInfo.push(data);
        }
        material.dataValues.Assigns = assignsInfo;
        res.status(200).json(material)
    }catch(e){
        console.log(e)
        res.status(422).json({message: 'No se pudo completar la accion'})
    }
})

router.post('/getMaterialPercentageByOuvre', verifyToken, async(req, res) => {
    try{
        const ouvres = await Ouvre.findAll({where: {
            statusOuvre: 'DOING'
        }})
        var idsMaterials = [];
        for(var i = 0; i < ouvres.length; i++){
            ouvres[i].dataValues.percentages = [];
            const assings = await AssignMaterial.findAll({where: {
                ouvreId: ouvres[i].id
            }})
            var total = 0;
            for(var j = 0; j < assings.length; j ++){
                total += assings[j].quantityUsed;
                if(!(verifyArray(idsMaterials, assings[j].materialId))){
                    idsMaterials.push(assings[j].materialId);
                }
            }
            for(var k = 0; k < idsMaterials.length; k++){
                var totalMaterial = 0;
                for(var j = 0; j < assings.length; j++){
                    var idActual = idsMaterials[k];
                    if(idActual = assings[j].id){
                        totalMaterial += assings[j].quantityUsed;
                    }
                }
                var percentage = (totalMaterial * 100) / total;
                ouvres[i].dataValues.percentages.push({idMaterial: idsMaterials[k], percentage: percentage});
            }
        }
        var mate = [];
        for(var i = 0; i < idsMaterials.length; i++){
            for(var j = 0; j < ouvres.length; j++){
                var values = [];
                var percentages = ouvres[j].dataValues.percentages;
                for(var k = 0; k < percentages.length; k++){
                    values.push(0);
                    if(idsMaterials[i] === percentages[k].idMaterial){
                        values[i] = percentages[k].percentage;
                    }
                }
            }
            mate.push({id: idsMaterials[i], values: values})
        }
        const materials = await Material.findAll({});
        var result = [];
        for(var i = 0; i < mate.length; i++){
            for(var j = 0; j < materials.length; j ++){
                if(mate[i].id === materials[j].id){
                    result.push({name: materials[j].materialName, data: mate[i].values})
                }
            }
        }
        var ouv = [];
        for(var i = 0; i < ouvres.length; i++){
            ouv.push(ouvres[i].ouvreName);
        }
        res.status(200).json({axis: {label: 'Obras', categories: ouv},series: result});
    }catch(e){
        console.log(e);
        res.status(422).json({error: e})
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
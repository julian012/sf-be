import {Router} from 'express';
import Ouvre from "../../models/ouvre";
import Task from "../../models/task";
import AssignWorker from "../../models/assignworker";
import AssignMaterial from "../../models/assignmaterial";
import Material from "../../models/material"
import TypeMaterial from "../../models/typematerial"
import User from "../../models/user";
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

router.post('/updateOuvreInfo', verifyToken, async (req, res) => {
    try{
        const data = req.body
        var errors = await verifyForm(data, 'ouvre')
        var values = Object.values(errors.errors)
        if(values.length > 0){
            res.status(422).send(values)
        }else{
            await Ouvre.update({
                ouvreName: data.ouvreName,
                ouvreDirection: data.ouvreDirection,
                ouvreStartDate: data.ouvreStartDate,
                ouvreEndDate: data.ouvreEndDate,
                statusOuvre: data.statusOuvre,
                userId: data.userId
            }, {where: {
                id: data.id
            }})
            res.status(200).json({ouvre: ouvre})
        }
    }catch (e){
        console.log(e)
        res.status(422).send({errors: {email: 'Datos Incorrectos'}})
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
            if(!ouvre) throw new Error();
            res.status(200).json({ouvre: ouvre});
        }   
    }catch (e) {
        console.log(e);
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

router.post('/getOuvreWorkers', verifyToken, async (req, res) => {
    try{
        var workers = []
        const id = req.body.id
        const activeTasks = await Task.findAll({
            where: {
                ouvreId: id,
                taskState: ['DOING', 'PENDING']
            }
        })
        var userIds = []
        for (let i = 0; i < activeTasks.length; i++) {
            const element = activeTasks[i].dataValues;
            const assign = await AssignWorker.findAll({
                where: {
                    taskId: element.id 
                }
            })
            if(assign != null && assign.length > 0){
                assign.forEach(a => {
                    userIds.push(a.dataValues.userId)
                })
            }
        } 
        
        for (let i = 0; i < userIds.length; i++) {
            const id = userIds[i];
            const worker = await User.findOne({
                where: {
                    id: id
                }
            })
            delete worker.dataValues['userPassword']
            workers.push(worker.dataValues)
        }
        
        res.status(200).json({workers: workers})
    }catch (e){
        res.status(422).json({message: 'No se encontro la obra'});
    }
})

router.post('/getOuvreMaterials', verifyToken, async (req, res) => {
    try{
        var materials = []
        const id = req.body.id
        const assignedMaterials = await AssignMaterial.findAll({
            where: {
                ouvreId: id
            }
        })
        for (let i = 0; i < assignedMaterials.length; i++) {
            const element = assignedMaterials[i].dataValues;
            console.log(element)
            const material = await Material.findOne({
                where: {
                    id: element.materialId
                }
            })

            delete material.dataValues['createdAt']
            delete material.dataValues['updatedAt']
            delete material.dataValues['materialRegistryDate']

            const typeMaterial = await TypeMaterial.findOne({
                where: {
                    id: material.dataValues.typeMaterialId
                }
            })
            
            material.dataValues.typeMaterialName = typeMaterial.dataValues.typeMaterialName
            material.dataValues.measurement = typeMaterial.dataValues.measurement

            materials.push(material.dataValues)
        }
        res.status(200).json({materials: materials})
    }catch (e){
        console.log(e)
        res.status(422).json({message: 'No se encontro la obra'})
    }
})

router.get('/getOuvre', verifyToken, async (req, res) => {
    try{
        const ouvre = await Ouvre.findOne({where: {
            id : req.query.id
        }})
        res.status(200).json({ouvre: ouvre});
    }catch (e){
        res.status(422).json({message: 'No se encontro la obra'});
    }
})

router.post('/assignDirector', verifyToken, async (req, res) => {
    try{
        const ouvre = await Ouvre.update(
            {userId: req.body.userId}, 
            {where: 
                {id: req.body.id},
                returning: true,
                plain: true
            })
        if(ouvre.length > 0) res.status(200).json({ouvre: 'Director asignado'});
    }catch(e){
        console.log(e)
        res.status(422).json({message: 'Datos incorrectos'})
    }
})

export default router;
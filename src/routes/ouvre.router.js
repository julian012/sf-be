import {Router} from 'express';
import Ouvre from "../../models/ouvre";
import Schedule from "../../models/schedule"
import Task from "../../models/task";
import AssignWorker from "../../models/assignworker";
import AssignMaterial from "../../models/assignmaterial";
import AssignMachine from "../../models/assignmachines";
import Material from "../../models/material"
import TypeMaterial from "../../models/typematerial"
import TypeMachine from "../../models/typemachines"
import User from "../../models/user";
import Machine from "../../models/machine"
import {verifyToken, verifyForm, generateRandomToken, Op} from '../utils/utils'
import { verify } from 'jsonwebtoken';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const ouvres = await Ouvre.findAll();
        for(var i = 0; i < ouvres.length; i++){
            var result = await getPercentageByOuvre(ouvres[i].id);
            ouvres[i].dataValues.percentage = result;
        }
        res.status(200).json(ouvres)
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
            res.status(422).json({"error": values});
        }else{
            const ouvre = await Ouvre.update({
                ouvreName: data.ouvreName,
                ouvreDirection: data.ouvreDirection,
                ouvreStartDate: data.ouvreStartDate,
                ouvreEndDate: data.ouvreEndDate,
                statusOuvre: data.statusOuvre,
                userId: data.userId
            }, {where: {
                id: data.id
            }})
            res.status(200).json({"success": "Modificación realizada"})
        }
    }catch (e){
        res.status(422).json({"error": e})
    }
})

router.post('/addOuvre', verifyToken, async (req, res) => {
    try {
        var errors = await verifyForm(req.body, 'ouvre');
        var values = Object.values(errors.errors);
        if(values.length > 0){
            res.status(422).send(values);
        }else{
            req.body.ouvreToken = generateRandomToken()
            const ouvre = await Ouvre.create(req.body)
            if(!ouvre) throw new Error();
            res.status(200).json({ouvre: ouvre});
        }   
    }catch (e) {
        console.log(e);
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

router.get('/getWorkerActivities', verifyToken, async (req, res) => {
    try{
        var tasks = []
        const assigns = await AssignWorker.findAll({where:{
            userId: req.query.userId
        }})
        for (let i = 0; i < assigns.length; i++) {
            const element = assigns[i].dataValues;
            console.log(element)
            const task = await Task.findOne({where:{
                id: element.taskId
            }})
            tasks.push(task)
        }
        res.status(200).json(tasks);
    }catch(e){
        res.status(422).json({message: 'No se pudo completar la operacion'});
    }
})

router.post('/getOuvreWorkers', verifyToken, async (req, res) => {
    try{
        var workers = [];
        const ouvre = await Ouvre.findOne({where:{
            id: req.body.id
        }})
        const tasks = await Task.findAll({where: {
           ouvreId: ouvre.id 
        }})
        for(var i = 0; i < tasks.length; i++){
            var ts = [];
            const assigns = await AssignWorker.findAll({where:{
                taskId: tasks[i].id
            }})
            for(var j = 0; j < assigns.length; j++){
                const worker = await User.findOne({where: {
                    id: assigns[j].userId
                }})
                if(verifyId(workers, worker.id)){
                    for(var k = 0; k < workers.length; k++){
                        if(worker.id === workers[k].id){
                            var ts = workers[k].dataValues.tasks;
                            ts.push(tasks[i].id);
                            workers[k].dataValues.tasks = ts;
                        }
                    }
                }else {
                    var ts = [];
                    ts.push(tasks[i].id);
                    worker.dataValues.tasks = ts;
                    delete worker.dataValues['userPassword'];
                    workers.push(worker);
                }
            }
        }
        res.status(200).json({workers: workers});
    }catch (e){
        res.status(422).json({message: 'No se pudo completar la operacion'});
    }
})

function verifyId(workers, id){
    for(var p = 0; p < workers.length; p++){
        if (workers[p].dataValues.id === id){
                
            return true;
        }
    }
    return false;
}

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
            const element = assignedMaterials[i];
            console.log(element)
            const materialT = await Material.findOne({
                where: {
                    id: element.materialId
                }
            })
            
            var material = materialT.dataValues

            delete material['createdAt']
            delete material['updatedAt']
            delete material['materialRegistryDate']

            const typeMaterial = await TypeMaterial.findOne({
                where: {
                    id: material.typeMaterialId
                }
            })
            
            material.typeMaterialName = typeMaterial.typeMaterialName
            material.measurement = typeMaterial.measurement
            console.log(assignedMaterials[i].id);
            material.idAssignMaterial = assignedMaterials[i].id;
            material.quantity = assignedMaterials[i].quantityUsed

            materials.push(material)
        }
        res.status(200).json({materials: materials})
    }catch (e){
        console.log(e)
        res.status(422).json({message: 'No se encontro la obra'})
    }
})

router.post('/getOuvreMachines', verifyToken, async(req, res) => {
    try{
        var machines = []
        const id = req.body.id
        const activeTasks = await Task.findAll({
            where: {
                ouvreId: id,
                taskState: ['DOING', 'PENDING']
            }
        })
        var machineIds = []
        for (let i = 0; i < activeTasks.length; i++) {
            const element = activeTasks[i];
            const assign = await AssignMachine.findAll({
                where: {
                    taskId: element.id 
                }
            })
            if(assign != null && assign.length > 0){
                console.log(element)
                assign.forEach(a => {
                    machineIds.push({
                        id: a.machineId,
                        assingMachineId: a.id,
                        assingStartDate: a.assignStartDate,
                        assignEndDate: a.assignEndDate
                    })
                })
            }
        }
        for (let i = 0; i < machineIds.length; i++) {
            const element = machineIds[i];
            var machineT = await Machine.findOne({
                where: {
                    id: element.id
                }
            })

            var machine = machineT.dataValues
            machine.assingMachineId = element.assingMachineId

            delete machine['createdAt']
            delete machine['updatedAt']

            

            const typeMachine = await TypeMachine.findOne({
                where: {
                    id: machine.typeMachineId
                }
            })

            machine.nameTypeMachine = typeMachine.nameTypeMachine
            machine.machineHourValue = typeMachine.machineHourValue
            machine.assingStartDate = machineIds[i].assingStartDate
            machine.assignEndDate = machineIds[i].assignEndDate

            const user = await User.findOne({
                where: {
                    id: machine.userId
                }
            })

            machine.userName = user.userName
            machine.userPhone = user.userPhone

            machines.push(machine)
        }
        res.status(200).json({machines: machines})
        
    }catch(e){
        console.log(e)
        res.status(422).json({message: 'No se encontro la obra'})
    }
})

router.get('/getOuvre', verifyToken, async (req, res) => {
    try{
        const ouvre = await Ouvre.findOne({where: {
            id : req.query.id
        }})
        if(ouvre.userId != null){
            const user = await User.findOne({
                where: {
                    id: ouvre.userId
                }
            })
            ouvre.dataValues.userName = user.userName
            ouvre.dataValues.userPhone = user.userPhone
            ouvre.dataValues.userMail = user.userMail
            ouvre.dataValues.userRol = user.userRol
        }
        var result = await getPercentageByOuvre(ouvre.id);
        ouvre.dataValues.percentage = result; 
        res.status(200).json({ouvre: ouvre});
    }catch (e){
        console.log(e)
        res.status(422).json({message: 'No se encontro la obra'});
    }
})

async function getPercentageByOuvre(id){
    try{
        const tasks = await Task.findAll({where: {
            ouvreId: id
        }})
        var complete = 0;
        for(var i = 0; i < tasks.length; i++){
            if(tasks[i].taskState === 'FINISHED'){
                complete++;
            }
        }
        var result = (complete * 100) / tasks.length;
        return result;
    }catch(e){
        return e;
    }
}

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

router.get('/getFreeDirectors', verifyToken, async (req, res) => {
    try{
        const freeDirectors = []
        const activeDirectors = await Ouvre.findAll({
            where: {
                userId: {
                    [Op.ne]: null
                }
            },
            attributes: ['userId']
        })
        var users = await User.findAll({
            where: {
                userRol: 'DIRECTOR'
            }
        })
        for (let i = 0; i < activeDirectors.length; i++) {
            const element = activeDirectors[i].dataValues.userId;
            users = users.filter( u => u.dataValues.id !== element)
        }
        for (let i = 0; i < users.length; i++) {
            const element = users[i].dataValues;
            freeDirectors.push(element)
        }
        res.status(200).json(freeDirectors);
    }catch(e){
        res.status(422).json({message: 'Datos incorrectos'})
    }
})

router.get('/getTimeWorkerPerHours', verifyToken, async (req, res) => {
    try{
        const response = []
        const ouvres = await Ouvre.findAll({
        })
        for (let o = 0; o < ouvres.length; o++) {
            var ouvre = ouvres[o];
            var hours = 0
            const tasks = await Task.findAll({
                raw: true,
                where: {
                    ouvreId: ouvre.id
                }
            })
            var userIds = []
            const allAssigns = []
            for (let t = 0; t < tasks.length; t++) {
                const element = tasks[t];
                console.log(element)
                const assigns = await AssignWorker.findAll({
                    raw: true,
                    where: {
                        taskId: element.id
                    }
                })
                for (let a = 0; a < assigns.length; a++) {
                    const as = assigns[a];
                    allAssigns.push(as)
                }
            }
            for (let a = 0; a < allAssigns.length; a++) {
                const element = allAssigns[a];
                userIds.push(element.userId)
            }

            for (let u = 0; u < userIds.length; u++) {
                const id = userIds[u];
                var user = await User.findOne({
                    raw: true,
                    where: {
                        id: id
                    }
                })
                var schedules = await Schedule.findAll({
                    raw: true,
                    where: {
                        userId: id
                    }
                })
                schedules.sort(function (a, b) {
                    return a.scheduleDate.getTime() - b.scheduleDate.getTime()
                });
                var totalWorkerHours = 0
                var dayInWeek = []
                for (let j = 0; j < schedules.length; j++) {
                    const schedule = schedules[j];
                    dayInWeek.push(schedule)
                    if (dayInWeek.length > 3) {
                        var morningDate = dayInWeek[0].scheduleDate
                        var halfDayDate = dayInWeek[1].scheduleDate
                        var afternoonDate = dayInWeek[2].scheduleDate
                        var nightDate = dayInWeek[3].scheduleDate

                        var difInTimeMorning = halfDayDate.getTime() - morningDate.getTime()
                        var difInTimeAfternoon = nightDate.getTime() - afternoonDate.getTime()
                        var dayInHours = (difInTimeMorning / (1000 * 3600)) + (difInTimeAfternoon / (1000 * 3600))
                        totalWorkerHours += dayInHours
                    }
                }
                console.log(totalWorkerHours)
                hours += totalWorkerHours
            }
            ouvre.dataValues.totalWorkerHours = totalWorkerHours
            response.push(ouvre)
        }
        res.status(200).json(response)

    }catch(e){
        console.log(e)
        res.status(422).json({
            message: 'error'
        })
    }
})

export default router;
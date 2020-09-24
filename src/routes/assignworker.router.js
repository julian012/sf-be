import {Router} from 'express';
import AssignWorker from "../../models/assignworker";
import Schedule from '../../models/schedule'
import Task from '../../models/task'
import {verifyToken, Op} from '../utils/utils';
import User from "../../models/user";
import Ouvre from '../../models/ouvre';

const router = Router();

router.get('/getWorkersOuvres', verifyToken, async (req, res) => {
    try{
        const id = req.query.id
        const assigns = await AssignWorker.findAll({
            raw: true,
            where:{
                userId: id
            }
        })
        var tasks = []
        for (let i = 0; i < assigns.length; i++) {
            const element = assigns[i];
            const tmpTask = await Task.findAll({
                raw: true,
                where: {
                    id: element.taskId
                }
            })
            for (let t = 0; t < tmpTask.length; t++) {
                const element = tmpTask[t];
                tasks.push(element)
            }
        }
        var ouvres = []
        for (let t = 0; t < tasks.length; t++) {
            const element = tasks[t];
            const ouvre = await Ouvre.findOne({
                raw: true,
                where:{
                    id: element.ouvreId                }
            })
            ouvres.push(ouvre)
        }
        res.status(200).json(removeDuplicates(ouvres, 'id'))
    }catch(e){
        console.log(e)
        res.status(422).json({
            message: 'error'
        })
    }
})

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}

router.get('/', verifyToken, async (req, res) => {
    try {
        const assignworker = await AssignWorker.findAll();
        res.status(200).json({assignworkers: assignworker})
    } catch (e) {
        console.log(e);
                res.status(422).json({
            message: 'error'
        })
    }
})

router.get('/getTimeWorkerByWorkersByOuvreId', verifyToken, async (req, res) => {
    try{
        const ouvreId = req.query.ouvreId
        const startDate = new Date(req.query.initDate)
        const endDate = new Date(req.query.endDate)
        var response = []
        const tasks = await Task.findAll({
            raw: true,
            where: {
                ouvreId: ouvreId
            }
        })
        var userIds = []
        const allAssigns = []
        for (let t = 0; t < tasks.length; t++) {
            const element = tasks[t];
            const assigns = await AssignWorker.findAll({
                raw: true,
                where:{
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
                where:{
                    id: id
                }
            })
            var schedules = await Schedule.findAll({
                raw: true,
                where: {
                    userId: id,
                    scheduleDate: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            })
            schedules.sort(function(a,b){
                return a.scheduleDate.getTime() - b.scheduleDate.getTime()
            });
            var totalWorkerHours = 0
            var totalWorkDays = []
            var dayInWeek = []
            for (let j = 0; j < schedules.length; j++) {
                const schedule = schedules[j];
                dayInWeek.push(schedule)
                if (dayInWeek.length > 3) {
                    var day = {}
                    day.date = dayInWeek[0].scheduleDate.toISOString().split("T")[0]
                    var morningDate = dayInWeek[0].scheduleDate
                    var halfDayDate = dayInWeek[1].scheduleDate
                    var afternoonDate = dayInWeek[2].scheduleDate
                    var nightDate = dayInWeek[3].scheduleDate

                    var difInTimeMorning = halfDayDate.getTime() - morningDate.getTime()
                    var difInTimeAfternoon = nightDate.getTime() - afternoonDate.getTime()
                    var dayInHours = (difInTimeMorning / (1000 * 3600)) + (difInTimeAfternoon / (1000 * 3600))
                    day.workedHours = dayInHours
                    totalWorkerHours += dayInHours

                    totalWorkDays.push(day)
                    
                    dayInWeek.length = 0
                }
            }
            delete user['userPassword']
            delete user['updatedAt']
            user.totalWorkerHours = totalWorkerHours
            user.work = totalWorkDays
            response.push(user)
        }
        res.status(200).json(response)

    }catch(e){
        console.log(e)
        res.status(422).json({
            message: 'error'
        })
    }
})

router.get('/getTimeWorkedByWorkerId', verifyToken, async (req, res) => {
    try{
        const workerId = req.query.userId
        const startDate = new Date(req.query.initDate)
        const endDate = new Date(req.query.endDate)

        var user = await User.findOne({
            raw: true,
            where:{
                id: workerId
            }
        })

        var schedules = await Schedule.findAll({
            raw: true,
            where: {
                userId: workerId,
                scheduleDate: {
                    [Op.between]: [startDate, endDate]
                }
            }
        })

        schedules.sort(function(a,b){
            return a.scheduleDate.getTime() - b.scheduleDate.getTime()
        });

        var totalWorkerHours = 0
        var totalWorkDays = []
        var dayInWeek = []
        for (let j = 0; j < schedules.length; j++) {
            const schedule = schedules[j];
            dayInWeek.push(schedule)
            if (dayInWeek.length > 3) {
                var day = {}
                day.date = dayInWeek[0].scheduleDate.toISOString().split("T")[0]
                var morningDate = dayInWeek[0].scheduleDate
                var halfDayDate = dayInWeek[1].scheduleDate
                var afternoonDate = dayInWeek[2].scheduleDate
                var nightDate = dayInWeek[3].scheduleDate

                var difInTimeMorning = halfDayDate.getTime() - morningDate.getTime()
                var difInTimeAfternoon = nightDate.getTime() - afternoonDate.getTime()
                var dayInHours = (difInTimeMorning / (1000 * 3600)) + (difInTimeAfternoon / (1000 * 3600))
                day.workedHours = dayInHours
                totalWorkerHours += dayInHours

                totalWorkDays.push(day)
                
                dayInWeek.length = 0
            }
        }

        delete user['userPassword']
        delete user['updatedAt']
        user.totalWorkerHours = totalWorkerHours
        user.work = totalWorkDays

        res.status(200).json(user)
    }catch(e){
        console.log(e)
        res.status(422).json({
            message: 'error'
        })
    }
})

router.post('/addAssignWorker', verifyToken, async (req, res) => {
    try {
        const assignworker = await AssignWorker.create(req.body)
        if(!assignworker) throw new Error();
        res.status(200).json({message: 'Creada Correctamente'});
    }catch (e) {
        console.log(e)
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

router.post('/getAssignWorker', verifyToken, async (req, res) => {
    try{
        const assignworker = await AssignWorker.findOne({where: {
            id : req.body.id
        }})
        res.status(200).json({assignworker: assignworker});
    }catch (e){
        res.status(422).json({message: 'No se encontro la actividad'});
    }
})

router.post('/getAssignWorkerByTask', verifyToken, async (req, res) => {
    try {
        const assignworkers = await AssignWorker.findAll({where: {
            taskId: req.body.taskId
        }});
        res.status(200).json({assignworkers: assignworkers})
    }catch(e){
        res.status(422).json({message: 'No se encontro la asignacion'});
    }
})

router.post('/getAssignWorkerByUser', verifyToken, async (req, res) => {
    try {
        const assignworkers = await AssignWorker.findAll({where: {
            userId: req.body.userId
        }});
        res.status(200).json({assignworkers: assignworkers})
    }catch(e){
        res.status(422).json({message: 'No se encontro la asignacion'});
    }
})

router.delete('/deleteAssignWorker', verifyToken, async (req, res) => {
    try{
        const result = await AssignWorker.destroy({
            where: {
                id: req.query.assingWorkerId
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

router.delete('/deleteWorkerOfTask', verifyToken, async (req, res) => {
    try{
        const result = await AssignWorker.destroy({
            where: {
                userId: req.query.userId,
                taskId: req.query.taskId
            }
        })
        switch(result){
            case 0:
                res.status(422).json({message: 'No existe esa asignacion'});
            break;
            case 1:
                res.status(200).json({message: 'Eliminacion completa'});
            break;
        }
    }catch(e){
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
})

router.post('/transferWorker', verifyToken, async (req, res) => {
    try{
        const assign = await AssignWorker.findOne({where: {
            id: req.body.id
        }})
        delete assign.dataValues['id'];
        assign.dataValues.taskId = req.body.taskId;
        const assignworker = await AssignWorker.create(assign.dataValues)
        if(!assignworker) throw new Error();
        const updateAssign = await AssignWorker.update({stateAssign: 'TRANSFER'}, {where:{
            id: req.body.id
        }})
        if(!updateAssign) throw new Error();
        res.status(200).json({message: 'Transferencia Correcta'});
    }catch(e){
        console.log(e);
        res.status(422).json({message: 'No se pudo completar la accion'})
    }
})

export default router;
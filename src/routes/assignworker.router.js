import {Router} from 'express';
import AssignWorker from "../../models/assignworker";
import Schedule from '../../models/schedule'
import {verifyToken, Op} from '../utils/utils';
import User from "../../models/user";

const router = Router();

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
        
    }catch(e){

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
        console.log(user)

        res.status(422).json({
            message: 'error'
        })
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

router.get('/getTimeWorkedByWorker', verifyToken, async (req, res) => {
    try{
       const assigns = await AssignWorker.findAll({});
       var ids = [];
       for(var i = 0; i < assigns.length; i++){
            if(!(verifyId(ids, assigns[i].userId))){
                ids.push(assigns[i].userId);
            }
       }
       var result = [];
       for (var j = 0; j < ids.length; j++){
            var total = 0;
            for(var i = 0; i < assigns.length; i++){
                if(ids[j] === assigns[i].userId){
                    if(assigns[i].assignEndDate === null){
                        const date = new Date();
                        const dateFirst = new Date(assigns[i].assignStartDate);
                        var daysNoCount = getBusinessDays(dateFirst, date); 
                        var daysDiff = date.getTime() - dateFirst.getTime();
                        var daysTotal = Math.round(daysDiff/(1000*60*60*24));
                        total += (daysTotal - daysNoCount) * 8;
                    }else{
                        const dateEnd = new Date(assigns[i].assignEndDate);
                        const dateFirst = new Date(assigns[i].assignStartDate);
                        var daysNoCount = getBusinessDays(dateFirst, dateEnd)
                        var daysDiff = dateEnd.getTime() - dateFirst.getTime();
	                    var daysTotal = Math.round(daysDiff/(1000*60*60*24));
                        total += (daysTotal - daysNoCount) * 8;
                    }
                }
            }
            result.push({id: ids[j], total: total})
       }
       var  finalNames = [];
       var series = [];
       const workers = await User.findAll({});
       for(var j = 0; j < workers.length; j++){
            for(var i = 0; i < result.length; i ++){
                if(result[i].id === workers[j].id){
                    finalNames.push(workers[j].userName)
                }
            }
       }
       for(var i = 0; i < result.length; i++){
           series.push(result[i].total);
       }
       res.status(200).json({labels: finalNames, series: series});
    }catch(e){
        console.log(e);
        res.status(422).json({error: e});
    }
})

function getBusinessDays(dateInit, dateFinal){
    var days = 0;
    var dateI = new Date(dateInit);
    var dateF = new Date(dateFinal); 
    while(dateI <= dateF){
        if(dateI.getDay() == 0 || dateI.getDay() == 6){
            days++;
        }
        dateI.setDate(dateI.getDate() + 1);
    }
    return days;
}

function verifyId(array, id){
    for(var p = 0; p < array.length; p++){
        if (array[p] === id){
                
            return true;
        }
    }
    return false;
}

export default router;
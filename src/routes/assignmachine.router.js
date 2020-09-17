import {Router} from 'express';
import TypeMachine from '../../models/typemachines'
import AssignMachine from "../../models/assignmachines";
import Machine from "../../models/machine";
import Task from "../../models/task";
import Ouvre from "../../models/ouvre";
import User from '../../models/user'
import {verifyToken, verifyForm} from '../utils/utils';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const assignMachine = await AssignMachine.findAll();
        res.status(200).json({assignMachine: assignMachine})
    } catch (e) {
        console.log(e.message);
        res.status(422).json({
            message: 'error'
        })
    }
})

router.post('/addAssignMachine', verifyToken, async (req, res) => {
    try {
        var errors = await verifyForm(req.body, 'assignMachine');
        var values = Object.values(errors.errors);
        if(values.length > 0){
            res.status(422).send(values);
        }else{
            const assignMachine = await AssignMachine.create(req.body)
            if(!assignMachine) throw new Error();
            res.status(200).json({assignMachine: assignMachine});
        }
    }catch (e) {
        console.log(e)
        res.status(422).json({message: 'No se pudo completar la accion'});
    }
});

router.delete('/deleteAssignMachine', verifyToken, async (req, res) => {
    try{
        const result = await AssignMachine.destroy({
            where: {
                id: req.query.assingMachineId
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

router.get('/getMachineWithAssign', verifyToken, async(req,res) => {
    try{
        var assignsInfo = []
        const machine = await Machine.findOne({
            where:{
                id: req.query.id
            }
        })

        const provider = await User.findOne({
            where:{
                id: machine.dataValues.userId
            }
        })
        machine.dataValues.userName = provider.userName

        const typeMachine = await TypeMachine.findOne({
            where:{
                id: machine.dataValues.typeMachineId
            }
        })
        machine.dataValues.typeMachineName = typeMachine.nameTypeMachine

        const assignMachine = await AssignMachine.findAll({
            where:{
                machineId: machine.id
            }
        })
        for (let i = 0; i < assignMachine.length; i++) {
            const element = assignMachine[i];

            const task = await Task.findOne({
                where:{
                    id: element.taskId
                }
            })

            const ouvre = await Ouvre.findOne({
                where:{
                    id: task.ouvreId
                }
            })

            assignsInfo.push({
                id: element.id,
                ouvreId: ouvre.id,
                ouvreName: ouvre.ouvreName,
                taskId: task.id,
                taskName: task.taskName,
                createdAt: element.createdAt
            })
        }
        machine.dataValues.assigns = assignsInfo
        res.status(200).json(machine)
    }catch(e){
        console.log(e)
        res.status(422).json({error: 'No se pudo completar la accion'});
    }
})

router.post('/getTaskByMachine', verifyToken, async (req, res) => {
    try{
        var ts = [];
        const machine = await Machine.findOne({where: {
            id: req.body.id
        }})
        const assigns = await AssignMachine.findAll({where: {
            machineId: machine.id
        }})
        for(var i = 0; i < assigns.length; i++){
            var info = {};
            const tasks = await Task.findAll({where: {
                id: assigns[i].taskId
            }})
            for(var j = 0; j < tasks.length; j++){
                const ouvre = await Ouvre.findOne({where: {
                    id: tasks[j].ouvreId
                }})
            info.taskName = tasks[j].taskName;
            info.taskDate = tasks[j].taskStartDate;
            info.ouvreName = ouvre.ouvreName;
            ts.push(info);
            }
        }
        machine.dataValues.Tasks = ts;
        res.status(200).json({machine: machine})
    }catch(e){
        console.log(e)
        res.status(422).json({error: 'No se pudo completar la accion'});
    }
})

export default router
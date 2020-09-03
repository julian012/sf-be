import {Router} from 'express'
import Ouvre from "../../models/ouvre";
import Schedule from "../../models/schedule"
import {verifyToken, verifyForm, Op, generateRandonId, getActualDateWithTime, getActualDate} from '../utils/utils'

const router = Router()

router.get('/', verifyToken, async (req, res) => {
    try {
        const schedules = await Schedule.findAll();
        res.status(200).json(schedules)
    } catch (e) {
        console.log(e)
        res.status(422).json({
            message: 'error'
        })
    }
})

router.get('/getUserSchedule', verifyToken, async(req, res) => {
    try{
        const schedules = await Schedule.findAll({
            where:{
                userId: req.query.userId
            }
        })
        res.status(200).json(schedules)
    }catch(e){
        console.log(e)
        res.status(422).json({
            message: 'error'
        })
    }
})

router.post('/addSchedule', verifyToken, async(req, res) => {
    try{
        var errors = await verifyForm(req.body, 'schedule')
        var values = Object.values(errors.errors)
        if(values.length > 0){
            res.status(422).send(values)
        }else{
            const s = req.body
            const ouvre = await Ouvre.findOne({
                    where:{
                        ouvreToken: s.ouvreToken
                    }
                }
            )
            s.ouvreId = ouvre.dataValues.id
            s.id = generateRandonId()
            s.scheduleDate = getActualDateWithTime()

            const userSchedule = await Schedule.findAll({
                where:{
                    ouvreId: s.ouvreId,
                    userId: s.userId
                }
            })

            var j = 0
            
            for (let i = 0; i < userSchedule.length; i++) {
                const element = userSchedule[i].dataValues;
                if(element.scheduleDate.toISOString().split('T')[0] === getActualDate()){
                    j++
                }                
            }

            console.log(j)

            switch(j){
                case 0:
                    s.dayTime = 'MORNING'
                    break
                case 1:
                    s.dayTime = 'HALF_DAY'
                    break;
                case 2:
                    s.dayTime = 'AFTERNOON'
                    break;    
                case 3:
                    s.dayTime = 'NIGHT'
                    break;    
                default:
                    s.dayTime = 'COMPLETE_JOURNEY'
                    break;    
            }

            if(s.dayTime != 'COMPLETE_JOURNEY'){
                const schedule = await Schedule.create(s)
                if(!schedule) throw new Error()
                schedule.dataValues.dayTime = s.dayTime
                schedule.dataValues.ouvreId = ouvre.id
                schedule.dataValues.ouvreName = ouvre.ouvreName
                res.status(200).json(schedule)
            }else{
                res.status(422).json({
                    message: 'Registros del dia completos'
                })
            }
        }
    }catch(e){
        console.log(e)
        res.status(422).json({
            message: 'error'
        })
    }
})

export default router
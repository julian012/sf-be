import {Router} from 'express'
import Ouvre from "../../models/ouvre";
import Schedule from "../../models/schedule"
import {verifyToken, verifyForm, Op, generateRandonId, getActualDate} from '../utils/utils'

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
            s.scheduleDate = getActualDate()
            const schedule = await Schedule.create(s)
            if(!schedule) throw new Error()
            res.status(200).json(schedule)
        }
    }catch(e){
        console.log(e)
        res.status(422).json({
            message: 'error'
        })
    }
})

export default router
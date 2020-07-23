import {Router} from 'express';
import User from "../../models/user";
import { comparePassword, encryptPassword, generateToken } from '../utils/utils'


const router = Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users)
    } catch (e) {
        res.status(422).json({
            message: 'error'
        })
    }
})

router.post('/regUser', async (req, res) => {
    try {
        const {
            doc_type, doc_number, user_rol, user_name,
            user_phone, user_mail, user_password
        } = await req.body;
        const password = await encryptPassword(user_password)
        const user = await User.create({
            docType: doc_type,
            userNumber: doc_number,
            userRol: user_rol,
            userName: user_name,
            userPhone: user_phone,
            userMail: user_mail,
            userPassword: password
        })
        if(!user) throw new Error()
        res.status(200).json({ token: generateToken(user.id, user.userMail)})
    } catch (e) {
        console.log(e)
        res.status(422).send({errors: {email: 'Ocurrio un problema con el registro'}})
    }
})

router.post('/changePass', async (req, res) => {
    try {
        const { user_mail, current_pass, new_pass } = await req.body;
        const user = await User.update(
            {
                userPassword: new_pass
            },{
                where: {
                    userMail: user_mail,
                    userPassword: current_pass
                }
            })
        if (user[0] === 0) throw new Error();
        res.sendStatus(200)

    } catch (e) {
        console.log(e.message)
        res.status(422).send({errors: {email: 'Datos Incorrectos'}})
    }
})

router.post('/login', async (req, res) => {
    try {
        const {user_mail, user_password} = await req.body;
        const user = await User.findOne({where: {userMail: user_mail }});

        if (!user && !await comparePassword(user_password, user.userPassword)) throw new Error();
        res.status(200).json({ token: await generateToken(user.id, user.userMail)})
    } catch (e) {
        res.status(422).send({errors: {email: 'Datos Incorrectos'}})
    }
})

export default router

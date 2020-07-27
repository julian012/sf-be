import {Router} from 'express';
import User from "../../models/user";
import { comparePassword, encryptPassword, decryptPassword, generateToken, verifyToken, sendEmail } from '../utils/utils'

const router = Router();

router.get('/', verifyToken, async (req, res) => {
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
        const { user_mail, current_password, new_password } = await req.body;
        const user = await User.findOne({where:{userMail: user_mail}})

        if(user != null){
            const pass = decryptPassword(user.userPassword)
            user.update(
                { userPassword: await encryptPassword(new_password) },
                { where: {
                    pass: current_password
                }}
            )
            res.status(200).json(user_mail)
        }
    } catch (e) {
        console.log(e.message)
        res.status(422).send({errors: {email: 'Datos Incorrectos'}})
    }
})

router.post('/login', async (req, res) => {
    try {
        const {user_mail, user_password} = await req.body;
        const user = await User.findOne({where: {userMail: user_mail }});
        if (user && await comparePassword(user_password, user.userPassword)){
            res.status(200).json({ token: await generateToken(user.id, user.userMail)}) 
        }else{
            throw new Error();
        }
    } catch (e) {
        res.status(422).send({errors: {email: 'Datos Incorrectos'}})
    }
});

router.post('/recoverPass', async (req, res) => {
    try{
        const {user_mail} = await req.body;
        const user = await User.findOne({where: {userMail: user_mail}});
        if(user){
            await sendEmail(user.userMail, user.id, res);
        }
        res.status(200).json("Correo enviado") 
    }catch (e){
        res.status(422).send({errors: {message:'Email no exite en la base de datos'}})
    }
});

router.post('/changePassword', verifyToken, async (req, res) => {
    const password = await encryptPassword(req.body.newPassword)
    try {
        const { user_mail, current_password, new_password } = await req.body;
        const user = await User.findOne({where:{userMail: user_mail}})

        if(user != null){
            const pass = decryptPassword(user.userPassword)
            user.update(
                { userPassword: await encryptPassword(new_password) },
                { where: {
                    pass: current_password
                }}
            )
            res.status(200).json(user_mail)
        }
    } catch (e) {
        console.log(e);
        res.status(422).send({errors: {email: 'Datos Incorrectos'}})
    }
})


router.post('/deleteUser', async(req, res) => {
    try{
        const {user_mail} = await req.body;
        await User.destroy({
            where: {
                userMail: user_mail
            }
        })
    }catch(e){
        res.status(422).send({errors: {email: 'Usuario no encontrado'}})
    }
})


export default router
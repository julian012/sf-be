import {Router} from 'express';
import User from "../../models/user";
<<<<<<< HEAD
import { comparePassword, encryptPassword, generateToken, verifyToken, sendEmail } from '../utils/utils'
=======
import { comparePassword, encryptPassword, decryptPassword, generateToken, verifyToken } from '../utils/utils'

>>>>>>> 1ebadaa60a5b45cda88f5dd438d361c74736c6fa

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

router.post('/changePass', verifyToken, async (req, res) => {
    try {
<<<<<<< HEAD
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
=======
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

>>>>>>> 1ebadaa60a5b45cda88f5dd438d361c74736c6fa
    } catch (e) {
        console.log(e.message)
        res.status(422).send({errors: {email: 'Datos Incorrectos'}})
    }
})

router.post('/login', async (req, res) => {
    try {
        const {user_mail, user_password} = await req.body;
        const user = await User.findOne({where: {userMail: user_mail }});
<<<<<<< HEAD
        if (!user && !await comparePassword(user_password, user.userPassword)) throw new Error();
        res.status(200).json({ token: await generateToken(user.id, user.userMail)})
=======

        if (user && await comparePassword(user_password, user.userPassword)){
            res.status(200).json({ token: await generateToken(user.id, user.userMail)}) 
        }else{
            throw new Error();
        }
        
>>>>>>> 1ebadaa60a5b45cda88f5dd438d361c74736c6fa
    } catch (e) {
        res.status(422).send({errors: {email: 'Datos Incorrectos'}})
    }
});

router.post('/recoverPass', async (req, res) => {
    try{
        const {user_mail} = await req.body;
        const user = await User.findOne({where: {userMail: user_mail}});
        if(user){
            await sendEmail(user.userMail, res);
        }
    }catch (e){
        console.log(e);
        res.status(422).send({errors: {message:'Email no exite en la base de datos'}})
    }
});

router.post('/recoverPassword', async (req, res) => {
    try{
        const {user_mail} = await req.body;
        const mail = await User.findOne(
            {
                where: {
                    userMail: user_mail
                }
            }
        )
        if(mail === null){
            res.status(422).send({errors: {email: 'El correo no esta registrado'}})
        }else{
            res.status(200).json(user_mail)
        }
    }catch(e){
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

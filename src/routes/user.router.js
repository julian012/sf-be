import {Router} from 'express';
import User from "../../models/user";
import { comparePassword, encryptPassword, decryptPassword, generateToken, verifyToken, sendEmail, verifyForm } from '../utils/utils'

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
            docType, userNumber, userRol, userName,
            userPhone, userMail, userPassword
        } = await req.body;
        var errors = await verifyForm(req.body, 'user');
        var values = Object.values(errors.errors);
        if(values.length > 0){
            res.status(422).send(values);
        }else{
            const password = await encryptPassword(userPassword)
            const user = await User.create({
                docType: docType,
                userNumber: userNumber,
                userRol: userRol,
                userName: userName,
                userPhone: userPhone,
                userMail: userMail,
                userPassword: password
            })
            if(!user) throw new Error()
            res.status(200).json({message: 'Usuario Creado'})
        }       
    } catch (e) {
        console.log(e)
        res.status(422).send(errors)
    }
})

router.post('/changePass', async (req, res) => {
    try {
        const { userMail, currentPassword, newPassword } = await req.body;
        const user = await User.findOne({where:{userMail: userMail}})
        if(user != null){
            const pass = decryptPassword(user.userPassword)
            user.update(
                { userPassword: await encryptPassword(newPassword) },
                { where: {
                    pass: currentPassword
                }}
            )
            res.status(200).json(userMail)
        }
    } catch (e) {
        console.log(e.message)
        res.status(422).send({errors: {email: 'Datos Incorrectos'}})
    }
})

router.post('/login', async (req, res) => {
    try {
        const {userMail, userPassword} = await req.body;
        const user = await User.findOne({where: {userMail: userMail }});
        if (user && await comparePassword(userPassword, user.userPassword)){
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
        const {userMail} = await req.body;
        const user = await User.findOne({where: {userMail: userMail}});
        if(user){
            await sendEmail(user.userMail, user.id, res);
        }
        res.status(200).json("Correo enviado") 
    }catch (e){
        res.status(422).send({errors: {message:'Email no exite en la base de datos'}})
    }
});

router.post('/verifyToken', verifyToken, async (req, res) => {
    try{
        const user = await User.findOne({where: {
            userMail: req.userMail
        }})
        res.status(200).json({userName: user.userName, userMail: user.userMail});
    }catch(e){
        res.status(422).send({errors: {email: 'Datos Incorrectos'}});
    }
})

router.post('/changePassword', async (req, res) => {
    const password = await encryptPassword(req.body.newPassword)
    try {
        const user = await User.update({userPassword: password}, 
                                {where:{userMail: req.body.userMail}}); 
        res.status(200).json({message: 'Contraseña actualizada correctamente'});     
    } catch (e) {
        res.status(422).send({errors: {email: 'Datos Incorrectos'}})
    }
})

router.post('/deleteUser', async(req, res) => {
    try{
        const {userMail} = await req.body;
        await User.destroy({
            where: {
                userMail: userMail
            }
        })
    }catch(e){
        res.status(422).send({errors: {email: 'Usuario no encontrado'}})
    }
})

router.get('/getUserDirector', verifyToken, async(req, res) => {
    try{
        const users = await User.findAll({where: {userRol: 'DIRECTOR'}});
        res.status(200).json({users: users});
    }catch(e){
        res.status(422).send({message: 'No se puedo completar la accion'})
    }
});

export default router
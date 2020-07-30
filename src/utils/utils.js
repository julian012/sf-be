import jwt from 'jsonwebtoken'
import config from "../../config/config";
import NodeMailer from 'nodemailer';
import Validator from 'validatorjs';
import * as constants from './rules_constants'

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

export async function verifyForm(data, type){
    var validator 
    switch(type){
        case 'user':
            validator = new Validator(data, constants.USER_RULES, constants.MESSAGE_ERRORS);
            break
        case 'ouvre':
            validator = new Validator(data, constants.OUVRE_RULES, constants.MESSAGE_ERRORS);
            break
        case 'task':
            validator = new Validator(data, constants.TASK_RULES, constants.MESSAGE_ERRORS);
            break    
    }
    validator.passes()
    return validator.errors
}

export async function encryptPassword(password) {
    return cryptr.encrypt(password)
}

export async function decryptPassword(password) {
    return cryptr.decrypt(password)
}

export async function comparePassword(password, passwordSave) {
    if(password === cryptr.decrypt(passwordSave)){
        return true
    }else{
        return false
    }
}

export async function generateToken(id, userMail) {
    return jwt.sign({ id, userMail }, config.jwtSecret, { expiresIn: 86400 } )
}

export function verifyToken(req, res, next) {
    if (!req.headers.authorization) return res.status(401).send('Unthorize Request')
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).send('Unthorize Request')
    const payload = jwt.verify(token, config.jwtSecret)
    req.userId = payload.id
    req.userMail = payload.userMail
    next()
}

export async function sendEmail(mail, id,res){
    var token = await generateToken(id, mail);
    var transporter = NodeMailer.createTransport({
        service: "Gmail",
        auth: {
            user: "sfconstructora01@gmail.com",
            pass: "construSF"
        }
    });
    var mailOptions = {
        from: "S&F App",
        to: mail,
        subject: "Recuperacion de contraseña",
        html: "<a href= https://dev-sf.netlify.app/pass-reset/" + token + "> Recupera tu contraseña </a>"
    }
    transporter.sendMail(mailOptions, (err, info) => {
        res.status(200).json({message: 'Enviado'});
    });
}

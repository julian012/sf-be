import jwt from 'jsonwebtoken'
import config from "../../config/config";
import NodeMailer from 'nodemailer';
import Validator from 'validatorjs';

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

let rules = {
    docType: 'required|string',
    userNumber: 'required|string',
    userRol: 'required|string',
    userName: 'required|string',
    userPhone: 'required|string',
    userMail: 'email',
    userPassword: 'required|string'
}

let errorsMessages = {
    required: ':attribute: Este campo es obligatorio',
    email: ':attribute: Email no valido'
}

export async function verifyForm(data){
    let validation = new Validator(data, rules, errorsMessages);
    validation.passes();
    return validation.errors;
}

export async function encryptPassword(password) {
    //return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    return cryptr.encrypt(password)
}

export async function decryptPassword(password) {
    //return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    return cryptr.decrypt(password)
}

export async function comparePassword(password, passwordSave) {
    //return bcrypt.compareSync(password, passwordSave);
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

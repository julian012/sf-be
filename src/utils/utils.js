import jwt from 'jsonwebtoken'
import config from "../../config/config";
import NodeMailer from 'nodemailer';

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

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
    next()
}

export function sendEmail(mail, res){
    var transporter = NodeMailer.createTransport({
        service: "Gmail",
        auth: {
            user: "sfconstructora01@gmail.com",
            pass: "construSF"
        }
    });
    var mailOptions = {
        from: "Remitente",
        to: mail,
        subject: "enviado desde nodemailer",
        text: "Hola Mundo"
    }
    transporter.sendMail(mailOptions, (err, info) => {
         res.status(200).json({message: 'Enviado'});
    });
}

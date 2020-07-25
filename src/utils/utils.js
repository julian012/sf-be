import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import config from "../../config/config";
import NodeMailer from 'nodemailer';

export async function encryptPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export async function comparePassword(password, passwordSave) {
    return bcrypt.compareSync(password, passwordSave);
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
    req.mail = payload.userMail
    next()
}

export async function sendEmail(mail, id, res){
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
        html: "<head><title>Recuperación Contraseña S&F App</title></head><body><h2> direccionprueba.com/recoverPass/" + 
        token +"</h2></body>"
    }
    transporter.sendMail(mailOptions, (err, info) => {
        res.status(200).json({message: 'Enviado'});
    });
}
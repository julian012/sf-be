import jwt from 'jsonwebtoken'
import config from "../../config/config";
import NodeMailer from 'nodemailer';
import Validator from 'validatorjs';
import * as constants from './rules_constants'

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

const {Sequelize} = require('sequelize');
export const Op = Sequelize.Op

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
        case 'typeMaterial':
            validator = new Validator(data, constants.TYPE_MATERIAL_RULES, constants.MESSAGE_ERRORS);
            break
        case 'typeMachine':
            validator = new Validator(data, constants.TYPE_MACHINE_RULES, constants.MESSAGE_ERRORS);
            break
        case 'material':
            validator = new Validator(data, constants.MATERIAL_RULES, constants.MESSAGE_ERRORS);
            break
        case 'machine':
            validator = new Validator(data, constants.MACHINE_RULES, constants.MESSAGE_ERRORS);
            break
        case 'assignMaterial':
            validator = new Validator(data, constants.ASSIGN_MATERIAL_RULES, constants.MESSAGE_ERRORS);
            break
        case 'assignMachine':
            validator = new Validator(data, constants.ASSIGN_MACHINE_RULES, constants.MESSAGE_ERRORS);
            break
        case 'schedule':
            validator = new Validator(data, constants.SCHEDULE_RULES, constants.MESSAGE_ERRORS)
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
    return jwt.sign({ id, userMail }, config.jwtSecret, { expiresIn: 7844000000 } )
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

export function getActualDate(){
    var currentdate = new Date(); 
    var datetime = currentdate.getFullYear() + "-"
                + getMonth((currentdate.getMonth()+1))  + "-" 
                + getMonth(currentdate.getDate())
    return datetime
}

function getMonth(month){
    if(month < 10){
        return "0" + month
    }else{
        month
    }
}

export function diff_hours(dt2, dt1) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
  
 }

export function getActualDateWithTime(){
    var currentdate = new Date(); 
    var datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "+00";
    return datetime
}

export function generateRandonId(){
    return Math.floor(Math.random() * (+2000 - +1)) + +1; 
}

export function generateRandomToken(){
    return Math.random().toString(36).substr(2);
}

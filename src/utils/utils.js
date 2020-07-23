import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import config from "../../config/config";

export async function encryptPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export async function comparePassword(password, passwordSave) {
    return bcrypt.compareSync(password, passwordSave);
}

export async function generateToken(id, userMail) {
    return jwt.sign({ id, userMail }, config.jwtSecret, { expiresIn: 86400 } )
}

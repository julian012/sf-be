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

export function verifyToken(req, res, next) {
    if (!req.headers.authorization) return res.status(401).send('Unthorize Request')
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).send('Unthorize Request')
    const payload = jwt.verify(token, config.jwtSecret)
    req.userId = payload.id
    next()
}

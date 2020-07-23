var express = require('express');
var router = express.Router();
var client = require('../connection/Connection');
var bcrypt = require('bcrypt');
var BCRYPT_SALT_ROUNDS = 2;

//------------------------------------Obtener todos los usuarios----------------------------------------

router.get('/', (req, res) =>{
    client.query('SELECT * FROM "user"', (err, results) => {
        if (err) {
          res.status(401).json({ message : `${err.message}`});
        }else if(results.rows.length == 0){
            res.status(404).json({ message : `No se ha agregado ningun usuario`});
        }else{
            res.status(200).json(results.rows);
        }
    });
});

//-------------------------------------------------Login--------------------------------------------------

router.post('/login', (req, res) => {
    var response = verifyLogIn(req, res);
    if(response = 200){
        res.status(200).json({message: `correcto`});
    }else{
        res.status(403).json({message: `contraseña incorrecta`});
    }
});

async function encryptPassLogIn(req, res, pass){
    const match = await bcrypt.compare(req.body.user_password ,pass);
    if(match){
        return 200;
    }else{
        return 403;
    }
}

function verifyLogIn(req, res){
    let{user_mail} = req.body;
    client.query('SELECT user_password FROM "user" WHERE user_mail = $1', [user_mail], (err, results) => {
        if(err){
			res.status(403).json({message: `${err.message}`});
		}else if(results.rowCount == 0) {
			res.status(403).json({ message : `email no valido`});
		}else{
            var passwordDb = results.rows[0].user_password;
            return encryptPassLogIn(req, res, passwordDb);
        }
    });  
}

//------------------------------------Agregar usuario---------------------------------------------

router.post('/add', (req, res) =>{ 
    encryptPassAdd(req, res);    
}); 

async function encryptPassAdd(req, res){
    var pass = await bcrypt.hash(req.body.user_password, BCRYPT_SALT_ROUNDS);
    saveUser(req, res, pass);
}

function saveUser(req, res, pass){
    let{doc_type, user_rol, user_name, user_mail, user_document} = req.body;  
    client.query('INSERT INTO "user" (doc_type, user_rol, user_name, user_mail, user_password, user_document) values ($1, $2, $3, $4, $5, $6)', [doc_type, user_rol, user_name, user_mail, pass, user_document],  (err, rows) => {
		if(err){
			res.status(403).json({ message : `${err.message}`});
		}else {
			res.status(200).json({ message : `usuario agregado correctamente: ${user_name}`});
		}
    });
}

//----------------------------------------Cambiar contraseña--------------------------------------

router.post('/updatePassword', (req, res) => {
    var response = verifyLogIn(req, res);
    if(response = 200){
        updatePasswordUser(req, res);
    }else {
        res.status(403).json({ message : `contraseña antigua no valida`});
    }
})

async function updatePasswordUser(req, res){
    let{user_mail} = req.body;
    var pass = await bcrypt.hash(req.body.user_new_password, BCRYPT_SALT_ROUNDS);
    client.query('UPDATE "user" set user_password = $2 where user_mail = $1', [user_mail, pass], (err, rows) => {
        if(err){
			res.status(403).json({ message : `${err.message}`});
		}else {
			res.status(200).json({ message : `contraseña actualizada correctamente: ${user_mail}`});
		}
    });
}

module.exports = router;
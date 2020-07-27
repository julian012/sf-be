# Constructora S&F

### Base url: https://constructora-sf.herokuapp.com/

### Registrar usuario
- Ruta: ``user/registryUser``
    - Entradas:  
         ``{"doc_type": "CC", 
            "doc_number": "123456789", 
            "user_rol": "ADMIN", 
            "user_name": "Manuel Celis",
            "user_mail": "manuelcelisforero@gmail.com",
            "user_password": "a123",
            "user_phone": "3212142066"}``
    - Salida:  
        ``Status: 200 Cuando existe`` ``Status: 404 Cuando NO existe``  
    
### Iniciar sesión
- Ruta: ``user/login``
    - Entradas:  
         ``{"user_mail": "manuelcelisforero@gmail.com", 
            "user_password": "a123"}``
    - Salida:  
        ``{"token": "user_token_id"}`` ``Status: 404 Cuando NO existe``  
    
### Cambiar contraseña
*Requiere token de acceso*
- Ruta: ``user/changePassword``
    - Entradas:  
         ``{"user_mail": "manuelcelisforero@gmail.com", 
            "current_password": "a123",
            "new_password: "a1234"}``
    - Salida:  
        ``Status: 200 Cuando la operación fue exitosa`` ``Status: 404 Cuando algo salio mal``
    
### Recuperar contraseña
*WIP*
- Ruta: ``user/recoverPassword``
    - Entradas:  
         ``{"user_mail": "manuelcelisforero@gmail.com"}``
    - Salida:  
        ``Status: 200 Cuando la operación fue exitosa`` ``Status: 404 Cuando algo salio mal``    
    

# Constructora S&F

### Base url: https://constructora-sf.herokuapp.com/

##################### Modulo Usuarios ########################

### Registrar usuario
- Ruta: ``user/regUser``
    - Entradas:  
         ``{"docType": "CC", 
            "docNumber": "123456789", 
            "userRol": "ADMIN", 
            "userName": "Manuel Celis",
            "userMail": "manuelcelisforero@gmail.com",
            "userPassword": "a123",
            "userPhone": "3212142066"}``
    - Salida:  
        ``Status: 200 Cuando fue creado correctamente`` ``Status: 422 Cuando no se pudo completa la accion``  
    
### Iniciar sesión
- Ruta: ``user/login``
    - Entradas:  
         ``{"userMail": "jairoalzate1998@gmail.com", 
            "userPassword": "a123"}``
    - Salida:  
        ``Status: 200 Cuando se completa la accion y un json {token: 'userToken'}`` ``Status: 422 Cuando no se pudo completa la accion``  
    
### Cambiar contraseña

*Requiere token de acceso*
- Ruta: ``user/changePass``
    - Entradas:  
         ``{"userMail": "jairoalzate1998@gmail.com", 
            "currentPassword": "a123",
            "newPassword: "a1234"}``
    - Salida:  
        ``Status: 200 Cuando la operación fue exitosa`` ``Status: 422 Cuando algo salio mal``
    
### Recuperar contraseña

*WIP*
- Ruta: ``user/recoverPass``
    - Entradas:  
         ``{"userMail": "jairoalzate1998@gmail.com"}``
    - Salida:  
        ``Status: 200 Cuando la operación fue exitosa`` ``Status: 422 Cuando algo salio mal``    

### Verificar token recuperar contraseña

- Ruta: ``user/verifytoken``
    - Entradas:
        El token respectivo
    - Salida:
        ``Status: 200 Cuando la operación fue exitosa y un json {'userName': nameUser,  'userMail': userMail}`` ``Status: 401 Cuando el token es invalido`` ``Status: 422 Cuando ocurre un error en la bd``
    
### Cambio de contraseña al recuperar contraseña

- Ruta: ``user/changePassword``
    - Entradas: 
        ``{"userMail": "jairoalzate1998@gmail.com", "newPassword": "a1234"}``
    - Salida:
        ``Status: 200 Cuando la operacion fue exitosa`` ``Status: 422 Cuando la operacion no se completo``

##################### Modulo Obras ########################

### Obtener todas las obras

- Ruta: ``ouvre/``
    - Entradas: 
        el token respectivo
    - Salidas:
         ``Status: 200 Cuando la operacion fue exitosa mas json {'ouvres': ouvres}`` ``Status: 422 Cuando la operacion no se completo``

### Obtener todas las obras

- Ruta: ``ouvre/addOuvre``
    - Entradas:
        el token respectivo
        ``{"ouvreName": ouvreName, "ouvreDirection": ouvreDirection, "ouvreStartDate": ouvreStartDate, "ouvreEndDate": ouvreEndDate(null), "statusOuvre": statusOuvre, "userId": userId}``
    - Salida: 
        ``Status: 200 Cuando la operacion fue exitosa `` ``Status: 422 Cuando la operacion no se completo``

### Obtener una obra

    - Entradas:
        el respectivo token
        ``{"id": id}``
    - Salida: 
        ``Status: 200 Cuando la operacion fue exitosa mas json {'ouvre': ouvre}`` ``Status: 422 Cuando la operacion no se completo``

##################### Modulo Actividades ########################

### Obtener todas las Actividades

- Ruta: ``task/``
    - Entradas: 
        el token respectivo
    - Salidas:
         ``Status: 200 Cuando la operacion fue exitosa mas json {'taks': taks}`` ``Status: 422 Cuando la operacion no se completo``

### Agregar Actividades

- Ruta: ``ouvre/addTask``
    - Entradas:
        el token respectivo
        ``{"taskDescription": taskDescription, "taskStartDate": taskStartDate, "taskEndDate": taskEndDate(null), "taskState": taskState, "ouvreId": ouvreId}``
    - Salida: 
        ``Status: 200 Cuando la operacion fue exitosa `` ``Status: 422 Cuando la operacion no se completo``

### Obtener una Actividad

    - Entradas:
        el respectivo token
        ``{"id": id}``
    - Salida: 
        ``Status: 200 Cuando la operacion fue exitosa mas json {'task': task}`` ``Status: 422 Cuando la operacion no se completo``









### Foreign key ###

alter table "Tasks"
  add constraint tak_fk_ido
  foreign key ("ouvreId")
  references "Ouvres" ("id");

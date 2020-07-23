# Constructora S&F

Base url: https://constructora-sf.herokuapp.com/

- Registrar usuario
``user/registryUser``
Entradas: 
    ``{"doc_type": "CC", 
       "doc_number": "123456789", 
       "user_rol": "ADMIN", 
       "user_name": "Manuel Celis",
       "user_mail": "manuelcelisforero@gmail.com",
       "user_password": "a123",
       "user_phone": "3212142066"}``
Salida:
    ``Status: 200 Cuando existe``
    
    ``Status: 404 Cuando NO existe``

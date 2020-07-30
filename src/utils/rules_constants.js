export const USER_RULES = {
    docType: 'required|string',
    userNumber: 'required|string',
    userRol: 'required|string',
    userName: 'required|string',
    userPhone: 'required|string',
    userMail: 'email',
    userPassword: 'string'
}

export const OUVRE_RULES = {
    ouvreName: 'required|string',
    ouvreDirection: 'required|string',
    ouvreStartDate: 'required|date',
    ouvreEndDate: 'date',
    userId: 'integer'
}

export const TASK_RULES = {
    taskName: 'required|string',
    taskDescription: 'required|string',
    taskStartDate: 'required|date',
    taskEndDate: 'date',
    ouvreId: 'required|integer'
}

export const MESSAGE_ERRORS = {
    required: ':attribute: Este campo es obligatorio',
    email: ':attribute: Email no valido'
}
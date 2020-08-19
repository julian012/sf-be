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
    email: ':attribute: Email no valido',
    string: ':attribute: Este campo es de tipo String',
    date: ':attribute: Este campo es de tipo date',
    integer: ':attribute: Este campo es de tipo integer'
}

export const TYPE_MATERIAL_RULES = {
    typeMaterialName: 'required|string',
    measurement: 'required|string'
}

export const TYPE_MACHINE_RULES = {
    nameTypeMachine: 'required|string',
    machineHourValue: 'required|integer'
}

export const MACHINE_RULES = {
    machinePlate: 'required|string',
    typeMachineId: 'required|integer',
    userId: 'required|integer'
}

export const MATERIAL_RULES = {
    materialName: 'required|string',
    materialRegistryDate: 'required|date',
    materialQuantity: 'required|integer',
    materialAvaliable: 'required|integer',
    materialPrice: 'required|integer',
    userId: 'required|integer',
    typeMaterialId: 'required|integer'
}

export const ASSIGN_MATERIAL_RULES = {
    ouvreId: 'required|integer',
    materialId: 'required|integer',
    quantityUsed: 'required|integer'
}

export const ASSIGN_MACHINE_RULES = {
    machineId: 'required|integer',
    taskId: 'required|integer',
    assignStartDate: 'required|date',
    assignEndDate: 'required|date',
    standbyPrice: 'required|integer',
    workerdHours: 'required|integer'
}
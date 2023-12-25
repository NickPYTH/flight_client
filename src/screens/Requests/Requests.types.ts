export type RequestsGridType = {
    "id": string,
    "year": string,
    "docNum": string,
    "docDate": string,
    "flyDateStart": string,
    "flyDateFinish": string,
    "aircraftTypeName": string,
    "flightTargetName": string,
    "stateName": string,
    "duration": string,
    "durationOut": string,
    "roundDigit": string,
    "cost": string,
    "costOut": string,
    "empCustomerName": string,
    "docCode": string,
    "rejectNote": string,
    "note": string,
    "aircraftModelName": string,
    "airlineName": string,
    "docName": string,
}

export type RequestRoutesGridType = {
    workType: string,
    workTypeId?:string,
    employee: string,
    employeeId?: string,
    dateTime: string,
    airportDeparture: string,
    airportDepartureId?: string,
    airportArrival: string,
    airportArrivalId?: string,
    passengerCount: string,
    cargoWeightMount: string,
    cargoWeightIn: string,
    cargoWeightOut: string,
    routeId: string,
    id: string,
    idFlightFilial: string,
    idFuelPoint: string
}

export type RequestData = {
    aircraftModelName: string,
    aircraftTypeName: string,
    airlineName: string,
    cost: number,
    costOut: number,
    docCode: string,
    docDate: string,
    docName: string,
    docNum: string,
    duration: number,
    durationOut: number,
    empCustomerName: string,
    empCustomerLastName: string,
    empCustomerSecondName: string,
    flightTargetName: string,
    flyDateFinish: string,
    flyDateStart: string,
    id: string,
    note: string,
    rejectNote: string,
    roundDigit: number,
    stateName: string,
    year: string,
    routes: RequestRoutesGridType[],
    factRoutes: RequestRoutesGridType[]
}

export type UpdateRequest = {
    id: string,
    field: string,
    value?: string,
    dateStart?: string,
    dateFinish?: string,
    aircraftModelId?: string;
}

export type RequestHistoryGridType = {
    id: string,
    employee: string,
    date: string,
    field: string,
    newValue: string,
    oldValue: string,
    action: string,
}

export type CostRequest = {
    requestId: string,
    filialId: string,
    workTypeId: string,
    duration: number,
    cost: number,
    costId: string
}

export type CostGridType = {
    requestId: string,
    id: string,
    filialName: string,
    workTypeName: string,
    duration: string,
    cost: string,
}



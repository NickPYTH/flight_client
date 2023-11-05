export type RequestsByFilialsGridType = {
    id: number,
    createDate: string,
    nameFilial: string,
    nameState: string
}

export type RequestRoutesGridType = {
    workType: string,
    employee: string,
    dateTime: string,
    airportDeparture: string,
    airportArrival: string,
    passengerCount: string,
    cargoWeightMount: string,
    cargoWeightIn: string,
    cargoWeightOut: string,
    id: string,
}

export type RequestData = {
    id: string,
    idFilial: string,
    idRequestFile: string,
    idState: string,
    nameState: string,
    createDate: string,
    rejectNote: string,
    routes: RequestRoutesGridType[]
}
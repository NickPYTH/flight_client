export type RequestsByFilialsGridType = {
    id: number,
    createDate: string,
    nameFilial: string,
    nameState: string
}

export type RequestRoutesGridType = {
    workType: string,
    workTypeId?: number | undefined,
    employee: string,
    employeeId?: number | undefined,
    dateTime: string,
    airportDeparture: string,
    airportDepartureId?: number | undefined,
    airportArrival: string,
    airportArrivalId?: number | undefined,
    passengerCount: string,
    cargoWeightMount: string,
    cargoWeightIn: string,
    cargoWeightOut: string,
    routeId: string,
    id: string,
}

export type RequestData = {
    id: string,
    idFilial: string,
    idRequestFile: number,
    nameRequestFile: string,
    idState: string,
    nameState: string,
    createDate: string,
    rejectNote: string,
    routes: RequestRoutesGridType[]
}

export type CreateRequestFilialType = {
    idFilial: string,
    fileName?: string,
    file?: string,
    routes: RequestRoutesGridType[],
}
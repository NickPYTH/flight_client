export type RequestsGridType = {
    "id": string,
    "airlineName": string,
    "airlineId": string,
    "workTypeName": string,
    "workTypeId": string,
    "date": string,
    "flyDateStart": string,
    "flyDateFinish": string,
}

export type RequestRoutesGridType = {
    workType: string,
    workTypeId?: string,
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



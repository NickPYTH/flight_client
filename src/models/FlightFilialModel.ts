export interface FlightFilialModel {
    id: number,
    routeId: number,
    flyDate: string,
    idAirportArrival: number,
    idAirportDeparture: number,
    passengerCount: number,
    cargoWeightIn: number,
    cargoWeightOut: number,
    cargoWeightMount: number
}
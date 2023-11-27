export interface FlightFilialModel {
    idRequestFilial?: string,
    id?: number,
    idRoute?: number,
    idWorkType: number,
    flyDate: string,
    idAirportArrival: number,
    idEmpResp?: number;
    idAirportDeparture: number,
    passengerCount: number,
    cargoWeightIn: number,
    cargoWeightOut: number,
    cargoWeightMount: number
}
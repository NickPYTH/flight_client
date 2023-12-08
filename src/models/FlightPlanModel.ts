export interface FlightPlanModel {
    id?: number,
    idRoute?:string,
    idRequest: string,
    idFuelPoint: string,
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
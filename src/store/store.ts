import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from './reducers/UserSlice'
import {requestsByFilialsAPI} from "../services/RequestFilialService";
import {filialsAPI} from "../services/FilialsService";
import {workTypesAPI} from "../services/WorkTypesService";
import {airportsAPI} from "../services/AirportsService";
import {employeeResponsibleAPI} from "../services/EmployeeResponsibleService";
import {flightFilialAPI} from "../services/FlightFilialService";
import {requestAPI} from "../services/RequestService";
import {aircraftModelAPI} from "../services/AircraftModelService";
import {flightTargetAPI} from "../services/FlightTargetService";
import {empCustomerAPI} from "../services/EmpCustomerService";
import {flightPlanAPI} from "../services/FlightPlanService";
import {fileStorageAPI} from "../services/FileStorageService";
import {requestHelicopterAPI} from "../services/RequestHelicopterService";
import {airlinesAPI} from "../services/AirlineService";

const rootReducer = combineReducers({
    userReducer,
    [requestsByFilialsAPI.reducerPath]: requestsByFilialsAPI.reducer,
    [filialsAPI.reducerPath]: filialsAPI.reducer,
    [workTypesAPI.reducerPath]: workTypesAPI.reducer,
    [airportsAPI.reducerPath]: airportsAPI.reducer,
    [employeeResponsibleAPI.reducerPath]: employeeResponsibleAPI.reducer,
    [flightFilialAPI.reducerPath]: flightFilialAPI.reducer,
    [requestAPI.reducerPath]: requestAPI.reducer,
    [aircraftModelAPI.reducerPath]: aircraftModelAPI.reducer,
    [flightTargetAPI.reducerPath]: flightTargetAPI.reducer,
    [empCustomerAPI.reducerPath]: empCustomerAPI.reducer,
    [flightPlanAPI.reducerPath]: flightPlanAPI.reducer,
    [fileStorageAPI.reducerPath]: fileStorageAPI.reducer,
    [requestHelicopterAPI.reducerPath]: requestHelicopterAPI.reducer,
    [airlinesAPI.reducerPath]: airlinesAPI.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(requestsByFilialsAPI.middleware)
                .concat(filialsAPI.middleware)
                .concat(workTypesAPI.middleware)
                .concat(airportsAPI.middleware)
                .concat(employeeResponsibleAPI.middleware)
                .concat(flightFilialAPI.middleware)
                .concat(requestAPI.middleware)
                .concat(aircraftModelAPI.middleware)
                .concat(flightTargetAPI.middleware)
                .concat(empCustomerAPI.middleware)
                .concat(flightPlanAPI.middleware)
                .concat(fileStorageAPI.middleware)
                .concat(requestHelicopterAPI.middleware)
                .concat(airlinesAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
